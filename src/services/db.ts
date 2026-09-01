import { Platform } from 'react-native';
import * as SQLite from 'expo-sqlite';

export const db = Platform.OS !== 'web' ? SQLite.openDatabaseSync('kitchen_flow.db') : null;

// Configuração padrão do perfil Admin
const DEFAULT_ADMIN = {
    id: 'admin_default',
    name: 'Administrador',
    role: 'admin',
    shift: 'Geral',
    password: 'admin' // Defina a senha padrão desejada
};

export const initDatabase = () => {
    // --- AMBIENTE WEB (LocalStorage) ---
    if (Platform.OS === 'web') {
        const storedEmployees = localStorage.getItem('employees');

        if (!storedEmployees) {
            // Inicializa já com o Admin padrão
            localStorage.setItem('employees', JSON.stringify([DEFAULT_ADMIN]));
        } else {
            // Garante que o Admin existe no array
            const employees = JSON.parse(storedEmployees);
            const adminExists = employees.some((emp: any) => emp.role === 'admin');
            if (!adminExists) {
                employees.push(DEFAULT_ADMIN);
                localStorage.setItem('employees', JSON.stringify(employees));
            }
        }

        if (!localStorage.getItem('menu_items')) {
            localStorage.setItem('menu_items', JSON.stringify([]));
        }

        console.log('======= Armazenamento Web (LocalStorage) inicializado! =======');
        return;
    }

    // --- AMBIENTE NATIVO (SQLite via expo-sqlite) ---
    try {
        db?.execSync(`
            PRAGMA journal_mode = WAL;

            CREATE TABLE IF NOT EXISTS employees (
                id TEXT PRIMARY KEY NOT NULL,
                name TEXT NOT NULL,
                role TEXT NOT NULL,
                shift TEXT,
                password TEXT
            );

            CREATE TABLE IF NOT EXISTS menu_items (
                id TEXT PRIMARY KEY NOT NULL,
                name TEXT NOT NULL,
                category TEXT,
                price REAL
            );

            -- Insere o Admin padrão apenas se ele ainda não existir
            INSERT OR IGNORE INTO employees (id, name, role, shift, password)
            VALUES ('${DEFAULT_ADMIN.id}', '${DEFAULT_ADMIN.name}', '${DEFAULT_ADMIN.role}', '${DEFAULT_ADMIN.shift}', '${DEFAULT_ADMIN.password}');
        `);

        console.log('======= Banco de dados SQLite inicializado! =======');
    } catch (error) {
        console.error('xxxxxxx Erro ao inicializar o SQLite:', error, ' xxxxxxx');
    }
};