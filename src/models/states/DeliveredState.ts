import { OrderState } from './OrderState';
import { Order } from '../Order';
import { OrderStateEnum } from '../../enums/OrderStateEnum';

export class DeliveredState implements OrderState {
  advance(order: Order): void {
    console.warn('Order is already delivered.');
  }

  cancel(order: Order): void {
    console.warn('Cannot cancel a delivered order.');
  }

  getStatus(): OrderStateEnum {
    return OrderStateEnum.DELIVERED;
  }
}