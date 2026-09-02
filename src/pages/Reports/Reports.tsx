import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { getActivityLogs, ActivityLog } from '../../services/LogService';
import Icon from '../../components/Icon';

interface ReportsProps {
    onBack: () => void;
}

export const Reports: React.FC<ReportsProps> = ({ onBack }) => {
    const [logs, setLogs] = useState<ActivityLog[]>([]);

    useEffect(() => {
        setLogs(getActivityLogs());
    }, []);

    const formatDateTime = (isoDate: string) => {
        const d = new Date(isoDate);
        const date = d.toLocaleDateString('pt-BR');
        const time = d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        return `${date} às ${time}`;
    };

    const getBadgeConfig = (action: ActivityLog['action']) => {
        switch (action) {
            case 'PEDIDO_CRIADO':
                return { label: 'CRIADO', color: '#1E88E5', icon: 'add_circle' };
            case 'PEDIDO_PEGO':
                return { label: 'EM PREPARO', color: '#F07342', icon: 'skillet_cooktop' };
            case 'PEDIDO_CONCLUIDO':
                return { label: 'CONCLUÍDO', color: '#3EB26A', icon: 'check_circle' };
            case 'PEDIDO_LIBERADO':
                return { label: 'CANCELADO/DEVOLVIDO', color: '#ED4545', icon: 'cancel' };
            default:
                return { label: action, color: '#686B70', icon: 'info' };
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={onBack} style={styles.backBtn}>
                    <Icon name="arrow_back" size={24} color="#303338" />
                </TouchableOpacity>
                <Text style={styles.title}>Histórico & Relatórios</Text>
            </View>

            <FlatList
                data={logs}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.list}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Icon name="assignment" size={48} color="#A09C9D" />
                        <Text style={styles.emptyText}>Nenhuma atividade registrada até o momento.</Text>
                    </View>
                }
                renderItem={({ item }) => {
                    const badge = getBadgeConfig(item.action);

                    return (
                        <View style={styles.logCard}>
                            <View style={styles.cardHeader}>
                                <View style={styles.leftHeader}>
                                    <View style={[styles.badge, { backgroundColor: badge.color }]}>
                                        <Text style={styles.badgeText}>{badge.label}</Text>
                                    </View>
                                    <Text style={styles.orderTag}>Pedido #{item.order_code}</Text>
                                </View>
                                <Text style={styles.timestamp}>{formatDateTime(item.created_at)}</Text>
                            </View>

                            <View style={styles.cardBody}>
                                <View style={styles.employeeInfo}>
                                    <Icon name="person" size={18} color="#60646C" />
                                    <Text style={styles.employeeName}>
                                        {item.employee_name} ({item.employee_role})
                                    </Text>
                                </View>
                                {item.details ? (
                                    <Text style={styles.detailsText}>{item.details}</Text>
                                ) : null}
                            </View>
                        </View>
                    );
                }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EAE8E5',
        padding: 16,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 16,
    },
    backBtn: {
        padding: 6,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        fontFamily: 'Lexend',
        color: '#303338',
    },
    list: {
        paddingBottom: 32,
        gap: 12,
    },
    logCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    leftHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    badge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    badgeText: {
        color: '#FFFFFF',
        fontSize: 11,
        fontWeight: 'bold',
    },
    orderTag: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#303338',
    },
    timestamp: {
        fontSize: 12,
        color: '#888',
    },
    cardBody: {
        borderTopWidth: 1,
        borderTopColor: '#F0EFEA',
        paddingTop: 8,
        gap: 4,
    },
    employeeInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    employeeName: {
        fontSize: 13,
        color: '#303338',
        fontWeight: '600',
    },
    detailsText: {
        fontSize: 13,
        color: '#666',
        marginTop: 2,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 60,
        gap: 12,
    },
    emptyText: {
        fontSize: 14,
        color: '#888',
    },
});