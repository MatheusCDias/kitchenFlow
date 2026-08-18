import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { ActiveWorkspace } from '../../components/ActiveWorkspace/ActiveWorkspace';
import { Order } from '../../models/Order';
import { OrderStateEnum } from '../../enums/OrderStateEnum';

interface ReceptionProps {
    orders: Order[];
}

export const Reception: React.FC<ReceptionProps> = ({ orders }) => {
    // Filtra pedidos concluídos/prontos para entrega na recepção
    const readyOrders = orders.filter(
        (o) =>
            o.getStatus() === OrderStateEnum.READY ||
            o.getStatus() === OrderStateEnum.DELIVERED
    );

    return (
        <ScrollView>
        </ScrollView>
    );
};