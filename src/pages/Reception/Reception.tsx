// src/screens/Reception/Reception.tsx

import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import { ReceptionWorkspace } from "../../components/ReceptionWorkspace/ReceptionWorkspace";
import { ReceptionOrders } from "../../components/ReceptionOrders/ReceptionOrders";
import { useOrders } from "../../hooks/useOrders";
import { Order } from "../../models/Order";

interface ReceptionProps {
  orders?: Order[];
}

export const Reception: React.FC<ReceptionProps> = () => {
  // O hook agora funciona perfeitamente sem argumentos obrigatorios
  const { allOrders, addOrder, getNextOrderCode } = useOrders();

  return (
    <ScrollView>
      <ReceptionWorkspace
        getNextOrderCode={getNextOrderCode}
        onAddOrder={addOrder}
      />
      <ReceptionOrders orders={allOrders} />
    </ScrollView>
  );
};