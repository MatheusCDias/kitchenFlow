import { useCallback, useEffect, useState } from 'react';
import { Order } from '../models/Order';
import {
    OrderPayload,
    NewOrderInput,
    fetchOrders,
    claimOrderRequest,
    completeOrderRequest,
    releaseOrderRequest,
    deleteOrderRequest,
    createOrderRequest,
} from '../services/api';
import { toOrder } from '../services/orderMapper';

// De quanto em quanto tempo busca a lista de novo, pra bancadas diferentes
// enxergarem o que as outras já pegaram/concluíram.
const POLL_INTERVAL_MS = 4000;

export const useOrders = (stationNumber: number | null) => {
    const [records, setRecords] = useState<OrderPayload[]>([]);

    const refreshOrders = useCallback(async () => {
        const data = await fetchOrders();
        setRecords(data);
    }, []);

    useEffect(() => {
        refreshOrders();
        const interval = setInterval(refreshOrders, POLL_INTERVAL_MS);
        return () => clearInterval(interval);
    }, [refreshOrders]);

    const allOrders = records.map(toOrder);

    const activeRecord = records.find(
        record => record.assignedStation === stationNumber && record.status === 'IN_PREPARATION'
    ) ?? null;
    const activeOrder = activeRecord ? toOrder(activeRecord) : null;

    const claimOrder = useCallback(async (orderId: string) => {
        if (stationNumber === null) return null;
        try {
            const claimed = await claimOrderRequest(orderId, stationNumber);
            await refreshOrders();
            return claimed;
        } catch {
            await refreshOrders();
            return null;
        }
    }, [stationNumber, refreshOrders]);

    const completeOrder = useCallback(async (order: Order) => {
        if (stationNumber === null) return false;
        try {
            await completeOrderRequest(order.getId(), stationNumber);
            await refreshOrders();
            return true;
        } catch {
            await refreshOrders();
            return false;
        }
    }, [stationNumber, refreshOrders]);

    // "Desistir": devolve o pedido pra fila, sem cancelar o pedido do cliente.
    const releaseOrder = useCallback(async (order: Order) => {
        if (stationNumber === null) return false;
        try {
            await releaseOrderRequest(order.getId(), stationNumber);
            await refreshOrders();
            return true;
        } catch {
            await refreshOrders();
            return false;
        }
    }, [stationNumber, refreshOrders]);

    // "Excluir": cancela o pedido do cliente de vez, some da lista.
    const deleteOrder = useCallback(async (order: Order) => {
        if (stationNumber === null) return false;
        try {
            await deleteOrderRequest(order.getId(), stationNumber);
            await refreshOrders();
            return true;
        } catch {
            await refreshOrders();
            return false;
        }
    }, [stationNumber, refreshOrders]);

    // Deixa o erro subir (ex: "pedido precisa ter item") pra quem chamou
    // mostrar a mensagem real, em vez de engolir silenciosamente.
    const createOrder = useCallback(async (input: NewOrderInput) => {
        const created = await createOrderRequest(input);
        await refreshOrders();
        return created;
    }, [refreshOrders]);

    return {
        activeOrder,
        allOrders,
        claimOrder,
        completeOrder,
        releaseOrder,
        deleteOrder,
        createOrder,
        refreshOrders,
    };
};
