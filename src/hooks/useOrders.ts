import { useState, useCallback } from 'react';
import { Order } from '../models/Order';
import { Employee } from '../models/employee/Employee';
import { OrderService } from '../services/OrderService';
import { OrderFactory } from '../factories/OrderFactory';

export const useOrders = (currentUser: Employee) => {
    const [orderService] = useState(() => {
        const initialOrders = OrderFactory.createMockOrders(currentUser);
        return new OrderService(initialOrders);
    });

    const [activeOrder, setActiveOrder] = useState<Order | null>(() =>
        orderService.getActiveOrder()
    );

    const [allOrders, setAllOrders] = useState<Order[]>(() =>
        [...orderService.getAllOrders()]
    );

    const claimOrder = useCallback((orderId: string) => {
        const claimed = orderService.claimOrder(orderId, currentUser);
        if (claimed) {
            setActiveOrder(claimed);
            setAllOrders([...orderService.getAllOrders()]);
        }
        return claimed;
    }, [orderService, currentUser]);

    const completeOrder = useCallback((order: Order) => {
        const success = orderService.completeOrder(order.getId());
        if (success) {
            setActiveOrder(null);
            setAllOrders([...orderService.getAllOrders()]);
        }
        return success;
    }, [orderService]);

    const refreshOrders = useCallback(() => {
        setAllOrders([...orderService.getAllOrders()]);
    }, [orderService]);

    // Em useOrders.ts

    const releaseOrder = useCallback((order: Order) => {
        const success = orderService.releaseOrder(order.getId());
        if (success) {
            setActiveOrder(null);
            setAllOrders([...orderService.getAllOrders()]);
        }
        return success;
    }, [orderService]);

    const cancelOrder = useCallback((order: Order) => {
        const success = orderService.cancelOrder(order.getId());
        if (success) {
            setActiveOrder(null);
            setAllOrders([...orderService.getAllOrders()]);
        }
        return success;
    }, [orderService]);

    return {
        activeOrder,
        allOrders,
        claimOrder,
        completeOrder,
        cancelOrder, // 👈 Adicione aqui no retorno
        refreshOrders,
        availableOrders: orderService.getAvailableOrders(),
        employeeOrders: orderService.getOrdersByEmployee(currentUser),
    };
};