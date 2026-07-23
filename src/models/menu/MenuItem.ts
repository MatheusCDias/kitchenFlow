export abstract class MenuItem {
    protected id: string;
    protected name: string;
    protected price: number;
    protected description: string;
    protected year: number;
    protected month: number;

    constructor(
        id: string,
        name: string,
        price: number,
        description: string,
        year: number,
        month: number
    ) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.description = description;
        this.year = year;
        this.month = month;
    }

    public getId(): string { return this.id; }
    public getName(): string { return this.name; }
    public getPrice(): number { return this.price; }
}