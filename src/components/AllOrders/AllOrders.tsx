import React, { useState, useMemo } from 'react';
import { View, Text, FlatList, LayoutChangeEvent, TouchableOpacity } from 'react-native';
import { Order } from '../../models/Order';
import { TicketCard } from '../TicketCard/TicketCard';
import { styles } from './AllOrders.styles';

interface AllOrdersProps {
    orders: Order[];
    onClaimOrder: (orderId: string) => void;
}

const CARD_WIDTH = 280;
const GAP = 32;

export const AllOrders: React.FC<AllOrdersProps> = ({
    orders,
    onClaimOrder,
}) => {
    const [containerWidth, setContainerWidth] = useState<number>(0);

    // Atualiza a largura disponível sempre que o layout mudar
    const handleLayout = (event: LayoutChangeEvent) => {
        const { width } = event.nativeEvent.layout;
        setContainerWidth(width);
    };

    // Calcula dinamicamente quantas colunas cabem no espaço disponível
    const numColumns = useMemo(() => {
        if (!containerWidth) return 1;

        // Exemplo: Se couberem 3 cards + 2 gaps, coloca 3 colunas
        const calculated = Math.floor((containerWidth + GAP) / (CARD_WIDTH + GAP));

        // Garante no mínimo 1 coluna
        return Math.max(1, calculated);
    }, [containerWidth]);

    return (
        <View style={styles.container} onLayout={handleLayout}>
            {/* Título da Seção */}
            <Text style={styles.title}>Todos os Pedidos</Text>

            {/* Grid Dinâmico */}
            {containerWidth > 0 && (
                <FlatList
                    key={numColumns}
                    data={orders}
                    keyExtractor={(item) => item.getId()}
                    numColumns={numColumns}
                    scrollEnabled={false}
                    contentContainerStyle={styles.listContent}
                    columnWrapperStyle={numColumns > 1 ? styles.columnWrapper : undefined}
                    renderItem={({ item }) => (
                        <View style={styles.columnItem}>
                            {/* Transformado em botão clicável */}
                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={() => onClaimOrder(item.getId())}
                            >
                                <TicketCard
                                    order={item}
                                    selectedItemIndex={0}
                                    actionText='Pegar Pedido'
                                    backgroundColor="#DEDEDE"
                                />
                            </TouchableOpacity>
                        </View>
                    )}
                />
            )}
        </View>
    );
};