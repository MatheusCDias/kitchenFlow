export abstract class Service {
  protected deliveryDate?: Date;
  protected estimatedDate: Date;

  constructor(estimatedDate: Date, deliveryDate?: Date) {
    this.estimatedDate = estimatedDate;
    this.deliveryDate = deliveryDate;
  }

  public setDeliveryDate(date: Date): void {
    this.deliveryDate = date;
  }

  public getEstimatedDate(): Date { return this.estimatedDate; }
  public getDeliveryDate(): Date | undefined { return this.deliveryDate; }
}