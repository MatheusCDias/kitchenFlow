import { OrderState } from './OrderState';
import { Order } from '../Order';
import { OrderStateEnum } from '../../enums/OrderStateEnum';

export class CanceledState implements OrderState {
  advance(order: Order): void {
  }

  cancel(order: Order): void {
  }

  getStatus(): OrderStateEnum {
    return OrderStateEnum.CANCELLED;
  }
}