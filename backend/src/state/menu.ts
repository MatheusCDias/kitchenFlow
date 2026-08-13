import { menuCatalog } from '../../../src/data/menuCatalog';
import { FoodItem } from '../../../src/models/menu/FoodItem';

export interface MenuItemPayload {
    id: string;
    name: string;
    description: string;
    category: string;
}

export const getMenu = (): MenuItemPayload[] =>
    menuCatalog.map(item => ({
        id: item.getId(),
        name: item.getName(),
        description: item.getDescription(),
        category: item instanceof FoodItem ? item.getCategory() : 'BEBIDA',
    }));
