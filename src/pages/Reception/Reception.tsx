// src/screens/Reception/Reception.tsx

import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import { ReceptionWorkspace } from "../../components/ReceptionWorkspace/ReceptionWorkspace";
import { ReceptionOrders } from "../../components/ReceptionOrders/ReceptionOrders";
import { Order } from "../../models/Order";
import { NewOrderInput, OrderPayload } from "../../services/api";

interface ReceptionProps {
  orders: Order[];
  createOrder: (input: NewOrderInput) => Promise<OrderPayload>;
  getNextOrderCode: () => number;
}

// Recebe os pedidos e as ações por prop (vindos do App.tsx) em vez de
// chamar useOrders() de novo aqui — isso criava um segundo OrderService
// isolado, então pedido criado na Recepção nunca aparecia na Cozinha.
export const Reception: React.FC<ReceptionProps> = ({
  orders,
  createOrder,
  getNextOrderCode,
}) => {
  return (
    <ScrollView>
      <ReceptionWorkspace
        getNextOrderCode={getNextOrderCode}
        onCreateOrder={createOrder}
      />
      <ReceptionOrders orders={orders} />
    </ScrollView>
  );
};
