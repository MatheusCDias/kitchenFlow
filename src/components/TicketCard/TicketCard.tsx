import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Order } from '../../models/Order';
import { TableService } from '../../models/service/TableService';
import { DeliveryService } from '../../models/service/DeliveryService';
import { OrderStateEnum } from '../../enums/OrderStateEnum';
import { styles } from './TicketCard.styles';
import { ScallopedBorder } from '../Patterns/ScallopedBorder';
import { useCountdown, formatCountdown } from '../../hooks/useCountdown';

interface TicketCardProps {
    order: Order;
    onSelectAction?: () => void;
    actionText?: string;
    isActionDisabled?: boolean;
    onItemPress?: (itemIndex: number) => void;
    selectedItemIndex?: number;
    backgroundColor?: string;
}

export const TicketCard: React.FC<TicketCardProps> = ({
    order,
    onSelectAction,
    actionText,
    isActionDisabled = false,
    onItemPress,
    selectedItemIndex,
    backgroundColor = '#EAE8E5',
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
    const { remainingSeconds, isLate } = useCountdown(order);

    // Se já tem alguém responsável, o botão vira um aviso em vez de convite pra pegar o pedido.
    // Se já foi concluído, isso tem prioridade sobre tudo o mais.
    const assignedEmployee = order.getAssignedEmployee();
    const isDone = order.getStatus() === OrderStateEnum.READY;
    const effectiveActionText = isDone
        ? 'Concluído'
        : assignedEmployee ? `Com ${assignedEmployee.getName()}` : actionText;
    const effectiveIsDisabled = isDone || isActionDisabled || Boolean(assignedEmployee);

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
                        <MaterialIcons name="timer" size={20} color={isLate ? '#ED4545' : '#303338'} />
                        <Text style={[styles.timerText, isLate && styles.lateTimerText]}>
                            {formatCountdown(remainingSeconds)}
                        </Text>
                    </View>

                    {effectiveActionText ? (
                        <TouchableOpacity
                            style={[styles.actionButton, effectiveIsDisabled && styles.disabledButton]}
                            onPress={onSelectAction}
                            disabled={effectiveIsDisabled}
                        >
                            <Text style={styles.actionButtonText}>{effectiveActionText}</Text>
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