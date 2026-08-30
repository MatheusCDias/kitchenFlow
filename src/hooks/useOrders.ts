import { useCallback, useEffect, useState } from "react";
import { Order } from "../models/Order";
import { Employee } from "../models/employee/Employee";
import {
    OrderPayload,
    NewOrderInput,
    fetchOrders,
    createOrderRequest,
    claimOrderRequest,
    completeOrderRequest,
    cancelOrderRequest,
} from "../services/api";
import { toOrder } from "../services/orderMapper";
import { OrderStateEnum } from "../enums/OrderStateEnum";

// De quanto em quanto tempo busca a lista de novo, pra bancadas e recepção
// diferentes enxergarem o que as outras já criaram/pegaram/concluíram.
const POLL_INTERVAL_MS = 4000;

export const useOrders = (currentUser?: Employee) => {
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

    const activeRecord = currentUser
        ? records.find(
            record =>
                record.assignedStation === currentUser.getStationNumber() &&
                record.status === OrderStateEnum.IN_PREPARATION
        ) ?? null
        : null;
    const activeOrder = activeRecord ? toOrder(activeRecord) : null;

    // Só uma prévia do próximo código — o valor de verdade é decidido pelo
    // servidor na hora de criar (evita duas recepções mostrarem o mesmo
    // número por coincidência de timing, mesmo que a prévia bata igual).
    const getNextOrderCode = useCallback((): number => {
        const busyCodes = new Set(
            records
                .filter(r => r.status !== OrderStateEnum.CANCELLED)
                .map(r => r.orderCode)
        );
        let code = 101;
        while (busyCodes.has(code)) code++;
        return code;
    }, [records]);

    const createOrder = useCallback(async (input: NewOrderInput) => {
        const created = await createOrderRequest(input);
        await refreshOrders();
        return created;
    }, [refreshOrders]);

    const claimOrder = useCallback(async (orderId: string) => {
        if (!currentUser) return null;
        try {
            const claimed = await claimOrderRequest(orderId, currentUser.getStationNumber());
            await refreshOrders();
            return claimed;
        } catch {
            await refreshOrders();
            return null;
        }
    }, [currentUser, refreshOrders]);

    const completeOrder = useCallback(async (order: Order) => {
        if (!currentUser) return false;
        try {
            await completeOrderRequest(order.getId(), currentUser.getStationNumber());
            await refreshOrders();
            return true;
        } catch {
            await refreshOrders();
            return false;
        }
    }, [currentUser, refreshOrders]);

    // "Cancelar" aqui devolve o pedido pra fila (mesmo comportamento que já
    // existia, só que agora passando pelo servidor).
    const cancelOrder = useCallback(async (order: Order) => {
        if (!currentUser) return false;
        try {
            await cancelOrderRequest(order.getId(), currentUser.getStationNumber());
            await refreshOrders();
            return true;
        } catch {
            await refreshOrders();
            return false;
        }
    }, [currentUser, refreshOrders]);

    return {
        activeOrder,
        allOrders,
        createOrder,
        claimOrder,
        completeOrder,
        cancelOrder,
        refreshOrders,
        getNextOrderCode,
    };
};
