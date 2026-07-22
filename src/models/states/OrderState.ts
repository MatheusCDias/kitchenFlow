import { Order } from '../Order';
import { OrderStateEnum } from '../../enums/OrderStateEnum';

export interface OrderState {
  advance(order: Order): void;
  cancel(order: Order): void;
  getStatus(): OrderStateEnum;
}