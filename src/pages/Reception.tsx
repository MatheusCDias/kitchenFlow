import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Order } from '../models/Order';
import { OrderStateEnum } from '../enums/OrderStateEnum';

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
        <View style={styles.container}>
            <Text style={styles.title}>Recepção - Pedidos Prontos</Text>

            {readyOrders.length === 0 ? (
                <Text style={styles.emptyText}>Nenhum pedido aguardando retirada.</Text>
            ) : (
                <FlatList
                    data={readyOrders}
                    keyExtractor={(item) => item.getId()}
                    renderItem={({ item }) => (
                        <View style={styles.orderCard}>
                            <Text style={styles.orderTitle}>Pedido #{item.getId()}</Text>
                            <Text style={styles.statusText}>Status: Prontinho!</Text>
                        </View>
                    )}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#333',
    },
    emptyText: {
        fontSize: 16,
        color: '#888',
        marginTop: 20,
    },
    orderCard: {
        backgroundColor: '#FFF',
        padding: 16,
        borderRadius: 8,
        marginBottom: 12,
        elevation: 2,
    },
    orderTitle: {
        fontSize: 18,
        fontWeight: '600',
    },
    statusText: {
        color: '#3EB26A',
        fontWeight: 'bold',
        marginTop: 4,
    },
});