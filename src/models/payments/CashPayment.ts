import { Payment } from './Payment';

export class CashPayment extends Payment {
    private changeAmount: number;

    constructor(
        itemsAmount: number,
        cashGiven: number,
        deliveryFee?: number,
        couponCode?: string,
        discountAmount?: number
    ) {
        super(itemsAmount, deliveryFee, couponCode, discountAmount);
        this.changeAmount = cashGiven - this.totalAmount;
    }

    public processPayment(): boolean {
        if (this.changeAmount < 0) {
            console.warn(`[CASH] Insufficient amount! Short by: $${Math.abs(this.changeAmount).toFixed(2)}`);
            return false;
        }
        console.log(`[CASH] Payment received. Change to return: $${this.changeAmount.toFixed(2)}`);
        return true;
    }

    public getChangeAmount(): number {
        return this.changeAmount;
    }
}