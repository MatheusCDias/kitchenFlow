import { SERVER_URL } from './config';

const API_BASE_URL = SERVER_URL;

export interface OrderItemPayload {
    id: string;
    productName: string;
    quantity: number;
    notes?: string;
}

export interface OrderPayload {
    id: string;
    orderCode: number;
    items: OrderItemPayload[];
    deadlineMinutes: number;
    createdAt: string;
    kitchenDeadline: string;
    assignedStation: number | null;
    status: string;
    tableNumber?: number;
    preparationStartedAt?: string;
    preparationFinishedAt?: string;
}

export interface NewOrderItemInput {
    productName: string;
    quantity: number;
    notes?: string;
}

export interface NewOrderInput {
    items: NewOrderItemInput[];
    deadlineMinutes: number;
    tableNumber?: number;
}

export interface MenuItemPayload {
    id: string;
    name: string;
    description: string;
    category: string;
}

export class ApiError extends Error {}

const request = async <T>(path: string, options?: RequestInit): Promise<T> => {
    const response = await fetch(`${API_BASE_URL}${path}`, {
        ...options,
        headers: { 'Content-Type': 'application/json', ...options?.headers },
    });
    const data = await response.json();
    if (!response.ok) {
        throw new ApiError(data.message ?? 'Erro ao falar com o servidor.');
    }
    return data as T;
};

export const fetchOrders = (): Promise<OrderPayload[]> =>
    request<OrderPayload[]>('/orders');

export const fetchMenu = (): Promise<MenuItemPayload[]> =>
    request<MenuItemPayload[]>('/menu');

export const createOrderRequest = (input: NewOrderInput): Promise<OrderPayload> =>
    request<OrderPayload>('/orders', {
        method: 'POST',
        body: JSON.stringify(input),
    });

export const claimOrderRequest = (orderId: string, stationNumber: number): Promise<OrderPayload> =>
    request<OrderPayload>(`/orders/${orderId}/claim`, {
        method: 'POST',
        body: JSON.stringify({ stationNumber }),
    });

export const completeOrderRequest = (orderId: string, stationNumber: number): Promise<OrderPayload> =>
    request<OrderPayload>(`/orders/${orderId}/complete`, {
        method: 'POST',
        body: JSON.stringify({ stationNumber }),
    });

export const releaseOrderRequest = (orderId: string, stationNumber: number): Promise<OrderPayload> =>
    request<OrderPayload>(`/orders/${orderId}/release`, {
        method: 'POST',
        body: JSON.stringify({ stationNumber }),
    });

export const deleteOrderRequest = (orderId: string, stationNumber: number): Promise<void> =>
    request<void>(`/orders/${orderId}`, {
        method: 'DELETE',
        body: JSON.stringify({ stationNumber }),
    });

// Apaga todos os pedidos (inclusive os mockados) e reinicia a contagem do #1.
// Ferramenta de ambiente de testes, não é uma função pro dia a dia do restaurante.
export const resetAllOrdersRequest = (): Promise<void> =>
    request<void>('/admin/reset', { method: 'POST' });
