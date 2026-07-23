import { Employee } from './Employee';

export class Cook extends Employee {
    private isAvailable: boolean;
    private totalOrdersCompleted: number;

    constructor(
        id: string,
        name: string,
        stationNumber: number,
        shift: string,
        isAvailable: boolean = true,
        totalOrdersCompleted: number = 0
    ) {
        super(id, name, 'Cook', stationNumber, shift);
        this.isAvailable = isAvailable;
        this.totalOrdersCompleted = totalOrdersCompleted;
    }

    public setAvailability(status: boolean): void {
        this.isAvailable = status;
    }

    public incrementOrdersCompleted(): void {
        this.totalOrdersCompleted += 1;
    }

    public getIsAvailable(): boolean { return this.isAvailable; }
    public getTotalOrdersCompleted(): number { return this.totalOrdersCompleted; }
}