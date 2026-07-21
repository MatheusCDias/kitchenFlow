import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { styles } from './Header.styles';

interface HeaderProps {
    title?: string;
    onMenuPress?: () => void;
    onNotificationPress?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
    title = 'Kitchen Flow',
    onMenuPress,
    onNotificationPress,
}) => {
    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.iconButton}
                onPress={onMenuPress}
                activeOpacity={0.7}
            >
                <MaterialIcons name="menu" size={26} color="#333333" />
            </TouchableOpacity>

            <Text style={styles.title}>{title}</Text>

            <TouchableOpacity
                style={styles.iconButton}
                onPress={onNotificationPress}
                activeOpacity={0.7}
            >
                <MaterialIcons name="notifications-none" size={26} color="#333333" />
            </TouchableOpacity>
        </View>
    );
};