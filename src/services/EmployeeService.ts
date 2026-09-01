import { Platform } from 'react-native';
import { db } from './db';
import { Admin } from '../models/employee/Admin'; // Ajuste o caminho para a classe Admin se necessário

export interface EmployeeData {
    id: string;
    name: string;
    role: 'recepcao' | 'cozinha' | 'admin';
    shift?: string;
    password?: string;
}

// 1. Buscar todos os funcionários
export const getEmployees = (): EmployeeData[] => {
    if (Platform.OS === 'web') {
        const data = localStorage.getItem('employees');
        return data ? JSON.parse(data) : [];
    }

    try {
        return db?.getAllSync<EmployeeData>('SELECT id, name, role, shift FROM employees;') || [];
    } catch (error) {
        console.error('Erro ao buscar funcionários:', error);
        return [];
    }
};

// 2. Buscar funcionários filtrados por setor (ignora o admin)
export const getEmployeesByRole = (role: 'recepcao' | 'cozinha'): EmployeeData[] => {
    if (Platform.OS === 'web') {
        const employees = getEmployees();
        return employees.filter((emp) => emp.role === role);
    }

    try {
        return db?.getAllSync<EmployeeData>(
            'SELECT id, name, role, shift FROM employees WHERE role = ?;',
            [role]
        ) || [];
    } catch (error) {
        console.error('Erro ao buscar funcionários por cargo:', error);
        return [];
    }
};

// 3. Autenticar o Admin pela senha
export const authenticateAdmin = (password: string): Admin | null => {
    if (Platform.OS === 'web') {
        const data = localStorage.getItem('employees');
        const employees: EmployeeData[] = data ? JSON.parse(data) : [];
        const adminFound = employees.find(
            (emp) => emp.role === 'admin' && emp.password === password
        );

        if (adminFound) {
            return new Admin(adminFound.id, adminFound.name, adminFound.shift || 'Integral');
        }
        return null;
    }

    try {
        const adminFound = db?.getFirstSync<EmployeeData>(
            'SELECT id, name, role, shift FROM employees WHERE role = ? AND password = ?;',
            ['admin', password]
        );

        if (adminFound) {
            return new Admin(adminFound.id, adminFound.name, adminFound.shift || 'Integral');
        }
        return null;
    } catch (error) {
        console.error('Erro ao autenticar admin:', error);
        return null;
    }
};

// 4. Adicionar um novo funcionário
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
            'INSERT INTO employees (id, name, role, shift, password) VALUES (?, ?, ?, ?, ?);',
            [newEmp.id, newEmp.name, newEmp.role, newEmp.shift || '', newEmp.password || null]
        );
    } catch (error) {
        console.error('======= Erro ao cadastrar funcionário: =======', error);
    }
};

// 5. Atualizar um funcionário existente
export const updateEmployee = (employee: EmployeeData) => {
    if (Platform.OS === 'web') {
        const current = getEmployees();
        const updated = current.map((emp) => (emp.id === employee.id ? { ...emp, ...employee } : emp));
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

// 6. Remover um funcionário
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

// Adicione em src/services/EmployeeService.ts
export const updateAdminPassword = (newPassword: string): boolean => {
    if (Platform.OS === 'web') {
        const data = localStorage.getItem('employees');
        if (!data) return false;
        
        const employees: EmployeeData[] = JSON.parse(data);
        const updated = employees.map((emp) => 
            emp.role === 'admin' ? { ...emp, password: newPassword } : emp
        );
        localStorage.setItem('employees', JSON.stringify(updated));
        console.log('======= Senha do Admin atualizada no Web! =======');
        return true;
    }

    try {
        db?.runSync(
            'UPDATE employees SET password = ? WHERE role = ?;',
            [newPassword, 'admin']
        );
        console.log('======= Senha do Admin atualizada no SQLite! =======');
        return true;
    } catch (error) {
        console.error('Erro ao atualizar senha do admin:', error);
        return false;
    }
};