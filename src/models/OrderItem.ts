

export class OrderItem {
  private id: string;
  private productName: string;
  private quantity: number;
  private observation: string;
  private preparationDate: Date;
  private estimatedDate: Date;

  constructor(
    id: string,
    productName: string,
    quantity: number,
    observation: string = '',
    preparationDate: Date = new Date(),
    estimatedDate: Date = new Date()
  ) {
    this.id = id;
    this.productName = productName;
    this.quantity = quantity;
    this.observation = observation;
    this.preparationDate = preparationDate;
    this.estimatedDate = estimatedDate;
  }

  // Getters & Setters
  public get details(): string {
    const obsText = this.observation ? ` (${this.observation})` : '';
    return `${this.quantity}x ${this.productName}${obsText}`;
  }

  public get getId(): string {
    return this.id;
  }
}