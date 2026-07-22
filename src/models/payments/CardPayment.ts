import { Payment } from './Payment';
import { CardTypeEnum } from '../../enums/CardTypeEnum';

export class CardPayment extends Payment {
  private type: CardTypeEnum;
  private cardNumber: string;
  private brand: string;

  constructor(
    itemsAmount: number,
    type: CardTypeEnum,
    cardNumber: string,
    brand: string,
    deliveryFee?: number,
    couponCode?: string,
    discountAmount?: number
  ) {
    super(itemsAmount, deliveryFee, couponCode, discountAmount);
    this.type = type;
    this.cardNumber = cardNumber;
    this.brand = brand;
  }

  public processPayment(): boolean {
    console.log(`[CARD] Processing ${this.type} (${this.brand}) ending in ${this.cardNumber.slice(-4)}`);
    console.log(`[CARD] Amount charged: $${this.totalAmount.toFixed(2)}`);
    return true;
  }

  public getType(): CardTypeEnum {
    return this.type;
  }

  public getBrand(): string {
    return this.brand;
  }
}