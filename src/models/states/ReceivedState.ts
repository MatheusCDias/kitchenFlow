import { OrderState } from './OrderState';
import { Order } from '../Order';
import { InPreparationState } from './InPreparationState';
import { CanceledState } from './CanceledState';
import { OrderStateEnum } from '../../enums/OrderStateEnum';

export class ReceivedState implements OrderState {
  advance(order: Order): void {
    order.setState(new InPreparationState());
  }

  cancel(order: Order): void {
    order.setState(new CanceledState());
  }

  getStatus(): OrderStateEnum {
    return OrderStateEnum.RECEIVED;
  }
}