import { MenuItem } from './MenuItem';
import { CategoryEnum } from '../../enums/CategoryEnum';

export class FoodItem extends MenuItem {
  private estimatedPrepTime: Date;
  private category: CategoryEnum;
  private servesPeople: number;

  constructor(
    id: string,
    name: string,
    price: number,
    description: string,
    year: number,
    month: number,
    estimatedPrepTime: Date,
    category: CategoryEnum,
    servesPeople: number
  ) {
    super(id, name, price, description, year, month);
    this.estimatedPrepTime = estimatedPrepTime;
    this.category = category;
    this.servesPeople = servesPeople;
  }

  public getEstimatedPrepTime(): Date { return this.estimatedPrepTime; }
  public getCategory(): CategoryEnum { return this.category; }
  public getServesPeople(): number { return this.servesPeople; }
}