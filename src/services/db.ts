import { Platform } from 'react-native';
import * as SQLite from 'expo-sqlite';

export const db = Platform.OS !== 'web' ? SQLite.openDatabaseSync('kitchen_flow.db') : null;


export const initDatabase = () => {
    if (Platform.OS === 'web') {
        if (!localStorage.getItem('employees')) {
            localStorage.setItem('employees', JSON.stringify([]));
        }
        if (!localStorage.getItem('menu_items')) {
            localStorage.setItem('menu_items', JSON.stringify([]));
        }
        console.log('======= Armazenamento Web (LocalStorage) inicializado! =======');
        return;
    }

    try {
        db?.execSync(`
            PRAGMA journal_mode = WAL;
            
            CREATE TABLE IF NOT EXISTS employees (
                id TEXT PRIMARY KEY NOT NULL,
                name TEXT NOT NULL,
                role TEXT NOT NULL,
                shift TEXT
            );

            CREATE TABLE IF NOT EXISTS menu_items (
                id TEXT PRIMARY KEY NOT NULL,
                name TEXT NOT NULL,
                category TEXT,
                price REAL
            );
        `);
        console.log('======= Banco de dados SQLite inicializado! =======');
    } catch (error) {
        console.error('xxxxxxx Erro ao inicializar o SQLite:', error, ' xxxxxxx');
    }
};