// src/screens/Reception/Reception.tsx

import React, { useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { Order } from "../../models/Order";
import { ReceptionWorkspace } from "../../components/ReceptionWorkspace/ReceptionWorkspace";
import { ReceptionOrders } from "../../components/ReceptionOrders/ReceptionOrders";

interface ReceptionProps {
  orders?: Order[];
}

export const Reception: React.FC<ReceptionProps> = ({
  orders: initialOrders = [],
}) => {
  const [ordersList, setOrdersList] = useState<Order[]>(initialOrders);

  const handleAddOrder = (newOrder: Order) => {
    setOrdersList((prevOrders) => [newOrder, ...prevOrders]);
  };

  return (
    <ScrollView>
      <ReceptionWorkspace onAddOrder={handleAddOrder} />
      <ReceptionOrders orders={ordersList} />
    </ScrollView>
  );
};
