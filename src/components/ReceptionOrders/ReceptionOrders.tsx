// src/components/ReceptionOrders/ReceptionOrders.tsx

import React, { useState, useMemo } from 'react';
import { View, Text, FlatList, TouchableOpacity, LayoutChangeEvent } from 'react-native';
import { Order } from '../../models/Order';
import { OrderOriginEnum } from '../../enums/OrderOriginEnum';
import { TicketCard } from '../TicketCard/TicketCard';
import { styles } from '../AllOrders/AllOrders.styles';

interface ReceptionOrdersProps {
    orders: Order[];
    onSelectOrder?: (orderId: string) => void;
}

type OriginTab = 'PRESENCIAL' | 'IFOOD' | 'SITE';

const CARD_WIDTH = 280;
const GAP = 32;

export const ReceptionOrders: React.FC<ReceptionOrdersProps> = ({ orders, onSelectOrder }) => {
    const [activeTab, setActiveTab] = useState<OriginTab>('PRESENCIAL');
    const [containerWidth, setContainerWidth] = useState<number>(0);

    const handleLayout = (event: LayoutChangeEvent) => {
        const { width } = event.nativeEvent.layout;
        setContainerWidth(width);
    };

    const numColumns = useMemo(() => {
        if (!containerWidth) return 1;
        const calculated = Math.floor((containerWidth + GAP) / (CARD_WIDTH + GAP));
        return Math.max(1, calculated);
    }, [containerWidth]);

    // Filtra os pedidos com base na aba ativa
    const filteredOrders = useMemo(() => {
        return orders.filter((order) => {
            const origin = order.getOrigin();
            if (activeTab === 'IFOOD') return origin === OrderOriginEnum.IFOOD;
            if (activeTab === 'SITE') return origin === OrderOriginEnum.APP;
            return origin === OrderOriginEnum.PRESENTIAL;
        });
    }, [orders, activeTab]);

    // Contadores para o badge das abas
    const counts = useMemo(() => {
        return {
            presencial: orders.filter((o) => o.getOrigin() === OrderOriginEnum.PRESENTIAL).length,
            ifood: orders.filter((o) => o.getOrigin() === OrderOriginEnum.IFOOD).length,
            site: orders.filter((o) => o.getOrigin() === OrderOriginEnum.APP).length,
        };
    }, [orders]);

    return (
        <View style={styles.container} onLayout={handleLayout}>
            {/* Título da Seção */}
            <Text style={styles.title}>Pedidos da Recepção</Text>

            {/* Subseções / Abas de Filtro */}
            <View style={{ flexDirection: 'row', gap: 12, alignSelf: 'flex-start' }}>
                <TouchableOpacity
                    activeOpacity={0.8}
                    style={{
                        paddingVertical: 8,
                        paddingHorizontal: 16,
                        borderRadius: 8,
                        backgroundColor: activeTab === 'PRESENCIAL' ? '#303338' : '#EAE8E5',
                    }}
                    onPress={() => setActiveTab('PRESENCIAL')}
                >
                    <Text
                        style={{
                            fontFamily: 'Lexend',
                            fontSize: 14,
                            color: activeTab === 'PRESENCIAL' ? '#EAE8E5' : '#303338',
                            fontWeight: '500',
                        }}
                    >
                        Presencial ({counts.presencial})
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    activeOpacity={0.8}
                    style={{
                        paddingVertical: 8,
                        paddingHorizontal: 16,
                        borderRadius: 8,
                        backgroundColor: activeTab === 'IFOOD' ? '#303338' : '#EAE8E5',
                    }}
                    onPress={() => setActiveTab('IFOOD')}
                >
                    <Text
                        style={{
                            fontFamily: 'Lexend',
                            fontSize: 14,
                            color: activeTab === 'IFOOD' ? '#EAE8E5' : '#303338',
                            fontWeight: '500',
                        }}
                    >
                        iFood ({counts.ifood})
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    activeOpacity={0.8}
                    style={{
                        paddingVertical: 8,
                        paddingHorizontal: 16,
                        borderRadius: 8,
                        backgroundColor: activeTab === 'SITE' ? '#303338' : '#EAE8E5',
                    }}
                    onPress={() => setActiveTab('SITE')}
                >
                    <Text
                        style={{
                            fontFamily: 'Lexend',
                            fontSize: 14,
                            color: activeTab === 'SITE' ? '#EAE8E5' : '#303338',
                            fontWeight: '500',
                        }}
                    >
                        Site ({counts.site})
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Grid Dinâmico */}
            {containerWidth > 0 && (
                <FlatList
                    key={numColumns}
                    data={filteredOrders}
                    keyExtractor={(item) => item.getId()}
                    numColumns={numColumns}
                    scrollEnabled={false}
                    contentContainerStyle={styles.listContent}
                    columnWrapperStyle={numColumns > 1 ? styles.columnWrapper : undefined}
                    ListEmptyComponent={
                        <Text style={[styles.title, { fontSize: 14, opacity: 0.6, marginTop: 16 }]}>
                            Nenhum pedido nesta subseção.
                        </Text>
                    }
                    renderItem={({ item }) => (
                        <View style={styles.columnItem}>
                            <TicketCard
                                order={item}
                                actionText="Ver Detalhes"
                                isActionDisabled={false}
                                onSelectAction={() => onSelectOrder?.(item.getId())}
                                backgroundColor="#DEDEDE"
                            />
                        </View>
                    )}
                />
            )}
        </View>
    );
};