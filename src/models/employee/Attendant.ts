import { Employee } from './Employee';

export class Attendant extends Employee {
    private totalOrdersCreated: number;

    constructor(id: string, name: string, stationNumber: number, shift: string, totalOrdersCreated: number = 0) {
        super(id, name, 'Attendant', stationNumber, shift);
        this.totalOrdersCreated = totalOrdersCreated;
    }

    public incrementOrdersCreated(): void {
        this.totalOrdersCreated += 1;
    }

    public getTotalOrdersCreated(): number { return this.totalOrdersCreated; }
}