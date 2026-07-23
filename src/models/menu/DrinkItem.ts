import { MenuItem } from './MenuItem';
import { DrinkTypeEnum } from '../../enums/DrinkTypeEnum';

export class DrinkItem extends MenuItem {
    private isAlcoholic: boolean;
    private drinkType: DrinkTypeEnum;

    constructor(
        id: string,
        name: string,
        price: number,
        description: string,
        year: number,
        month: number,
        isAlcoholic: boolean,
        drinkType: DrinkTypeEnum
    ) {
        super(id, name, price, description, year, month);
        this.isAlcoholic = isAlcoholic;
        this.drinkType = drinkType;
    }

    public getIsAlcoholic(): boolean { return this.isAlcoholic; }
    public getDrinkType(): DrinkTypeEnum { return this.drinkType; }
}