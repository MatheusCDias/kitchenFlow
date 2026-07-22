import { OrderState } from './OrderState';
import { Order } from '../Order';
import { DeliveredState } from './DeliveredState';
import { CanceledState } from './CanceledState';
import { OrderStateEnum } from '../../enums/OrderStateEnum';

export class OnTheWayState implements OrderState {
    advance(order: Order): void {
        order.setState(new DeliveredState());
    }

    cancel(order: Order): void {
        order.setState(new CanceledState());
    }

    getStatus(): OrderStateEnum {
        return OrderStateEnum.ON_THE_WAY;
    }
}