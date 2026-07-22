import { OrderState } from './OrderState';
import { Order } from '../Order';
import { OrderStateEnum } from '../../enums/OrderStateEnum';

export class CanceledState implements OrderState {
  advance(order: Order): void {
    console.warn('Cannot advance a canceled order.');
  }

  cancel(order: Order): void {
    console.warn('Order is already canceled.');
  }

  getStatus(): OrderStateEnum {
    return OrderStateEnum.CANCELLED;
  }
}