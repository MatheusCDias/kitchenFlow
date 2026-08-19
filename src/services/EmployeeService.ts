import { Platform } from 'react-native';
import { db } from './db';

export interface EmployeeData {
    id: string;
    name: string;
    role: 'recepcao' | 'cozinha';
    shift?: string;
}

// Buscar todos os funcionários
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

// Adicionar um novo funcionário
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

// Atualizar um funcionário existente
export const updateEmployee = (employee: EmployeeData) => {
    if (Platform.OS === 'web') {
        const current = getEmployees();
        const updated = current.map((emp) => (emp.id === employee.id ? employee : emp));
        localStorage.setItem('employees', JSON.stringify(updated));
        console.log('======= Funcionário atualizado via Web! =======');
        return;
    }

    try {
        db?.runSync(
            'UPDATE employees SET name = ?, role = ?, shift = ? WHERE id = ?;',
            [employee.name, employee.role, employee.shift || '', employee.id]
        );
    } catch (error) {
        console.error('======= Erro ao atualizar funcionário: =======', error);
    }
};

// Remover um funcionário
export const deleteEmployee = (id: string) => {
    if (Platform.OS === 'web') {
        const current = getEmployees();
        const updated = current.filter((emp) => emp.id !== id);
        localStorage.setItem('employees', JSON.stringify(updated));
        console.log('======= Funcionário removido via Web! =======');
        return;
    }

    try {
        db?.runSync('DELETE FROM employees WHERE id = ?;', [id]);
    } catch (error) {
        console.error('======= Erro ao remover funcionário: =======', error);
    }
};