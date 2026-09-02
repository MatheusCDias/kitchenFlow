import { Platform } from 'react-native';
import { db } from './db';
import { Order } from '../models/Order';
import { OrderItem } from '../models/OrderItem';
import { OrderOriginEnum } from '../enums/OrderOriginEnum';
import { TableService } from '../models/service/TableService';
import { Employee } from '../models/employee/Employee';

export const orderStorage = {
  saveOrder(order: Order, generalObs: string = ''): void {
    const tableService = order.getService() as any;
    const tableNumber = tableService?.tableNumber || 1;

    const itemsRaw = order.getItems().map((item) => ({
      id: item.getId(),
      name: item.getProductName(),
      quantity: item.getQuantity(),
      observation: item.getObservation(),
    }));

    const serialized = {
      id: order.getId(),
      order_code: order.getOrderCode(),
      origin: order.getOrigin(),
      prep_minutes: order.getPrepMinutes(),
      kitchen_deadline: order.getKitchenDeadline().toISOString(),
      promised_time: order.getPromisedTime().toISOString(),
      table_number: tableNumber,
      general_obs: generalObs,
      items_json: JSON.stringify(itemsRaw),
      status: String(order.getStatus()),
      created_at: new Date().toISOString(),
    };

    if (Platform.OS === 'web') {
      const stored = localStorage.getItem('orders');
      const list = stored ? JSON.parse(stored) : [];
      list.push(serialized);
      localStorage.setItem('orders', JSON.stringify(list));
      return;
    }

    try {
      db?.runSync(
        `INSERT OR REPLACE INTO orders 
        (id, order_code, origin, prep_minutes, kitchen_deadline, promised_time, table_number, general_obs, items_json, status, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
        [
          serialized.id,
          serialized.order_code,
          serialized.origin,
          serialized.prep_minutes,
          serialized.kitchen_deadline,
          serialized.promised_time,
          serialized.table_number,
          serialized.general_obs,
          serialized.items_json,
          serialized.status,
          serialized.created_at,
        ]
      );
    } catch (error) {
      console.error('Erro ao salvar pedido no SQLite:', error);
    }
  },

  loadAllOrders(): Order[] {
    let rows: any[] = [];

    if (Platform.OS === 'web') {
      const stored = localStorage.getItem('orders');
      rows = stored ? JSON.parse(stored) : [];
    } else {
      try {
        rows = db?.getAllSync('SELECT * FROM orders ORDER BY order_code ASC;') || [];
      } catch (error) {
        console.error('Erro ao buscar pedidos no SQLite:', error);
        return [];
      }
    }

    return rows.map((row: any) => {
      const kitchenDeadline = new Date(row.kitchen_deadline);
      const promisedTime = new Date(row.promised_time);
      const createdAt = new Date(row.created_at);

      const tableService = new TableService(createdAt, row.table_number || 1, 1);

      const order = new Order(
        row.id,
        row.order_code,
        row.origin as OrderOriginEnum,
        promisedTime,
        kitchenDeadline,
        promisedTime,
        row.prep_minutes,
        undefined,
        tableService,
        undefined,
        createdAt
      );

      const itemsParsed = JSON.parse(row.items_json || '[]');
      itemsParsed.forEach((it: any) => {
        order.addItem(new OrderItem(it.id, it.name, it.quantity, createdAt, it.observation));
      });

      return order;
    });
  },
};

export class OrderService {
  private orders: Order[];

  constructor(initialOrders: Order[] = []) {
    this.orders = [...initialOrders];
  }

  public getAllOrders(): Order[] {
    return this.orders;
  }

  public getActiveOrder(): Order | null {
    return this.orders.find((o) => (o as any).isActive) || null;
  }

  public getNextAvailableCode(): number {
    if (this.orders.length === 0) return 1;
    const max = Math.max(...this.orders.map((o) => o.getOrderCode()));
    return max + 1;
  }

  public addOrder(newOrder: Order): void {
    this.orders.push(newOrder);
  }

  public claimOrder(orderId: string, employee: Employee): Order | null {
    const order = this.orders.find((o) => o.getId() === orderId);
    if (order) {
      order.setAssignedEmployee(employee);
      return order;
    }
    return null;
  }

  public completeOrder(orderId: string): boolean {
    const index = this.orders.findIndex((o) => o.getId() === orderId);
    if (index !== -1) {
      this.orders[index].advanceStage();
      return true;
    }
    return false;
  }

  public releaseOrder(orderId: string): boolean {
    const order = this.orders.find((o) => o.getId() === orderId);
    if (order) {
      order.resetOrder();
      return true;
    }
    return false;
  }

  public cancelOrder(orderId: string): boolean {
    const order = this.orders.find((o) => o.getId() === orderId);
    if (order) {
      order.cancelOrder();
      return true;
    }
    return false;
  }

  public getAvailableOrders(): Order[] {
    return this.orders.filter((o) => !o.getAssignedEmployee());
  }

  public getOrdersByEmployee(employee: Employee): Order[] {
    return this.orders.filter(
      (o) => o.getAssignedEmployee()?.getId() === employee.getId()
    );
  }
}