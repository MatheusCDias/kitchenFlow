import { Payment } from './Payment';

export class PixPayment extends Payment {
  private key: string;
  private qrCode: string;

  constructor(
    itemsAmount: number,
    key: string,
    qrCode: string,
    deliveryFee?: number,
    couponCode?: string,
    discountAmount?: number
  ) {
    super(itemsAmount, deliveryFee, couponCode, discountAmount);
    this.key = key;
    this.qrCode = qrCode;
  }

  public processPayment(): boolean {
    console.log(`[PIX] Generating QR Code for key: ${this.key}`);
    console.log(`[PIX] Processing amount: $${this.totalAmount.toFixed(2)}`);
    return true;
  }

  public getKey(): string {
    return this.key;
  }

  public getQrCode(): string {
    return this.qrCode;
  }
}