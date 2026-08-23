import { useState, useCallback } from "react";
import { Order } from "../models/Order";
import { Employee } from "../models/employee/Employee";
import { OrderService } from "../services/OrderService";

export const useOrders = (currentUser: Employee) => {
  // Inicializa o OrderService sem pedidos mockados
  const [orderService] = useState(() => {
    return new OrderService([]);
  });

  const [activeOrder, setActiveOrder] = useState<Order | null>(() =>
    orderService.getActiveOrder(),
  );

  const [allOrders, setAllOrders] = useState<Order[]>(() => [
    ...orderService.getAllOrders(),
  ]);

  // Adiciona um novo pedido à lista do serviço e atualiza o estado
  const addOrder = useCallback(
    (newOrder: Order) => {
      orderService.addOrder(newOrder); // Caso o OrderService possua o método addOrder
      setAllOrders([...orderService.getAllOrders()]);
    },
    [orderService],
  );

  const claimOrder = useCallback(
    (orderId: string) => {
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
    availableOrders: orderService.getAvailableOrders(),
    employeeOrders: orderService.getOrdersByEmployee(currentUser),
  };
};
