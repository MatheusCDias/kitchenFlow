import { Ingredient } from './Ingredient';

export class Recipe {
  private id: string;
  private prepInstructions: string;
  private estimatedPrepTime: Date;
  private recipeYield: number;
  private totalCost: number;
  private ingredients: Ingredient[];

  constructor(
    id: string,
    prepInstructions: string,
    estimatedPrepTime: Date,
    recipeYield: number,
    totalCost: number,
    ingredients: Ingredient[] = []
  ) {
    this.id = id;
    this.prepInstructions = prepInstructions;
    this.estimatedPrepTime = estimatedPrepTime;
    this.recipeYield = recipeYield;
    this.totalCost = totalCost;
    this.ingredients = ingredients;
  }

  public addIngredient(ingredient: Ingredient): void {
    this.ingredients.push(ingredient);
  }

  // Getters
  public getId(): string { return this.id; }
  public getPrepInstructions(): string { return this.prepInstructions; }
  public getIngredients(): Ingredient[] { return this.ingredients; }
}