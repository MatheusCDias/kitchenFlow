import { Order } from '../models/Order';
import { Employee } from '../models/employee/Employee';
import { OrderStateEnum } from '../enums/OrderStateEnum';

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

        order.setAssignedEmployee(employee);

        order.advanceStage();

        order.startKitchenTimer();

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
}