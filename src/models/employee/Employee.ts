export class Employee {
    protected id: string;
    protected name: string;
    protected role: string;
    protected shift: string;

    constructor(id: string, name: string, role: string, shift: string) {
        this.id = id;
        this.name = name;
        this.role = role;
        this.shift = shift;
    }

    public getId(): string { return this.id; }
    public getName(): string { return this.name; }
    public getRole(): string { return this.role; }
    public getShift(): string { return this.shift; }
}