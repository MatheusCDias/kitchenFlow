import { Platform } from 'react-native';
import { db } from './db';

export type LogActionType = 
  | 'PEDIDO_CRIADO' 
  | 'PEDIDO_PEGO' 
  | 'PEDIDO_LIBERADO' 
  | 'PEDIDO_CONCLUIDO';

export interface ActivityLog {
  id: string;
  action: LogActionType;
  order_id: string;
  order_code: number;
  employee_id: string;
  employee_name: string;
  employee_role: string;
  details?: string;
  created_at: string;
}

export const logActivity = (
  action: LogActionType,
  orderId: string,
  orderCode: number,
  employee: { id: string; name: string; role: string },
  details: string = ''
) => {
  const newLog: ActivityLog = {
    id: Date.now().toString() + Math.random().toString(36).substring(2, 5),
    action,
    order_id: orderId,
    order_code: orderCode,
    employee_id: employee.id,
    employee_name: employee.name,
    employee_role: employee.role,
    details,
    created_at: new Date().toISOString(),
  };

  if (Platform.OS === 'web') {
    const raw = localStorage.getItem('activity_logs');
    const logs: ActivityLog[] = raw ? JSON.parse(raw) : [];
    logs.unshift(newLog); // Mais recentes no topo
    localStorage.setItem('activity_logs', JSON.stringify(logs));
    return;
  }

  try {
    db?.runSync(
      `INSERT INTO activity_logs 
       (id, action, order_id, order_code, employee_id, employee_name, employee_role, details, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        newLog.id,
        newLog.action,
        newLog.order_id,
        newLog.order_code,
        newLog.employee_id,
        newLog.employee_name,
        newLog.employee_role,
        newLog.details || '',
        newLog.created_at,
      ]
    );
  } catch (err) {
    console.error('Erro ao registrar log de atividade:', err);
  }
};

export const getActivityLogs = (): ActivityLog[] => {
  if (Platform.OS === 'web') {
    const raw = localStorage.getItem('activity_logs');
    return raw ? JSON.parse(raw) : [];
  }

  try {
    return db?.getAllSync<ActivityLog>(
      'SELECT * FROM activity_logs ORDER BY created_at DESC;'
    ) || [];
  } catch (err) {
    console.error('Erro ao buscar logs de atividade:', err);
    return [];
  }
};