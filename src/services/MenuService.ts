import { Platform } from 'react-native';
import { db } from './db';

export interface MenuItemData {
    id: string;
    name: string;
    category?: string;
    price?: number;
}

export const getMenuItems = (): MenuItemData[] => {
    if (Platform.OS === 'web') {
        const data = localStorage.getItem('menu_items');
        return data ? JSON.parse(data) : [];
    }

    try {
        return db?.getAllSync<MenuItemData>('SELECT * FROM menu_items;') || [];
    } catch (error) {
        console.error('Erro ao buscar cardápio:', error);
        return [];
    }
};

export const addMenuItem = (item: Omit<MenuItemData, 'id'>) => {
    const newItem: MenuItemData = { id: Date.now().toString(), ...item };

    if (Platform.OS === 'web') {
        const current = getMenuItems();
        const updated = [...current, newItem];
        localStorage.setItem('menu_items', JSON.stringify(updated));
        console.log('======= Item do cardápio cadastrado via Web! =======');
        return;
    }

    try {
        db?.runSync(
            'INSERT INTO menu_items (id, name, category, price) VALUES (?, ?, ?, ?);',
            [newItem.id, newItem.name, newItem.category || '', newItem.price || 0]
        );
    } catch (error) {
        console.error('======= Erro ao cadastrar item: =======', error);
    }
};