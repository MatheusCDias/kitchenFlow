export abstract class Payment {
    protected itemsAmount: number;
    protected deliveryFee: number;
    protected totalAmount: number;
    protected couponCode?: string;
    protected discountAmount: number;

    constructor(
        itemsAmount: number,
        deliveryFee: number = 0,
        couponCode?: string,
        discountAmount: number = 0
    ) {
        this.itemsAmount = itemsAmount;
        this.deliveryFee = deliveryFee;
        this.couponCode = couponCode;
        this.discountAmount = discountAmount;
        this.totalAmount = this.calculateTotal();
    }

    protected calculateTotal(): number {
        const total = this.itemsAmount + this.deliveryFee - this.discountAmount;
        return total > 0 ? total : 0;
    }

    public abstract processPayment(): boolean;

    public getTotalAmount(): number {
        return this.totalAmount;
    }

    public getItemsAmount(): number {
        return this.itemsAmount;
    }

    public getDeliveryFee(): number {
        return this.deliveryFee;
    }
}