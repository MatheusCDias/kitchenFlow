import { OrderState } from './states/OrderState';
import { ReceivedState } from './states/ReceivedState';
import { OrderStateEnum } from '../enums/OrderStateEnum';
import { OrderOriginEnum } from '../enums/OrderOriginEnum'; // Importado
import { Payment } from './payments/Payment';
import { Customer } from './Customer';
import { Service } from './service/Service';
import { OrderItem } from './OrderItem';
import { Employee } from './employee/Employee';

export class Order {
    private id: string;
    private orderCode: number;
    private origin: OrderOriginEnum; // Atualizado para Enum
    private promisedTime: Date;
    private createdAt: Date;
    private kitchenDeadline: Date;
    private orderDate: Date;
    private estimatedDeliveryDate: Date;

    private state: OrderState;
    private payments: Payment[];
    private customer?: Customer;
    private service?: Service;
    private items: OrderItem[];
    private assignedEmployee?: Employee;

    constructor(
        id: string,
        orderCode: number,
        origin: OrderOriginEnum,
        promisedTime: Date,
        kitchenDeadline: Date,
        estimatedDeliveryDate: Date,
        customer?: Customer,
        service?: Service,
        assignedEmployee?: Employee,
        orderDate: Date = new Date()
    ) {
        this.id = id;
        this.orderCode = orderCode;
        this.origin = origin;
        this.promisedTime = promisedTime;
        this.kitchenDeadline = kitchenDeadline;
        this.estimatedDeliveryDate = estimatedDeliveryDate;
        this.orderDate = orderDate;
        this.createdAt = new Date();

        this.state = new ReceivedState();
        this.payments = [];
        this.items = [];
        this.customer = customer;
        this.service = service;
        this.assignedEmployee = assignedEmployee;
    }

    // Métodos da classe
    public addItem(item: OrderItem): void { this.items.push(item); }
    public getItems(): OrderItem[] { return this.items; }
    public advanceStage(): void { this.state.advance(this); }
    public cancelOrder(): void { this.state.cancel(this); }
    public setState(state: OrderState): void { this.state = state; }
    public getStatus(): OrderStateEnum { return this.state.getStatus(); }
    public addPayment(payment: Payment): void { this.payments.push(payment); }
    public getPayments(): Payment[] { return this.payments; }
    public setAssignedEmployee(employee: Employee): void { this.assignedEmployee = employee; }
    public getAssignedEmployee(): Employee | undefined { return this.assignedEmployee; }
    public getCustomer(): Customer | undefined { return this.customer; }
    public getService(): Service | undefined { return this.service; }
    public getId(): string { return this.id; }
    public getOrderCode(): number { return this.orderCode; }
    public getOrigin(): OrderOriginEnum { return this.origin; }
}