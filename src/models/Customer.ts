import { Address } from './Address';

export class Customer {
  private id: string;
  private name: string;
  private phone: string;
  private totalOrders: number;
  private addresses: Address[];

  constructor(id: string, name: string, phone: string, totalOrders: number = 0) {
    this.id = id;
    this.name = name;
    this.phone = phone;
    this.totalOrders = totalOrders;
    this.addresses = [];
  }

  public addAddress(address: Address): void {
    this.addresses.push(address);
  }

  public incrementTotalOrders(): void {
    this.totalOrders += 1;
  }

  // Getters
  public getId(): string { return this.id; }
  public getName(): string { return this.name; }
  public getPhone(): string { return this.phone; }
  public getTotalOrders(): number { return this.totalOrders; }
  public getAddresses(): Address[] { return this.addresses; }
}