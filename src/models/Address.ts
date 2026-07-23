export class Address {
  private street: string;
  private number: number;
  private zipCode: string;
  private complement?: string;
  private referencePoint?: string;

  constructor(
    street: string,
    number: number,
    zipCode: string,
    complement?: string,
    referencePoint?: string
  ) {
    this.street = street;
    this.number = number;
    this.zipCode = zipCode;
    this.complement = complement;
    this.referencePoint = referencePoint;
  }

  // Getters & Setters
  public getStreet(): string { return this.street; }
  public getNumber(): number { return this.number; }
  public getZipCode(): string { return this.zipCode; }
  public getComplement(): string | undefined { return this.complement; }
  public getReferencePoint(): string | undefined { return this.referencePoint; }
}