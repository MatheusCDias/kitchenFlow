import { Platform } from 'react-native';
import { db } from './db';

export interface EmployeeData {
    id: string;
    name: string;
    role: 'recepcao' | 'cozinha';
    shift?: string;
}

export const getEmployees = (): EmployeeData[] => {
    if (Platform.OS === 'web') {
        const data = localStorage.getItem('employees');
        return data ? JSON.parse(data) : [];
    }

    try {
        return db?.getAllSync<EmployeeData>('SELECT * FROM employees;') || [];
    } catch (error) {
        console.error('Erro ao buscar funcionários:', error);
        return [];
    }
};

export const addEmployee = (employee: Omit<EmployeeData, 'id'>) => {
    const newEmp: EmployeeData = { id: Date.now().toString(), ...employee };

    if (Platform.OS === 'web') {
        const current = getEmployees();
        const updated = [...current, newEmp];
        localStorage.setItem('employees', JSON.stringify(updated));
        console.log('======= Funcionário cadastrado via Web! =======');
        return;
    }

    try {
        db?.runSync(
            'INSERT INTO employees (id, name, role, shift) VALUES (?, ?, ?, ?);',
            [newEmp.id, newEmp.name, newEmp.role, newEmp.shift || '']
        );
    } catch (error) {
        console.error('======= Erro ao cadastrar funcionário: =======', error);
    }
};