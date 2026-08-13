import { Order } from '../models/Order';
import { Employee } from '../models/employee/Employee';
import { OrderStateEnum } from '../enums/OrderStateEnum';

export class OrderService {
    private orders: Order[] = [];

    // Um pedido ativo por funcionário/bancada, não um só pro serviço inteiro.
    private activeOrdersByEmployee: Map<string, Order> = new Map();

    constructor(initialOrders: Order[] = []) {
        this.orders = initialOrders;
    }

    getAvailableOrders(): Order[] {
        return this.orders.filter(order =>
            !order.getAssignedEmployee() &&
            order.getStatus() === OrderStateEnum.RECEIVED
        );
    }

    getOrdersByEmployee(employee: Employee): Order[] {
        return this.orders.filter(order =>
            order.getAssignedEmployee()?.getId() === employee.getId()
        );
    }

    getActiveOrderForEmployee(employee: Employee): Order | null {
        return this.activeOrdersByEmployee.get(employee.getId()) ?? null;
    }

    claimOrder(orderId: string, employee: Employee): Order | null {
        if (this.activeOrdersByEmployee.has(employee.getId())) {
            return null;
        }
        const order = this.orders.find(o => o.getId() === orderId);

        if (!order || order.getAssignedEmployee()) return null;

        order.setAssignedEmployee(employee);

        order.advanceStage();

        order.startKitchenTimer();

        this.activeOrdersByEmployee.set(employee.getId(), order);

        return order;
    }

    completeOrder(orderId: string): boolean {
        const order = this.orders.find(o => o.getId() === orderId);

        if (!order) {
            return false;
        }

        // Marca o fim do preparo antes de avancar o estado,
        // para guardar o tempo real gasto na cozinha.
        order.finishKitchenTimer();

        order.advanceStage();

        const employeeId = order.getAssignedEmployee()?.getId();
        if (employeeId) {
            this.activeOrdersByEmployee.delete(employeeId);
        }

        return true;
    }

    /**
     * "Desistir": o funcionário devolve o pedido pra fila, sem cancelar o
     * pedido do cliente. Volta pro estado Recebido, solto pra outra bancada pegar.
     */
    releaseOrder(orderId: string): boolean {
        const order = this.orders.find(o => o.getId() === orderId);

        if (!order) {
            return false;
        }

        const employeeId = order.getAssignedEmployee()?.getId();

        // Reseta funcionário e estado do pedido para ReceivedState
        order.resetOrder();

        if (employeeId) {
            this.activeOrdersByEmployee.delete(employeeId);
        }

        return true;
    }

    /**
     * "Excluir": o pedido do cliente foi cancelado de verdade — some da
     * lista, ninguém mais vê ele (diferente de releaseOrder, que só solta).
     */
    deleteOrder(orderId: string): boolean {
        const index = this.orders.findIndex(o => o.getId() === orderId);

        if (index === -1) {
            return false;
        }

        const employeeId = this.orders[index].getAssignedEmployee()?.getId();
        if (employeeId) {
            this.activeOrdersByEmployee.delete(employeeId);
        }

        this.orders.splice(index, 1);

        return true;
    }

    addOrder(order: Order): void {
        this.orders.push(order);
    }

    /** Apaga tudo — usado só pelo botão de reiniciar o ambiente de testes. */
    clearAllOrders(): void {
        this.orders = [];
        this.activeOrdersByEmployee.clear();
    }

    getAllOrders(): Order[] {
        return [...this.orders];
    }
}
