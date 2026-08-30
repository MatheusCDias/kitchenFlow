import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Order } from '../../models/Order';
import { TableService } from '../../models/service/TableService';
import { DeliveryService } from '../../models/service/DeliveryService';
import { styles } from './TicketCard.styles';
import { ScallopedBorder } from '../Patterns/ScallopedBorder';
import Icon from '../Icon'
import { useCountdown, formatCountdown } from '../../hooks/useCountdown';

interface TicketCardProps {
    order: Order;
    onSelectAction?: () => void;
    actionText?: string;
    isActionDisabled?: boolean;
    onItemPress?: (itemIndex: number) => void;
    selectedItemIndex?: number;
    backgroundColor?: string;
    // Mostra qual bancada está com o pedido — usado na visão da Recepção,
    // que não sabe disso de outro jeito (a Cozinha já sabe pelo próprio contexto).
    showAssignedEmployee?: boolean;
}

export const TicketCard: React.FC<TicketCardProps> = ({
    order,
    onSelectAction,
    actionText,
    isActionDisabled = false,
    onItemPress,
    selectedItemIndex,
    backgroundColor = '#EAE8E5',
    showAssignedEmployee = false,
}) => {
    const bottomColor = backgroundColor === '#DEDEDE' ? '#EAE8E5' : '#F07342';
    const service = order.getService();
    let serviceInfo = 'Geral';
    if (service instanceof TableService) {
        serviceInfo = `Mesa ${service.getTableNumber()}`;
    } else if (service instanceof DeliveryService) {
        serviceInfo = 'Delivery';
    }

    const firstObservation = order.getItems().find(item => item.getNotes())?.getNotes();
    const { secondsLeft, isOverdue } = useCountdown(order);
    const assignedEmployee = order.getAssignedEmployee();

    return (
        <View style={[styles.cardContainer, { backgroundColor }]}>
            <ScallopedBorder
                position="top"
                topColor={backgroundColor}
                bottomColor={bottomColor}
            />
            <View style={styles.cardContent}>

                <View style={styles.header}>
                    <Text style={styles.orderCode}>#{order.getOrderCode()}</Text>
                    <Text style={styles.serviceText}>{serviceInfo}</Text>
                </View>

                {showAssignedEmployee ? (
                    <Text style={styles.assignedEmployeeText}>
                        {assignedEmployee ? `Preparando: ${assignedEmployee.getName()}` : 'Aguardando bancada'}
                    </Text>
                ) : null}

                <View style={styles.divider} />
                <View style={styles.itemsContainer}>
                    {order.getItems().map((item, index) => (
                        <TouchableOpacity
                            key={item.getId()}
                            activeOpacity={0.7}
                            disabled={!onItemPress}
                            onPress={() => onItemPress && onItemPress(index)}
                            style={[
                                styles.itemRow,
                                Boolean(onItemPress) && selectedItemIndex === index && styles.selectedItemRow,
                            ]}
                        >
                            <Text style={styles.itemText}>
                                <Text style={styles.itemQuantity}>{item.getQuantity()}x </Text>
                                {item.getProductName()}
                            </Text>
                            {item.getNotes() ? (
                                <Text style={styles.itemSubObs}>{item.getNotes()}</Text>
                            ) : null}
                        </TouchableOpacity>
                    ))}
                    <View style={styles.dividerLine} />
                    {firstObservation ? (
                        <Text style={styles.notesText} numberOfLines={2}>
                            Obs: {firstObservation}
                        </Text>
                    ) : null}
                </View>


                <View style={styles.footer}>
                    <View style={styles.timerContainer}>
                        <Icon name="timer" size={20} color={isOverdue ? '#E53935' : undefined} />
                        <Text style={[styles.timerText, isOverdue && styles.timerTextOverdue]}>
                            {formatCountdown(secondsLeft)}
                        </Text>
                    </View>

                    {actionText ? (
                        <TouchableOpacity
                            style={[styles.actionButton, isActionDisabled && styles.disabledButton]}
                            onPress={onSelectAction}
                            disabled={isActionDisabled}
                        >
                            <Text style={styles.actionButtonText}>{actionText}</Text>
                        </TouchableOpacity>
                    ) : null}
                </View>

            </View>
            <ScallopedBorder
                position="bottom"
                topColor={backgroundColor}
                bottomColor={bottomColor}
            />
        </View>
    );
};