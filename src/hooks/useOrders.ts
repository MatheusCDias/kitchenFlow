import { useState, useEffect, useCallback } from 'react';
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
        orderService.getAllOrders()
    );

    // Atualiza a lista quando o serviço muda
    useEffect(() => {
        setAllOrders(orderService.getAllOrders());
    }, [orderService]);

    const claimOrder = useCallback((orderId: string) => {
        const claimed = orderService.claimOrder(orderId, currentUser);
        if (claimed) {
            setActiveOrder(claimed);
            setAllOrders(orderService.getAllOrders());
        }
        return claimed;
    }, [orderService, currentUser]);

    const completeOrder = useCallback((order: Order) => {
        const success = orderService.completeOrder(order.getId());
        if (success) {
            setActiveOrder(null);
            setAllOrders(orderService.getAllOrders());
        }
        return success;
    }, [orderService]);

    const refreshOrders = useCallback(() => {
        setAllOrders(orderService.getAllOrders());
    }, [orderService]);

    return {
        activeOrder,
        allOrders,
        claimOrder,
        completeOrder,
        refreshOrders,
        availableOrders: orderService.getAvailableOrders(),
        employeeOrders: orderService.getOrdersByEmployee(currentUser),
    };
};