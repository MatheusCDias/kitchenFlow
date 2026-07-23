export class Ingredient {
    private id: string;
    private productName: string;
    private stockQuantity: number;
    private recipeQuantity: number;
    private unitOfMeasure: string;

    constructor(
        id: string,
        productName: string,
        stockQuantity: number,
        recipeQuantity: number,
        unitOfMeasure: string
    ) {
        this.id = id;
        this.productName = productName;
        this.stockQuantity = stockQuantity;
        this.recipeQuantity = recipeQuantity;
        this.unitOfMeasure = unitOfMeasure;
    }

    // Getters & Setters
    public getId(): string { return this.id; }
    public getProductName(): string { return this.productName; }
    public getStockQuantity(): number { return this.stockQuantity; }
    public getRecipeQuantity(): number { return this.recipeQuantity; }
    public getUnitOfMeasure(): string { return this.unitOfMeasure; }
}