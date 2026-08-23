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

    public getNextAvailableCode(startCode: number = 101, maxCode: number = 999): number {
        const busyCodes = new Set(
            this.orders
                .filter(
                    (order) =>
                        order.getStatus() !== OrderStateEnum.COMPLETED &&
                        order.getStatus() !== OrderStateEnum.CANCELLED
                )
                .map((order) => order.getOrderCode())
        );

        for (let code = startCode; code <= maxCode; code++) {
            if (!busyCodes.has(code)) {
                return code;
            }
        }

        throw new Error('Todas as comandas disponíveis estão ocupadas no momento.');
    }

    addOrder(order: Order): void {
        this.orders.push(order);
    }

    getAvailableOrders(): Order[] {
        return this.orders.filter(
            (order) =>
                !order.getAssignedEmployee() &&
                order.getStatus() === OrderStateEnum.PENDING
        );
    }

    getOrdersByEmployee(employee: Employee): Order[] {
        return this.orders.filter(
            (order) => order.getAssignedEmployee()?.getId() === employee.getId()
        );
    }

    claimOrder(orderId: string, employee: Employee): Order | null {
        if (this.activeOrder !== null) {
            return null;
        }

        const order = this.orders.find((o) => o.getId() === orderId);

        if (!order || order.getAssignedEmployee()) return null;

        order.setAssignedEmployee(employee);
        order.advanceStage();
        order.startKitchenTimer();

        this.activeOrder = order;

        return order;
    }

    completeOrder(orderId: string): boolean {
        const order = this.orders.find((o) => o.getId() === orderId);

        if (!order) {
            return false;
        }

        order.advanceStage();

        if (this.activeOrder?.getId() === orderId) {
            this.activeOrder = null;
        }

        return true;
    }

    getActiveOrder(): Order | null {
        return this.activeOrder;
    }

    getAllOrders(): Order[] {
        return [...this.orders];
    }

    releaseOrder(orderId: string): boolean {
        const order = this.orders.find((o) => o.getId() === orderId);
        if (!order) return false;

        order.setAssignedEmployee(undefined as any);
        order.setState(new ReceivedState());

        if (this.activeOrder?.getId() === orderId) {
            this.activeOrder = null;
        }

        return true;
    }

    cancelOrder(orderId: string): boolean {
        const order = this.orders.find((o) => o.getId() === orderId);

        if (!order) {
            return false;
        }

        order.resetOrder();

        if (this.activeOrder?.getId() === orderId) {
            this.activeOrder = null;
        }

        return true;
    }
}