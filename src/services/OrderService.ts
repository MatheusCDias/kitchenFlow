import { Order } from '../models/Order';
import { Employee } from '../models/employee/Employee';
import { OrderStateEnum } from '../enums/OrderStateEnum';
import { ReceivedState } from '../models/states/ReceivedState';

export class OrderService {
    private orders: Order[] = [];

    // Um pedido ativo por bancada/funcionário, não um só pro sistema inteiro —
    // com várias bancadas reais, só uma conseguia trabalhar de cada vez antes.
    private activeOrdersByEmployee: Map<string, Order> = new Map();

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

    getActiveOrderForEmployee(employee: Employee): Order | null {
        return this.activeOrdersByEmployee.get(employee.getId()) ?? null;
    }

    claimOrder(orderId: string, employee: Employee): Order | null {
        if (this.activeOrdersByEmployee.has(employee.getId())) {
            return null;
        }

        const order = this.orders.find((o) => o.getId() === orderId);

        if (!order || order.getAssignedEmployee()) return null;

        order.setAssignedEmployee(employee);
        order.advanceStage();
        order.startKitchenTimer();

        this.activeOrdersByEmployee.set(employee.getId(), order);

        return order;
    }

    completeOrder(orderId: string): boolean {
        const order = this.orders.find((o) => o.getId() === orderId);

        if (!order) {
            return false;
        }

        // Marca o fim antes de avançar o estado, pra guardar o instante exato.
        order.finishKitchenTimer();
        order.advanceStage();

        const employeeId = order.getAssignedEmployee()?.getId();
        if (employeeId) {
            this.activeOrdersByEmployee.delete(employeeId);
        }

        return true;
    }

    getAllOrders(): Order[] {
        return [...this.orders];
    }

    releaseOrder(orderId: string): boolean {
        const order = this.orders.find((o) => o.getId() === orderId);
        if (!order) return false;

        const employeeId = order.getAssignedEmployee()?.getId();

        order.setAssignedEmployee(undefined as any);
        order.setState(new ReceivedState());

        if (employeeId) {
            this.activeOrdersByEmployee.delete(employeeId);
        }

        return true;
    }

    cancelOrder(orderId: string): boolean {
        const order = this.orders.find((o) => o.getId() === orderId);

        if (!order) {
            return false;
        }

        const employeeId = order.getAssignedEmployee()?.getId();

        order.resetOrder();

        if (employeeId) {
            this.activeOrdersByEmployee.delete(employeeId);
        }

        return true;
    }
}
