export abstract class Employee {
    protected id: string;
    protected name: string;
    protected role: string;
    protected stationNumber: number; // 'numeroBancada'
    protected shift: string;         // 'turno'

    constructor(id: string, name: string, role: string, stationNumber: number, shift: string) {
        this.id = id;
        this.name = name;
        this.role = role;
        this.stationNumber = stationNumber;
        this.shift = shift;
    }

    public getId(): string { return this.id; }
    public getName(): string { return this.name; }
}