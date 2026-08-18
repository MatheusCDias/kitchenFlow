import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { styles } from './ReceptionWorkspace.styles';
import { CheckeredBorder } from '../Patterns/CheckeredBorder';
import Icon from '../Icon';

interface ReceptionWorkspaceProps {
}

export const ReceptionWorkspace: React.FC<ReceptionWorkspaceProps> = ({ }) => {
    return (
        <View style={styles.container}>
            <View style={styles.optionsRow}>
                <TouchableOpacity
                    style={styles.option}
                    activeOpacity={0.8}
                    onPress={() => []}
                >
                    <Icon name="add" size={32} color="#F07342" />
                    <Text style={styles.optionText}>Novo Pedido</Text>
                </TouchableOpacity>
            </View>
            <CheckeredBorder />
        </View>
    );
};