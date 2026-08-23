import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Order } from '../../models/Order';
import { OrderStateEnum } from '../../enums/OrderStateEnum';
import { ReceptionWorkspace } from '../../components/ReceptionWorkspace/ReceptionWorkspace';
import { ReceptionOrders } from '../../components/ReceptionOrders/ReceptionOrders';

interface ReceptionProps {
    orders: Order[];
    onSelectOrder?: (orderId: string) => void;
}

export const Reception: React.FC<ReceptionProps> = ({ orders, onSelectOrder }) => {
    // Filtra pedidos concluídos/prontos para entrega na recepção
    const readyOrders = orders.filter(
        (o) =>
            o.getStatus() === OrderStateEnum.READY ||
            o.getStatus() === OrderStateEnum.DELIVERED
    );

    return (
        <ScrollView>
            <ReceptionWorkspace/>
            <ReceptionOrders orders={orders} onSelectOrder={onSelectOrder} />
        </ScrollView>
    );
};