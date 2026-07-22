import { OrderState } from './OrderState';
import { Order } from '../Order';
import { ReadyState } from './ReadyState';
import { CanceledState } from './CanceledState';
import { OrderStateEnum } from '../../enums/OrderStateEnum';

export class InPreparationState implements OrderState {
  advance(order: Order): void {
    order.setState(new ReadyState());
  }

  cancel(order: Order): void {
    order.setState(new CanceledState());
  }

  getStatus(): OrderStateEnum {
    return OrderStateEnum.IN_PREPARATION;
  }
}