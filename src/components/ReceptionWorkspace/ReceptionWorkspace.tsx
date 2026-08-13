import React from 'react';
import { Text, View } from 'react-native';
import { NewOrderForm } from '../NewOrderForm/NewOrderForm';
import { NewOrderInput } from '../../services/api';
import { styles } from './ReceptionWorkspace.styles';

interface ReceptionWorkspaceProps {
    onCreateOrder: (input: NewOrderInput) => Promise<unknown>;
}

export const ReceptionWorkspace: React.FC<ReceptionWorkspaceProps> = ({ onCreateOrder }) => {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Novo Pedido</Text>
            </View>
            <NewOrderForm onCreateOrder={onCreateOrder} />
        </View>
    );
};
