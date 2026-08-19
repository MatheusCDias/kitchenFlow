import { Platform } from 'react-native';
import { db } from './db';

export interface MenuItemData {
    id: string;
    name: string;
    category?: string;
    price?: number;
    recipe?: string;
}

export const getMenuItems = (): MenuItemData[] => {
    if (Platform.OS === 'web') {
        const data = localStorage.getItem('menu_items');
        return data ? JSON.parse(data) : [];
    }

    try {
        return db?.getAllSync<MenuItemData>('SELECT * FROM menu_items ORDER BY name ASC;') || [];
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
        return;
    }

    try {
        db?.runSync(
            'INSERT INTO menu_items (id, name, category, price, recipe) VALUES (?, ?, ?, ?, ?);',
            [newItem.id, newItem.name, newItem.category || '', newItem.price || 0, newItem.recipe || '']
        );
    } catch (error) {
        console.error('Erro ao cadastrar item:', error);
    }
};

export const updateMenuItem = (item: MenuItemData) => {
    if (Platform.OS === 'web') {
        const current = getMenuItems();
        const updated = current.map((i) => (i.id === item.id ? item : i));
        localStorage.setItem('menu_items', JSON.stringify(updated));
        return;
    }

    try {
        db?.runSync(
            'UPDATE menu_items SET name = ?, category = ?, price = ?, recipe = ? WHERE id = ?;',
            [item.name, item.category || '', item.price || 0, item.recipe || '', item.id]
        );
    } catch (error) {
        console.error('Erro ao atualizar item:', error);
    }
};

export const deleteMenuItem = (id: string) => {
    if (Platform.OS === 'web') {
        const current = getMenuItems();
        const updated = current.filter((i) => i.id !== id);
        localStorage.setItem('menu_items', JSON.stringify(updated));
        return;
    }

    try {
        db?.runSync('DELETE FROM menu_items WHERE id = ?;', [id]);
    } catch (error) {
        console.error('Erro ao deletar item:', error);
    }
};