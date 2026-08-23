// src/components/ReceptionOrders/ReceptionOrders.tsx

import React, { useState, useMemo } from 'react';
import { View, Text, FlatList, TouchableOpacity, LayoutChangeEvent, Modal, Pressable } from 'react-native';
import { Order } from '../../models/Order';
import { OrderOriginEnum } from '../../enums/OrderOriginEnum';
import { OrderStateEnum } from '../../enums/OrderStateEnum';
import { TicketCard } from '../TicketCard/TicketCard';
import { styles } from '../AllOrders/AllOrders.styles';

interface ReceptionOrdersProps {
    orders: Order[];
    onSelectOrder?: (orderId: string) => void;
}

const CARD_WIDTH = 280;
const GAP = 32;

// Ordem lógica dos estados no fluxo do pedido
const ORDER_TIMELINE_STEPS = [
    { key: OrderStateEnum.RECEIVED, label: 'Recebido' },
    { key: OrderStateEnum.PENDING, label: 'Pendente' },
    { key: OrderStateEnum.IN_PREPARATION, label: 'Em Preparo' },
    { key: OrderStateEnum.READY, label: 'Pronto' },
    { key: OrderStateEnum.ON_THE_WAY, label: 'A Caminho' },
    { key: OrderStateEnum.DELIVERED, label: 'Entregue' },
];

export const ReceptionOrders: React.FC<ReceptionOrdersProps> = ({ orders, onSelectOrder }) => {
    // Utiliza diretamente o OrderOriginEnum como tipo do estado
    const [activeTab, setActiveTab] = useState<OrderOriginEnum>(OrderOriginEnum.PRESENTIAL);
    const [containerWidth, setContainerWidth] = useState<number>(0);
    const [selectedOrderForTimeline, setSelectedOrderForTimeline] = useState<Order | null>(null);

    const handleLayout = (event: LayoutChangeEvent) => {
        const { width } = event.nativeEvent.layout;
        setContainerWidth(width);
    };

    const numColumns = useMemo(() => {
        if (!containerWidth) return 1;
        const calculated = Math.floor((containerWidth + GAP) / (CARD_WIDTH + GAP));
        return Math.max(1, calculated);
    }, [containerWidth]);

    const getStatusLabel = (status: OrderStateEnum): string => {
        switch (status) {
            case OrderStateEnum.RECEIVED:
                return 'Recebido';
            case OrderStateEnum.PENDING:
                return 'Pendente';
            case OrderStateEnum.IN_PREPARATION:
                return 'Em Preparo';
            case OrderStateEnum.READY:
                return 'Pronto';
            case OrderStateEnum.ON_THE_WAY:
                return 'A Caminho';
            case OrderStateEnum.DELIVERED:
                return 'Entregue';
            case OrderStateEnum.COMPLETED:
                return 'Concluído';
            case OrderStateEnum.CANCELLED:
                return 'Cancelado';
            default:
                return 'Desconhecido';
        }
    };

    // Filtra os pedidos comparando diretamente com o OrderOriginEnum
    const filteredOrders = useMemo(() => {
        return orders.filter((order) => order.getOrigin() === activeTab);
    }, [orders, activeTab]);

    // Contadores das abas agrupados por valor do enum
    const counts = useMemo(() => {
        return {
            [OrderOriginEnum.PRESENTIAL]: orders.filter((o) => o.getOrigin() === OrderOriginEnum.PRESENTIAL).length,
            [OrderOriginEnum.IFOOD]: orders.filter((o) => o.getOrigin() === OrderOriginEnum.IFOOD).length,
            [OrderOriginEnum.APP]: orders.filter((o) => o.getOrigin() === OrderOriginEnum.APP).length,
        };
    }, [orders]);

    return (
        <View style={styles.container} onLayout={handleLayout}>
            <Text style={styles.title}>Pedidos da Recepção</Text>

            {/* Abas de Filtro usando OrderOriginEnum */}
            <View style={{ flexDirection: 'row', gap: 12, alignSelf: 'flex-start' }}>
                <TouchableOpacity
                    activeOpacity={0.8}
                    style={{
                        paddingVertical: 8,
                        paddingHorizontal: 16,
                        borderRadius: 8,
                        backgroundColor: activeTab === OrderOriginEnum.PRESENTIAL ? '#303338' : '#EAE8E5',
                    }}
                    onPress={() => setActiveTab(OrderOriginEnum.PRESENTIAL)}
                >
                    <Text
                        style={{
                            fontFamily: 'Lexend',
                            fontSize: 14,
                            color: activeTab === OrderOriginEnum.PRESENTIAL ? '#EAE8E5' : '#303338',
                            fontWeight: '500',
                        }}
                    >
                        Presencial ({counts[OrderOriginEnum.PRESENTIAL]})
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    activeOpacity={0.8}
                    style={{
                        paddingVertical: 8,
                        paddingHorizontal: 16,
                        borderRadius: 8,
                        backgroundColor: activeTab === OrderOriginEnum.IFOOD ? '#303338' : '#EAE8E5',
                    }}
                    onPress={() => setActiveTab(OrderOriginEnum.IFOOD)}
                >
                    <Text
                        style={{
                            fontFamily: 'Lexend',
                            fontSize: 14,
                            color: activeTab === OrderOriginEnum.IFOOD ? '#EAE8E5' : '#303338',
                            fontWeight: '500',
                        }}
                    >
                        iFood ({counts[OrderOriginEnum.IFOOD]})
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    activeOpacity={0.8}
                    style={{
                        paddingVertical: 8,
                        paddingHorizontal: 16,
                        borderRadius: 8,
                        backgroundColor: activeTab === OrderOriginEnum.APP ? '#303338' : '#EAE8E5',
                    }}
                    onPress={() => setActiveTab(OrderOriginEnum.APP)}
                >
                    <Text
                        style={{
                            fontFamily: 'Lexend',
                            fontSize: 14,
                            color: activeTab === OrderOriginEnum.APP ? '#EAE8E5' : '#303338',
                            fontWeight: '500',
                        }}
                    >
                        Site/App ({counts[OrderOriginEnum.APP]})
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
                                actionText={getStatusLabel(item.getStatus())}
                                isActionDisabled={false}
                                onSelectAction={() => {
                                    setSelectedOrderForTimeline(item);
                                    onSelectOrder?.(item.getId());
                                }}
                                backgroundColor="#DEDEDE"
                            />
                        </View>
                    )}
                />
            )}

            {/* Modal de Linha do Tempo */}
            <Modal
                visible={Boolean(selectedOrderForTimeline)}
                transparent
                animationType="fade"
                onRequestClose={() => setSelectedOrderForTimeline(null)}
            >
                <Pressable
                    style={{
                        flex: 1,
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: 24,
                    }}
                    onPress={() => setSelectedOrderForTimeline(null)}
                >
                    <Pressable
                        style={{
                            backgroundColor: '#FFFFFF',
                            borderRadius: 16,
                            padding: 24,
                            width: '100%',
                            maxWidth: 500,
                            gap: 20,
                        }}
                        onPress={(e) => e.stopPropagation()}
                    >
                        <Text style={{ fontFamily: 'Lexend', fontSize: 18, fontWeight: '600', color: '#303338' }}>
                            Status do Pedido #{selectedOrderForTimeline?.getOrderCode()}
                        </Text>

                        <View style={{ gap: 16, marginVertical: 8 }}>
                            {ORDER_TIMELINE_STEPS.map((step, index) => {
                                const currentStatus = selectedOrderForTimeline?.getStatus();
                                const isCurrent = currentStatus === step.key;
                                const currentIndex = ORDER_TIMELINE_STEPS.findIndex((s) => s.key === currentStatus);
                                const isPassed = currentIndex !== -1 && index < currentIndex;

                                return (
                                    <View key={step.key} style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                                        <View
                                            style={{
                                                width: 20,
                                                height: 20,
                                                borderRadius: 10,
                                                borderWidth: 2,
                                                borderColor: isCurrent || isPassed ? '#303338' : '#DEDEDE',
                                                backgroundColor: isCurrent || isPassed ? '#303338' : '#FFFFFF',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                            }}
                                        >
                                            {isPassed && (
                                                <Text style={{ color: '#FFF', fontSize: 10, fontWeight: 'bold' }}>✓</Text>
                                            )}
                                        </View>

                                        <Text
                                            style={{
                                                fontFamily: 'Lexend',
                                                fontSize: 15,
                                                color: isCurrent ? '#303338' : isPassed ? '#60646C' : '#999',
                                                fontWeight: isCurrent ? '700' : '400',
                                            }}
                                        >
                                            {step.label} {isCurrent ? '(Atual)' : ''}
                                        </Text>
                                    </View>
                                );
                            })}
                        </View>

                        <TouchableOpacity
                            activeOpacity={0.8}
                            style={{
                                backgroundColor: '#303338',
                                borderRadius: 8,
                                paddingVertical: 12,
                                alignItems: 'center',
                                marginTop: 8,
                            }}
                            onPress={() => setSelectedOrderForTimeline(null)}
                        >
                            <Text style={{ fontFamily: 'Lexend', color: '#EAE8E5', fontWeight: '500' }}>
                                Fechar
                            </Text>
                        </TouchableOpacity>
                    </Pressable>
                </Pressable>
            </Modal>
        </View>
    );
};