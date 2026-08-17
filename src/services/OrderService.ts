import { Order } from '../models/Order';
import { Employee } from '../models/employee/Employee';
import { OrderStateEnum } from '../enums/OrderStateEnum';
import { ReceivedState } from '../models/states/ReceivedState';

export class OrderService {
    private orders: Order[] = [];
    private activeOrder: Order | null = null;

    constructor(initialOrders: Order[] = []) {
        this.orders = initialOrders;
    }

    getAvailableOrders(): Order[] {
        return this.orders.filter(order =>
            !order.getAssignedEmployee() &&
            order.getStatus() === OrderStateEnum.PENDING
        );
    }

    getOrdersByEmployee(employee: Employee): Order[] {
        return this.orders.filter(order =>
            order.getAssignedEmployee()?.getId() === employee.getId()
        );
    }

    claimOrder(orderId: string, employee: Employee): Order | null {
        if (this.activeOrder !== null) {
            return null;
        }

        const order = this.orders.find(o => o.getId() === orderId);

        if (!order || order.getAssignedEmployee()) return null;

        // 1. Atribui o funcionário
        order.setAssignedEmployee(employee);

        // 2. Avança o estado (RECEIVED -> IN_PREPARATION)
        order.advanceStage();

        // 3. Inicia a contagem de tempo
        order.startKitchenTimer();

        // 4. Define o pedido na workspace
        this.activeOrder = order;

        return order;
    }

    completeOrder(orderId: string): boolean {
        const order = this.orders.find(o => o.getId() === orderId);

        if (!order) {
            return false;
        }

        order.advanceStage();

        this.activeOrder = null;

        return true;
    }

    getActiveOrder(): Order | null {
        return this.activeOrder;
    }

    addOrder(order: Order): void {
        this.orders.push(order);
    }

    getAllOrders(): Order[] {
        return [...this.orders];
    }

    releaseOrder(orderId: string): boolean {
        const order = this.orders.find(o => o.getId() === orderId);
        if (!order) return false;

        order.setAssignedEmployee(undefined as any);

        order.setState(new ReceivedState());

        // Limpa a Área de Trabalho
        this.activeOrder = null;

        return true;
    }

    // Adicione dentro da classe OrderService:

    cancelOrder(orderId: string): boolean {
        const order = this.orders.find(o => o.getId() === orderId);

        if (!order) {
            return false;
        }

        // Reseta funcionário e estado do pedido para ReceivedState
        order.resetOrder();

        // Remove da área de trabalho
        this.activeOrder = null;

        return true;
    }
}