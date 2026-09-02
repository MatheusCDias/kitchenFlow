import { useState, useCallback } from "react";
import { Order } from "../models/Order";
import { Employee } from "../models/employee/Employee";
import { OrderService, orderStorage } from "../services/OrderService";

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
    },
    [orderService],
  );

  const claimOrder = useCallback(
    (orderId: string) => {
      if (!currentUser) {
        return null;
      }

      const claimed = orderService.claimOrder(orderId, currentUser);
      if (claimed) {
        setActiveOrder(claimed);
        setAllOrders([...orderService.getAllOrders()]);
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
      }
      return success;
    },
    [orderService],
  );

  const refreshOrders = useCallback(() => {
    setAllOrders([...orderService.getAllOrders()]);
  }, [orderService]);

  const releaseOrder = useCallback(
    (order: Order) => {
      const success = orderService.releaseOrder(order.getId());
      if (success) {
        setActiveOrder(null);
        setAllOrders([...orderService.getAllOrders()]);
      }
      return success;
    },
    [orderService],
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

  return {
    activeOrder,
    allOrders,
    addOrder,
    claimOrder,
    completeOrder,
    releaseOrder,
    cancelOrder,
    refreshOrders,
    getNextOrderCode,
    availableOrders: orderService.getAvailableOrders(),
    employeeOrders: currentUser
      ? orderService.getOrdersByEmployee(currentUser)
      : [],
  };
};