import { OrderState } from './OrderState';
import { Order } from '../Order';
import { OnTheWayState } from './OnTheWayState';
import { CanceledState } from './CanceledState';
import { OrderStateEnum } from '../../enums/OrderStateEnum';

export class ReadyState implements OrderState {
  advance(order: Order): void {
    order.setState(new OnTheWayState());
  }

  cancel(order: Order): void {
    order.setState(new CanceledState());
  }

  getStatus(): OrderStateEnum {
    return OrderStateEnum.READY;
  }
}