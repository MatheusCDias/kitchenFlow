// Reaproveita o domínio de verdade do app (mesmas classes, mesmas regras)
// em vez de duplicar a lógica de pedidos aqui no servidor.
import { Order } from '../../../src/models/Order';
import { OrderItem } from '../../../src/models/OrderItem';
import { OrderService } from '../../../src/services/OrderService';
import { OrderFactory } from '../../../src/factories/OrderFactory';
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
    items: OrderItemPayload[];
    deadlineMinutes: number;
    createdAt: string;
    kitchenDeadline: string;
    assignedStation: number | null;
    status: string;
    tableNumber?: number;
    preparationStartedAt?: string;
    preparationFinishedAt?: string;
}

export interface NewOrderItemInput {
    productName: string;
    quantity: number;
    notes?: string;
}

export interface NewOrderInput {
    items: NewOrderItemInput[];
    deadlineMinutes: number;
    tableNumber?: number;
}

// A partir daqui pra não colidir com os códigos 101-106 dos pedidos mockados.
let nextOrderCode = 200;

// "Funcionário" dessa bancada, só pra reaproveitar OrderService.claimOrder,
// que já sabe recusar conflito por employee.getId().
const stationCook = (stationNumber: number): Cook =>
    new Cook(`station-${stationNumber}`, `Bancada ${stationNumber}`, stationNumber, 'N/A');

const orderService = new OrderService(OrderFactory.createMockOrders());

const serializeOrder = (order: Order): OrderPayload => {
    const assignedEmployee = order.getAssignedEmployee();
    const service = order.getService();
    return {
        id: order.getId(),
        orderCode: order.getOrderCode(),
        items: order.getItems().map(item => ({
            id: item.getId(),
            productName: item.getProductName(),
            quantity: item.getQuantity(),
            notes: item.getNotes(),
        })),
        deadlineMinutes: order.getDeadlineMinutes(),
        createdAt: order.getCreatedAt().toISOString(),
        kitchenDeadline: order.getKitchenDeadline().toISOString(),
        assignedStation: assignedEmployee ? assignedEmployee.getStationNumber() : null,
        status: order.getStatus(),
        tableNumber: service instanceof TableService ? service.getTableNumber() : undefined,
        preparationStartedAt: order.getPreparationStartedAt()?.toISOString(),
        preparationFinishedAt: order.getPreparationFinishedAt()?.toISOString(),
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

// "Desistir": devolve o pedido pra fila, disponível pra qualquer bancada pegar de novo.
export const releaseOrderForStation = (orderId: string, stationNumber: number): OrderPayload => {
    const order = findOrderOrThrow(orderId);
    const employee = stationCook(stationNumber);

    if (order.getAssignedEmployee()?.getId() !== employee.getId()) {
        throw new HttpError(409, 'Esse pedido não está com essa bancada.');
    }

    orderService.releaseOrder(orderId);
    return serializeOrder(order);
};

// "Excluir": pedido do cliente foi cancelado — remove de vez, ninguém mais ve.
export const deleteOrderForStation = (orderId: string, stationNumber: number): void => {
    const order = findOrderOrThrow(orderId);
    const employee = stationCook(stationNumber);

    if (order.getAssignedEmployee()?.getId() !== employee.getId()) {
        throw new HttpError(409, 'Esse pedido não está com essa bancada.');
    }

    orderService.deleteOrder(orderId);
};

// Apaga os pedidos mockados e qualquer coisa criada até agora. Depois disso,
// só existem pedidos criados pela recepção, contando de novo a partir do 1.
export const resetAllOrders = (): void => {
    orderService.clearAllOrders();
    nextOrderCode = 1;
};

// Cria um pedido novo — usado pela recepção agora, e futuramente pela
// integração do iFood também (mesmo caminho, fonte diferente).
export const createOrder = (input: NewOrderInput): OrderPayload => {
    if (!input.items || input.items.length === 0) {
        throw new HttpError(400, 'O pedido precisa ter pelo menos um item.');
    }
    if (!input.deadlineMinutes || input.deadlineMinutes <= 0) {
        throw new HttpError(400, 'Prazo de preparo inválido.');
    }

    const orderCode = nextOrderCode++;
    const id = `ord-${orderCode}`;
    const now = new Date();
    const kitchenDeadline = new Date(now.getTime() + input.deadlineMinutes * 60000);
    const service = input.tableNumber
        ? new TableService(now, input.tableNumber, 1)
        : undefined;

    const order = new Order(
        id,
        orderCode,
        OrderOriginEnum.PRESENTIAL,
        kitchenDeadline,
        kitchenDeadline,
        kitchenDeadline,
        input.deadlineMinutes,
        undefined,
        service,
        undefined,
        now
    );

    input.items.forEach((item, index) => {
        order.addItem(new OrderItem(`${id}-item-${index}`, item.productName, item.quantity, now, item.notes));
    });

    orderService.addOrder(order);
    return serializeOrder(order);
};
