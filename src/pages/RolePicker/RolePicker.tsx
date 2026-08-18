import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Icon from '../../components/Icon';
import { styles } from '../RolePicker/RolePicker.styles';
import { CheckeredBorder } from '../../components/Patterns/CheckeredBorder';

export type Role = 'recepcao' | 'cozinha';

interface RolePickerProps {
    onSelect: (role: Role) => void;
}

export const RolePicker: React.FC<RolePickerProps> = ({ onSelect }) => {
    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>Você é da Recepção ou da Cozinha?</Text>

                <View style={styles.optionsRow}>
                    <TouchableOpacity
                        style={styles.option}
                        activeOpacity={0.8}
                        onPress={() => onSelect('recepcao')}
                    >
                        <Icon name="desktop_windows" size={32} color="#F07342" />
                        <Text style={styles.optionText}>Recepção</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.option}
                        activeOpacity={0.8}
                        onPress={() => onSelect('cozinha')}
                    >
                        <Icon name="restaurant" size={32} color="#F07342" />
                        <Text style={styles.optionText}>Cozinha</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <CheckeredBorder />
        </View>
    );
};

export default RolePicker;