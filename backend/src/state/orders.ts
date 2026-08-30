// Reaproveita o domínio de verdade do app (mesmas classes, mesmas regras)
// em vez de duplicar a lógica de pedidos aqui no servidor.
import { Order } from '../../../src/models/Order';
import { OrderItem } from '../../../src/models/OrderItem';
import { OrderService } from '../../../src/services/OrderService';
import { Cook } from '../../../src/models/employee/Cook';
import { TableService } from '../../../src/models/service/TableService';
import { OrderOriginEnum } from '../../../src/enums/OrderOriginEnum';
import { HttpError } from '../errors/HttpError';

export interface OrderItemPayload {
    id: string;
    productName: string;
    quantity: number;
    notes?: string;
}

export interface OrderPayload {
    id: string;
    orderCode: number;
    origin: string;
    items: OrderItemPayload[];
    prepMinutes: number;
    kitchenDeadline: string;
    completedAt?: string;
    assignedStation: number | null;
    status: string;
    tableNumber?: number;
}

export interface NewOrderItemInput {
    productName: string;
    quantity: number;
    notes?: string;
}

export interface NewOrderInput {
    items: NewOrderItemInput[];
    prepMinutes: number;
    tableNumber?: number;
}

// "Funcionário" dessa bancada, só pra reaproveitar OrderService.claimOrder,
// que já sabe recusar conflito por employee.getId().
const stationCook = (stationNumber: number): Cook =>
    new Cook(`station-${stationNumber}`, `Bancada ${stationNumber}`, stationNumber, 'N/A');

const orderService = new OrderService();

const serializeOrder = (order: Order): OrderPayload => {
    const assignedEmployee = order.getAssignedEmployee();
    const service = order.getService();
    return {
        id: order.getId(),
        orderCode: order.getOrderCode(),
        origin: order.getOrigin(),
        items: order.getItems().map(item => ({
            id: item.getId(),
            productName: item.getProductName(),
            quantity: item.getQuantity(),
            notes: item.getNotes(),
        })),
        prepMinutes: order.getPrepMinutes(),
        kitchenDeadline: order.getKitchenDeadline().toISOString(),
        completedAt: order.getCompletedAt()?.toISOString(),
        assignedStation: assignedEmployee ? assignedEmployee.getStationNumber() : null,
        status: order.getStatus(),
        tableNumber: service instanceof TableService ? service.getTableNumber() : undefined,
    };
};

const findOrderOrThrow = (orderId: string): Order => {
    const order = orderService.getAllOrders().find(o => o.getId() === orderId);
    if (!order) {
        throw new HttpError(404, 'Pedido não encontrado.');
    }
    return order;
};

export const getAllOrders = (): OrderPayload[] =>
    orderService.getAllOrders().map(serializeOrder);

export const claimOrderForStation = (orderId: string, stationNumber: number): OrderPayload => {
    const order = findOrderOrThrow(orderId);
    const employee = stationCook(stationNumber);

    if (order.getAssignedEmployee()) {
        throw new HttpError(409, 'Esse pedido já foi pego por outra bancada.');
    }
    if (orderService.getActiveOrderForEmployee(employee)) {
        throw new HttpError(409, 'Essa bancada já tem um pedido em preparo.');
    }

    const claimed = orderService.claimOrder(orderId, employee);
    if (!claimed) {
        throw new HttpError(409, 'Não foi possível pegar esse pedido.');
    }
    return serializeOrder(claimed);
};

export const completeOrderForStation = (orderId: string, stationNumber: number): OrderPayload => {
    const order = findOrderOrThrow(orderId);
    const employee = stationCook(stationNumber);

    if (order.getAssignedEmployee()?.getId() !== employee.getId()) {
        throw new HttpError(409, 'Esse pedido não está com essa bancada.');
    }

    orderService.completeOrder(orderId);
    return serializeOrder(order);
};

// "Cancelar" nessa tela hoje significa devolver o pedido pra fila
// (OrderService.cancelOrder chama order.resetOrder por baixo) — mantive
// o mesmo comportamento que já existia, só movido pro servidor.
export const cancelOrderForStation = (orderId: string, stationNumber: number): OrderPayload => {
    const order = findOrderOrThrow(orderId);
    const employee = stationCook(stationNumber);

    if (order.getAssignedEmployee()?.getId() !== employee.getId()) {
        throw new HttpError(409, 'Esse pedido não está com essa bancada.');
    }

    orderService.cancelOrder(orderId);
    return serializeOrder(order);
};

// Cria um pedido novo — usado pela recepção. O prazo é fixado a partir de
// agora (na criação), e não muda mais depois disso.
export const createOrder = (input: NewOrderInput): OrderPayload => {
    if (!input.items || input.items.length === 0) {
        throw new HttpError(400, 'O pedido precisa ter pelo menos um item.');
    }
    if (!input.prepMinutes || input.prepMinutes <= 0) {
        throw new HttpError(400, 'Prazo de preparo inválido.');
    }

    const orderCode = orderService.getNextAvailableCode();
    const id = `ord-${orderCode}-${Date.now()}`;
    const now = new Date();
    const kitchenDeadline = new Date(now.getTime() + input.prepMinutes * 60000);
    const promisedTime = new Date(now.getTime() + (input.prepMinutes + 5) * 60000);
    const estimatedDeliveryDate = new Date(now.getTime() + (input.prepMinutes + 15) * 60000);
    const service = input.tableNumber
        ? new TableService(now, input.tableNumber, 1)
        : undefined;

    const order = new Order(
        id,
        orderCode,
        OrderOriginEnum.PRESENTIAL,
        promisedTime,
        kitchenDeadline,
        estimatedDeliveryDate,
        input.prepMinutes,
        undefined, // customer
        service,
        undefined, // assignedEmployee
        now
    );

    input.items.forEach((item, index) => {
        order.addItem(new OrderItem(`${id}-item-${index}`, item.productName, item.quantity, now, item.notes));
    });

    orderService.addOrder(order);
    return serializeOrder(order);
};
