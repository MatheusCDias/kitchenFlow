import React, { useState, useMemo } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    LayoutChangeEvent,
    Modal,
    Pressable,
    Alert,
    Platform,
} from 'react-native';
import { Order } from '../../models/Order';
import { OrderOriginEnum } from '../../enums/OrderOriginEnum';
import { OrderStateEnum } from '../../enums/OrderStateEnum';
import { TicketCard } from '../TicketCard/TicketCard';
import { styles } from '../AllOrders/AllOrders.styles';

interface ReceptionOrdersProps {
    orders: Order[];
    onSelectOrder?: (orderId: string) => void;
    onCancelOrder?: (order: Order) => void;
    onDeleteOrder?: (orderId: string) => void;
}

const CARD_WIDTH = 280;
const GAP = 32;

const ORDER_TIMELINE_STEPS = [
    { key: OrderStateEnum.RECEIVED, label: 'Recebido' },
    { key: OrderStateEnum.PENDING, label: 'Pendente' },
    { key: OrderStateEnum.IN_PREPARATION, label: 'Em Preparo' },
    { key: OrderStateEnum.READY, label: 'Pronto' },
    { key: OrderStateEnum.ON_THE_WAY, label: 'A Caminho' },
    { key: OrderStateEnum.DELIVERED, label: 'Entregue' },
];

export const ReceptionOrders: React.FC<ReceptionOrdersProps> = ({
    orders,
    onSelectOrder,
    onCancelOrder,
    onDeleteOrder,
}) => {
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

    const filteredOrders = useMemo(() => {
        return orders.filter((order) => order.getOrigin() === activeTab);
    }, [orders, activeTab]);

    const counts = useMemo(() => {
        return {
            [OrderOriginEnum.PRESENTIAL]: orders.filter((o) => o.getOrigin() === OrderOriginEnum.PRESENTIAL).length,
            [OrderOriginEnum.IFOOD]: orders.filter((o) => o.getOrigin() === OrderOriginEnum.IFOOD).length,
            [OrderOriginEnum.APP]: orders.filter((o) => o.getOrigin() === OrderOriginEnum.APP).length,
        };
    }, [orders]);

    // Diálogo de confirmação para cancelamento
    const handleConfirmCancel = () => {
        if (!selectedOrderForTimeline) return;

        const executeCancel = () => {
            onCancelOrder?.(selectedOrderForTimeline);
            setSelectedOrderForTimeline(null);
        };

        if (Platform.OS === 'web') {
            const confirmed = window.confirm(
                `Tem certeza de que deseja cancelar o Pedido #${selectedOrderForTimeline.getOrderCode()}?`
            );
            if (confirmed) {
                executeCancel();
            }
            return;
        }

        Alert.alert(
            'Cancelar Pedido',
            `Deseja realmente cancelar o Pedido #${selectedOrderForTimeline.getOrderCode()}?`,
            [
                { text: 'Voltar', style: 'cancel' },
                {
                    text: 'Confirmar Cancelamento',
                    style: 'destructive',
                    onPress: executeCancel,
                },
            ]
        );
    };

    // Diálogo de confirmação para exclusão definitiva
    const handleConfirmDelete = () => {
        if (!selectedOrderForTimeline) return;

        const orderIdToDelete = selectedOrderForTimeline.getId();

        const executeDelete = () => {
            // 1. Fecha o modal primeiro
            setSelectedOrderForTimeline(null);
            // 2. Dispara a exclusão global
            onDeleteOrder?.(orderIdToDelete);
        };

        if (Platform.OS === 'web') {
            const confirmed = window.confirm(
                `Tem certeza de que deseja excluir permanentemente o Pedido #${selectedOrderForTimeline.getOrderCode()}? Esta ação não pode ser desfeita.`
            );
            if (confirmed) {
                executeDelete();
            }
            return;
        }

        Alert.alert(
            'Excluir Pedido',
            `Deseja realmente excluir permanentemente o Pedido #${selectedOrderForTimeline.getOrderCode()}?`,
            [
                { text: 'Voltar', style: 'cancel' },
                {
                    text: 'Excluir Definitivamente',
                    style: 'destructive',
                    onPress: executeDelete,
                },
            ]
        );
    };

    const isOrderCancelled = selectedOrderForTimeline?.getStatus() === OrderStateEnum.CANCELLED;
    const isOrderDelivered = selectedOrderForTimeline?.getStatus() === OrderStateEnum.DELIVERED;

    return (
        <View style={styles.container} onLayout={handleLayout}>
            <Text style={styles.title}>Pedidos da Recepção</Text>

            {/* Abas de Origem */}
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
                        App ({counts[OrderOriginEnum.APP]})
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

                        {/* Etapas da Linha do Tempo */}
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

                        {/* Botões do Rodapé */}
                        <View style={{ flexDirection: 'row', gap: 12, marginTop: 8 }}>
                            {/* Se o pedido estiver cancelado, exibe "Excluir Pedido" */}
                            {isOrderCancelled ? (
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    style={{
                                        flex: 1,
                                        backgroundColor: '#D9383A',
                                        borderRadius: 8,
                                        paddingVertical: 12,
                                        alignItems: 'center',
                                    }}
                                    onPress={handleConfirmDelete}
                                >
                                    <Text style={{ fontFamily: 'Lexend', color: '#FFFFFF', fontWeight: '600' }}>
                                        Excluir Pedido
                                    </Text>
                                </TouchableOpacity>
                            ) : (
                                /* Se NÃO estiver cancelado e NÃO estiver entregue, exibe "Cancelar Pedido" */
                                !isOrderDelivered && (
                                    <TouchableOpacity
                                        activeOpacity={0.8}
                                        style={{
                                            flex: 1,
                                            backgroundColor: '#ED4545',
                                            borderRadius: 8,
                                            paddingVertical: 12,
                                            alignItems: 'center',
                                        }}
                                        onPress={handleConfirmCancel}
                                    >
                                        <Text style={{ fontFamily: 'Lexend', color: '#FFFFFF', fontWeight: '600' }}>
                                            Cancelar Pedido
                                        </Text>
                                    </TouchableOpacity>
                                )
                            )}

                            {/* Botão Fechar */}
                            <TouchableOpacity
                                activeOpacity={0.8}
                                style={{
                                    flex: 1,
                                    backgroundColor: '#303338',
                                    borderRadius: 8,
                                    paddingVertical: 12,
                                    alignItems: 'center',
                                }}
                                onPress={() => setSelectedOrderForTimeline(null)}
                            >
                                <Text style={{ fontFamily: 'Lexend', color: '#EAE8E5', fontWeight: '500' }}>
                                    Fechar
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </Pressable>
                </Pressable>
            </Modal>
        </View>
    );
};