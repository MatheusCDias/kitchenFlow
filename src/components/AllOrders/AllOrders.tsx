import React, { useState, useMemo } from 'react';
import { View, Text, FlatList, LayoutChangeEvent } from 'react-native';
import { Order } from '../../models/Order';
import { Employee } from '../../models/employee/Employee';
import { TicketCard } from '../TicketCard/TicketCard';
import { OrderStateEnum } from '../../enums/OrderStateEnum';
import { styles } from './AllOrders.styles';

interface AllOrdersProps {
    orders: Order[];
    activeOrder: Order | null;
    currentUser: Employee;
    onClaimOrder: (orderId: string) => void;
}

const CARD_WIDTH = 280;
const GAP = 32;

export const AllOrders: React.FC<AllOrdersProps> = ({
    orders,
    activeOrder,
    currentUser,
    onClaimOrder,
}) => {
    const [containerWidth, setContainerWidth] = useState<number>(0);

    const visibleOrders = useMemo(() => {
        return orders.filter((order) => {
            const status = order.getStatus();
            return (
                status !== OrderStateEnum.READY &&
                status !== OrderStateEnum.DELIVERED &&
                status !== OrderStateEnum.COMPLETED &&
                status !== OrderStateEnum.CANCELLED
            );
        });
    }, [orders]);

    const handleLayout = (event: LayoutChangeEvent) => {
        const { width } = event.nativeEvent.layout;
        setContainerWidth(width);
    };

    const numColumns = useMemo(() => {
        if (!containerWidth) return 1;
        const calculated = Math.floor((containerWidth + GAP) / (CARD_WIDTH + GAP));
        return Math.max(1, calculated);
    }, [containerWidth]);

    const getActionButtonConfig = (order: Order) => {
        const assignedEmployee = order.getAssignedEmployee();
        const isActiveOrder = activeOrder?.getId() === order.getId();
        const isAssignedToCurrentUser = assignedEmployee?.getId() === currentUser.getId();

        if (isActiveOrder || isAssignedToCurrentUser) {
            return {
                actionText: 'Em Andamento',
                isActionDisabled: true,
                variant: 'in_progress' as const,
            };
        }

        if (assignedEmployee) {
            return {
                actionText: assignedEmployee.getName(),
                isActionDisabled: true,
                variant: 'assigned' as const,
            };
        }

        const hasActiveWorkspaceOrder = Boolean(activeOrder);

        return {
            actionText: 'Pegar Pedido',
            isActionDisabled: hasActiveWorkspaceOrder,
            variant: 'default' as const,
        };
    };

    return (
        <View style={styles.container} onLayout={handleLayout}>
            <Text style={styles.title}>Todos os Pedidos</Text>

            {containerWidth > 0 && (
                <FlatList
                    key={numColumns}
                    data={visibleOrders}
                    keyExtractor={(item) => item.getId()}
                    numColumns={numColumns}
                    scrollEnabled={false}
                    contentContainerStyle={styles.listContent}
                    columnWrapperStyle={numColumns > 1 ? styles.columnWrapper : undefined}
                    ListEmptyComponent={
                        <Text style={[styles.title, { fontSize: 14, opacity: 0.6, marginTop: 16 }]}>
                            Nenhum pedido pendente na cozinha.
                        </Text>
                    }
                    renderItem={({ item }) => {
                        const { actionText, isActionDisabled } = getActionButtonConfig(item);

                        return (
                            <View style={styles.columnItem}>
                                <TicketCard
                                    order={item}
                                    actionText={actionText}
                                    isActionDisabled={isActionDisabled}
                                    onSelectAction={() => onClaimOrder(item.getId())}
                                    backgroundColor="#DEDEDE"
                                />
                            </View>
                        );
                    }}
                />
            )}
        </View>
    );
};