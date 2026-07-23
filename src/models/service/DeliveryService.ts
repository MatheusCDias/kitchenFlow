import { Service } from './Service';
import { Address } from '../Address';

export class DeliveryService extends Service {
    private deliveryAddress: Address;

    constructor(estimatedDate: Date, deliveryAddress: Address, deliveryDate?: Date) {
        super(estimatedDate, deliveryDate);
        this.deliveryAddress = deliveryAddress;
    }

    public getDeliveryAddress(): Address {
        return this.deliveryAddress;
    }
}