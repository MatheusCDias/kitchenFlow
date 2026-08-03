import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Order } from '../../models/Order';
import { TableService } from '../../models/service/TableService';
import { DeliveryService } from '../../models/service/DeliveryService';
import { styles } from './TicketCard.styles';
import { ScallopedBorder } from '../Patterns/ScallopedBorder';

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
                                selectedItemIndex === index && styles.selectedItemRow,
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
                </View>

                {firstObservation ? (
                    <Text style={styles.notesText} numberOfLines={2}>
                        Obs: {firstObservation}
                    </Text>
                ) : null}

                <View style={styles.footer}>
                    <View style={styles.timerContainer}>
                        <MaterialCommunityIcons name="timer-outline" size={20} color="#303338" />
                        <Text style={styles.timerText}>05:00</Text>
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