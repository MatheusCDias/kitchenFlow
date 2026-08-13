import { OrderState } from './states/OrderState';
import { ReceivedState } from './states/ReceivedState';
import { OrderStateEnum } from '../enums/OrderStateEnum';
import { OrderOriginEnum } from '../enums/OrderOriginEnum';
import { Payment } from './payments/Payment';
import { Customer } from './Customer';
import { Service } from './service/Service';
import { OrderItem } from './OrderItem';
import { Employee } from './employee/Employee';

export class Order {
    private id: string;
    private orderCode: number;
    private origin: OrderOriginEnum;
    private promisedTime: Date;
    private createdAt: Date;
    private kitchenDeadline: Date;
    private orderDate: Date;
    private estimatedDeliveryDate: Date;

    // Quantos minutos a cozinha tem para preparar este pedido.
    // Serve de base para recalcular o prazo quando o preparo comeca de fato.
    private deadlineMinutes: number;

    // Marcos de tempo do preparo (ficam vazios ate o preparo comecar/terminar).
    private preparationStartedAt?: Date;
    private preparationFinishedAt?: Date;

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
        deadlineMinutes: number,
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
        this.deadlineMinutes = deadlineMinutes;
        this.orderDate = orderDate;
        this.createdAt = new Date();

        this.state = new ReceivedState();
        this.payments = [];
        this.items = [];
        this.customer = customer;
        this.service = service;
        this.assignedEmployee = assignedEmployee;
    }

    // ----- Itens e pagamentos -----
    public addItem(item: OrderItem): void { this.items.push(item); }
    public getItems(): OrderItem[] { return this.items; }
    public addPayment(payment: Payment): void { this.payments.push(payment); }
    public getPayments(): Payment[] { return this.payments; }

    // ----- Estado do pedido -----
    public advanceStage(): void { this.state.advance(this); }
    public cancelOrder(): void { this.state.cancel(this); }
    public setState(state: OrderState): void { this.state = state; }
    public getStatus(): OrderStateEnum { return this.state.getStatus(); }

    // ----- Cronometro da cozinha -----

    /**
     * Marca o inicio do preparo. O prazo da cozinha (kitchenDeadline) nao
     * e recalculado aqui: ele comeca a contar desde a criacao do pedido,
     * entao pegar o pedido mais tarde nao pode dar um prazo novo de brinde.
     * Se o preparo ja tiver comecado, nao faz nada (evita reiniciar o marco).
     */
    public startKitchenTimer(): void {
        if (this.preparationStartedAt) {
            return;
        }
        this.preparationStartedAt = new Date();
    }

    /**
     * Marca o fim do preparo. So funciona se o preparo tiver comecado
     * e ainda nao tiver sido finalizado.
     */
    public finishKitchenTimer(): void {
        if (!this.preparationStartedAt || this.preparationFinishedAt) {
            return;
        }
        this.preparationFinishedAt = new Date();
    }

    /**
     * Quantos segundos faltam para o prazo da cozinha.
     * Negativo significa que o pedido ja passou do prazo.
     * Depois que o preparo termina, o valor congela no resultado final.
     */
    public getRemainingSeconds(reference: Date = new Date()): number {
        const moment = this.preparationFinishedAt ?? reference;
        return Math.round((this.kitchenDeadline.getTime() - moment.getTime()) / 1000);
    }

    /** True quando o prazo da cozinha ja estourou. */
    public isLate(reference: Date = new Date()): boolean {
        return this.getRemainingSeconds(reference) < 0;
    }

    /**
     * Tempo real de preparo em segundos (do inicio ate a conclusao).
     * Retorna undefined enquanto o preparo nao terminou.
     * Esse numero e a base das futuras analises de produtividade.
     */
    public getPreparationSeconds(): number | undefined {
        if (!this.preparationStartedAt || !this.preparationFinishedAt) {
            return undefined;
        }
        return Math.round(
            (this.preparationFinishedAt.getTime() - this.preparationStartedAt.getTime()) / 1000
        );
    }

    /**
     * Devolve o pedido para a lista de disponiveis: volta ao estado Recebido,
     * solta o funcionario responsavel e zera os marcos de tempo do preparo.
     */
    public resetOrder(): void {
        this.state = new ReceivedState();
        this.assignedEmployee = undefined;
        this.preparationStartedAt = undefined;
        this.preparationFinishedAt = undefined;
    }

    // ----- Funcionario responsavel -----
    public setAssignedEmployee(employee: Employee): void { this.assignedEmployee = employee; }
    public getAssignedEmployee(): Employee | undefined { return this.assignedEmployee; }

    // ----- Getters -----
    public getId(): string { return this.id; }
    public getOrderCode(): number { return this.orderCode; }
    public getOrigin(): OrderOriginEnum { return this.origin; }
    public getCustomer(): Customer | undefined { return this.customer; }
    public getService(): Service | undefined { return this.service; }
    public getPromisedTime(): Date { return this.promisedTime; }
    public getKitchenDeadline(): Date { return this.kitchenDeadline; }
    public getEstimatedDeliveryDate(): Date { return this.estimatedDeliveryDate; }
    public getDeadlineMinutes(): number { return this.deadlineMinutes; }
    public getOrderDate(): Date { return this.orderDate; }
    public getCreatedAt(): Date { return this.createdAt; }
    public getPreparationStartedAt(): Date | undefined { return this.preparationStartedAt; }
    public getPreparationFinishedAt(): Date | undefined { return this.preparationFinishedAt; }

    /**
     * Só usado pra reconstruir um pedido a partir de dados que já vieram
     * de outro lugar (ex: JSON do servidor) — não é uma acao do dia a dia,
     * é diferente de startKitchenTimer/finishKitchenTimer, que marcam "agora".
     */
    public setPreparationTimestamps(startedAt?: Date, finishedAt?: Date): void {
        this.preparationStartedAt = startedAt;
        this.preparationFinishedAt = finishedAt;
    }
}
