import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Order } from '../../models/Order';
import { TableService } from '../../models/service/TableService';
import { DeliveryService } from '../../models/service/DeliveryService';
import { styles } from './TicketCard.styles';

interface TicketCardProps {
    order: Order;
    onSelectAction?: () => void;
    actionText?: string;
    isActionDisabled?: boolean;
    onItemPress?: (itemIndex: number) => void;
    selectedItemIndex?: number;
}

export const TicketCard: React.FC<TicketCardProps> = ({
    order,
    onSelectAction,
    actionText,
    isActionDisabled = false,
    onItemPress,
    selectedItemIndex,
}) => {
    // Lógica para determinar o tipo de atendimento (Mesa ou Delivery)
    const service = order.getService();
    let serviceInfo = 'Geral';
    if (service instanceof TableService) {
        serviceInfo = `Mesa ${service.getTableNumber()}`;
    } else if (service instanceof DeliveryService) {
        serviceInfo = 'Delivery';
    }

    // Captura a anotação/observação do primeiro item que possuir notes
    const firstObservation = order.getItems().find(item => item.getNotes())?.getNotes();

    return (
        <View style={styles.cardContainer}>
            {/* Cabeçalho do Cupom */}
            <View style={styles.header}>
                <Text style={styles.orderCode}>#{order.getOrderCode()}</Text>
                <Text style={styles.serviceText}>{serviceInfo}</Text>
            </View>

            <View style={styles.divider} />

            {/* Lista de Itens do Pedido */}
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

            {/* Observação Geral / Detalhes */}
            {firstObservation ? (
                <Text style={styles.notesText} numberOfLines={2}>
                    Obs: {firstObservation}
                </Text>
            ) : null}

            {/* Rodapé do Cupom com Timer e Ação */}
            <View style={styles.footer}>
                <View style={styles.timerContainer}>
                    <MaterialIcons name="access-time" size={16} color="#333" />
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
    );
};