import { SERVER_URL } from './config';

export interface OrderItemPayload {
    id: string;
    productName: string;
    quantity: number;
    notes?: string;
}

export interface OrderPayload {
    id: string;
    orderCode: number;
    origin: string;
    items: OrderItemPayload[];
    prepMinutes: number;
    kitchenDeadline: string;
    completedAt?: string;
    assignedStation: number | null;
    status: string;
    tableNumber?: number;
}

export interface NewOrderItemInput {
    productName: string;
    quantity: number;
    notes?: string;
}

export interface NewOrderInput {
    items: NewOrderItemInput[];
    prepMinutes: number;
    tableNumber?: number;
}

export class ApiError extends Error {}

const request = async <T>(path: string, options?: RequestInit): Promise<T> => {
    const response = await fetch(`${SERVER_URL}${path}`, {
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

export const cancelOrderRequest = (orderId: string, stationNumber: number): Promise<OrderPayload> =>
    request<OrderPayload>(`/orders/${orderId}/cancel`, {
        method: 'POST',
        body: JSON.stringify({ stationNumber }),
    });

export interface StationsPayload {
    occupied: number[];
}

export const fetchOccupiedStations = (): Promise<StationsPayload> =>
    request<StationsPayload>('/stations');

export const claimStationRequest = (stationNumber: number, holderId: string): Promise<StationsPayload> =>
    request<StationsPayload>(`/stations/${stationNumber}/claim`, {
        method: 'POST',
        body: JSON.stringify({ holderId }),
    });

export const heartbeatStationRequest = (stationNumber: number, holderId: string): Promise<{ ok: boolean }> =>
    request<{ ok: boolean }>(`/stations/${stationNumber}/heartbeat`, {
        method: 'POST',
        body: JSON.stringify({ holderId }),
    });

export const releaseStationRequest = (stationNumber: number, holderId: string): Promise<{ ok: boolean }> =>
    request<{ ok: boolean }>(`/stations/${stationNumber}/release`, {
        method: 'POST',
        body: JSON.stringify({ holderId }),
    });
