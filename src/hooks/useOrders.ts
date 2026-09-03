import { useState, useCallback } from "react";
import { Order } from "../models/Order";
import { Employee } from "../models/employee/Employee";
import { OrderService, orderStorage } from "../services/OrderService";
import { logActivity } from "../services/LogService";

export const useOrders = (currentUser?: Employee) => {
  const [orderService] = useState(() => {
    const savedOrders = orderStorage.loadAllOrders();
    return new OrderService(savedOrders);
  });

  const [activeOrder, setActiveOrder] = useState<Order | null>(() =>
    orderService.getActiveOrder(),
  );

  const [allOrders, setAllOrders] = useState<Order[]>(() => [
    ...orderService.getAllOrders(),
  ]);

  const getNextOrderCode = useCallback(() => {
    return orderService.getNextAvailableCode();
  }, [orderService]);

  const addOrder = useCallback(
    (newOrder: Order, generalObs?: string) => {
      orderService.addOrder(newOrder);
      orderStorage.saveOrder(newOrder, generalObs);
      setAllOrders([...orderService.getAllOrders()]);

      if (currentUser) {
        logActivity(
          'PEDIDO_CRIADO',
          newOrder.getId(),
          newOrder.getOrderCode(),
          {
            id: currentUser.getId(),
            name: currentUser.getName(),
            role: currentUser.getRole(),
          },
          `Pedido criado com ${newOrder.getItems().length} item(ns)`
        );
      }
    },
    [orderService, currentUser],
  );

  const claimOrder = useCallback(
    (orderId: string) => {
      if (!currentUser) return null;

      const claimed = orderService.claimOrder(orderId, currentUser);
      if (claimed) {
        setActiveOrder(claimed);
        setAllOrders([...orderService.getAllOrders()]);

        logActivity(
          'PEDIDO_PEGO',
          claimed.getId(),
          claimed.getOrderCode(),
          {
            id: currentUser.getId(),
            name: currentUser.getName(),
            role: currentUser.getRole(),
          },
          'Assumiu o preparo na cozinha'
        );
      }
      return claimed;
    },
    [orderService, currentUser],
  );

  const completeOrder = useCallback(
    (order: Order) => {
      const success = orderService.completeOrder(order.getId());
      if (success) {
        setActiveOrder(null);
        setAllOrders([...orderService.getAllOrders()]);

        if (currentUser) {
          logActivity(
            'PEDIDO_CONCLUIDO',
            order.getId(),
            order.getOrderCode(),
            {
              id: currentUser.getId(),
              name: currentUser.getName(),
              role: currentUser.getRole(),
            },
            'Finalizou o preparo na cozinha'
          );
        }
      }
      return success;
    },
    [orderService, currentUser],
  );

  const cancelOrder = useCallback(
    (order: Order) => {
      const success = orderService.cancelOrder(order.getId());
      if (success) {
        setActiveOrder(null);
        setAllOrders([...orderService.getAllOrders()]);
      }
      return success;
    },
    [orderService],
  );

  const deleteOrder = useCallback(
    (orderId: string) => {
      const success = orderService.deleteOrder(orderId);
      if (success) {
        if (activeOrder?.getId() === orderId) {
          setActiveOrder(null);
        }
        setAllOrders([...orderService.getAllOrders()]);
      }
      return success;
    },
    [orderService, activeOrder],
  );

  return {
    activeOrder,
    allOrders,
    addOrder,
    claimOrder,
    completeOrder,
    cancelOrder,
    deleteOrder,
    getNextOrderCode,
    availableOrders: orderService.getAvailableOrders(),
  }
};