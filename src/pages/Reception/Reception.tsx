import React from "react";
import { ScrollView } from "react-native";
import { ReceptionWorkspace } from "../../components/ReceptionWorkspace/ReceptionWorkspace";
import { ReceptionOrders } from "../../components/ReceptionOrders/ReceptionOrders";
import { Order } from "../../models/Order";

interface ReceptionProps {
  orders: Order[];
  onAddOrder: (order: Order) => void;
  getNextOrderCode: () => number;
}

export const Reception: React.FC<ReceptionProps> = ({
  orders,
  onAddOrder,
  getNextOrderCode,
}) => {
  return (
    <ScrollView>
      <ReceptionWorkspace
        getNextOrderCode={getNextOrderCode}
        onAddOrder={onAddOrder}
      />
      <ReceptionOrders orders={orders} />
    </ScrollView>
  );
};