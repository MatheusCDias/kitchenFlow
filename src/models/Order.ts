import { OrderState } from './states/OrderState';
import { ReceivedState } from './states/ReceivedState';
import { OrderStateEnum } from '../enums/OrderStateEnum';

export class Order {
    private id: string;
    private state: OrderState;

    constructor(id: string) {
        this.id = id;
        // Todo pedido começa no estado Recebido
        this.state = new ReceivedState();
    }

    public setState(state: OrderState): void {
        this.state = state;
    }

    public advance(): void {
        this.state.advance(this);
    }

    public cancel(): void {
        this.state.cancel(this);
    }

    public getStatus(): OrderStateEnum {
        return this.state.getStatus();
    }

    public getId(): string {
        return this.id;
    }
}