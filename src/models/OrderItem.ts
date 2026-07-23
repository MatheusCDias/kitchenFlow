import { MenuItem } from './menu/MenuItem';
import { Recipe } from './kitchen/Recipe';

export class OrderItem {
  private id: string;
  private productName: string;
  private quantity: number;
  private notes?: string;
  private prepDate?: Date;
  private estimatedDate: Date;

  // Associações
  private menuItem?: MenuItem;
  private recipe?: Recipe;

  constructor(
    id: string,
    productName: string,
    quantity: number,
    estimatedDate: Date,
    notes?: string,
    menuItem?: MenuItem,
    recipe?: Recipe,
    prepDate?: Date
  ) {
    this.id = id;
    this.productName = productName;
    this.quantity = quantity;
    this.estimatedDate = estimatedDate;
    this.notes = notes;
    this.menuItem = menuItem;
    this.recipe = recipe;
    this.prepDate = prepDate;
  }

  public getId(): string { return this.id; }
  public getProductName(): string { return this.productName; }
  public getQuantity(): number { return this.quantity; }
  public getMenuItem(): MenuItem | undefined { return this.menuItem; }
  public getRecipe(): Recipe | undefined { return this.recipe; }
}