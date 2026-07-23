import { Service } from './Service';

export class TableService extends Service {
    private tableNumber: number;
    private customerCount: number;

    constructor(estimatedDate: Date, tableNumber: number, customerCount: number, deliveryDate?: Date) {
        super(estimatedDate, deliveryDate);
        this.tableNumber = tableNumber;
        this.customerCount = customerCount;
    }

    public getTableNumber(): number { return this.tableNumber; }
    public getCustomerCount(): number { return this.customerCount; }
}