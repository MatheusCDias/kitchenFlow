import React from 'react';
import { View, Text } from 'react-native';
import Icon from '../Icon';
import { CheckeredBorder } from '../Patterns/CheckeredBorder';
import { styles } from './OrderTicketPreview.styles';
import { ScallopedBorder } from '../Patterns/ScallopedBorder';

export interface OrderItem {
    id: string;
    quantity: number;
    name: string;
    observation?: string;
}

interface OrderTicketPreviewProps {
    orderNumber?: string | number;
    table?: string;
    items: OrderItem[];
    generalObs?: string;
    prepTime?: string;
    backgroundColor?: string;
}

export const OrderTicketPreview: React.FC<OrderTicketPreviewProps> = ({
    orderNumber = '101',
    table,
    items,
    generalObs,
    prepTime,
    backgroundColor = '#EAE8E5',
}) => {
    const bottomColor = backgroundColor === '#DEDEDE' ? '#EAE8E5' : '#F07342';
    const formattedPrepTime = React.useMemo(() => {
        if (!prepTime) return '00:00';
        const mins = parseInt(prepTime, 10);
        if (isNaN(mins)) return '00:00';
        const formattedMins = String(mins).padStart(2, '0');
        return `${formattedMins}:00`;
    }, [prepTime]);

    return (
        <View style={[styles.cardContainer, { backgroundColor }]}>
            <ScallopedBorder
                position="top"
                topColor={backgroundColor}
                bottomColor={bottomColor}
            />

            <View style={styles.cardContent}>
                <View style={styles.header}>
                    <Text style={styles.orderCode}>#{orderNumber}</Text>
                    <Text style={[styles.serviceText, !table && styles.placeholderText]}>
                        {table ? `Mesa ${table}` : 'Mesa --'}
                    </Text>
                </View>
                <View style={styles.divider} />

                <View style={styles.itemsList}>
                    {items.length === 0 ? (
                        <Text style={styles.emptyState}>Adicione itens ao pedido...</Text>
                    ) : (
                        items.map((item) => (
                            <View key={item.id} style={styles.itemRow}>
                                <View style={styles.itemHeader}>
                                    <Text style={styles.itemQuantity}>{item.quantity}x</Text>
                                    <Text style={styles.itemName}>{item.name}</Text>
                                </View>
                                {!!item.observation && (
                                    <Text style={styles.itemObservation}>
                                        {item.observation}
                                    </Text>
                                )}
                            </View>
                        ))
                    )}
                </View>

                <View style={styles.dividerLine} />
                {(!!generalObs || items.length > 0) && <View style={styles.divider} />}

                {!!generalObs && (
                    <View style={styles.generalObsContainer}>
                        <Text style={styles.generalObsText}>
                            Obs: {generalObs}
                        </Text>
                    </View>
                )}

                <View style={styles.footer}>
                    <View style={styles.timerContainer}>
                        <Icon name="schedule" size={18} color="#303338" />
                        <Text style={styles.timerText}>{formattedPrepTime}</Text>
                    </View>
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

export default OrderTicketPreview;