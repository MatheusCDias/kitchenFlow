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

    // Atualiza a largura disponível sempre que o layout mudar
    const handleLayout = (event: LayoutChangeEvent) => {
        const { width } = event.nativeEvent.layout;
        setContainerWidth(width);
    };

    // Calcula dinamicamente quantas colunas cabem no espaço disponível
    const numColumns = useMemo(() => {
        if (!containerWidth) return 1;
        const calculated = Math.floor((containerWidth + GAP) / (CARD_WIDTH + GAP));
        return Math.max(1, calculated);
    }, [containerWidth]);

    // Função para definir o texto e estado do botão de ação de acordo com as regras de negócio
    const getActionButtonConfig = (order: Order) => {
        const status = order.getStatus();

        if (
            status === OrderStateEnum.READY ||
            status === OrderStateEnum.DELIVERED
        ) {
            return {
                actionText: 'Concluído',
                isActionDisabled: true,
            };
        }

        const assignedEmployee = order.getAssignedEmployee();
        const isActiveOrder = activeOrder?.getId() === order.getId();
        const isAssignedToCurrentUser = assignedEmployee?.getId() === currentUser.getId();

        if (isActiveOrder || isAssignedToCurrentUser) {
            return {
                actionText: 'Em Andamento',
                isActionDisabled: true,
            };
        }

        if (assignedEmployee) {
            return {
                actionText: assignedEmployee.getName(),
                isActionDisabled: true,
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