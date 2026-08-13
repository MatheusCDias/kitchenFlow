import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import FloatingMenu from '../FloatingMenu/FloatingMenu';
import { styles } from './Header.styles';

interface HeaderProps {
    title?: string;
    stationLabel?: string;
    onMenuPress?: () => void;
    onNotificationPress?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
    title = 'Kitchen Flow',
    stationLabel,
    onMenuPress,
    onNotificationPress,
}) => {
    const [menuAberto, setMenuAberto] = useState(false);

    return (
        <View style={styles.container}>
            <Pressable
                style={({ pressed }) => [
                    styles.iconButton,
                    pressed && {
                        backgroundColor: 'rgba(234,232,229,0.15)',
                    },
                ]}
                onPress={() => {
                    setMenuAberto(valorAtual => !valorAtual);
                    onMenuPress?.();
                }}
                android_ripple={{
                    color: 'rgba(234,232,229,0.15)',
                    borderless: true,
                    radius: 20,
                }}
            >
                <MaterialIcons
                    name="menu"
                    size={24}
                    color="#303338"
                />
            </Pressable>

            <View style={styles.titleGroup}>
                <Text style={styles.title}>{title}</Text>
                {stationLabel ? (
                    <Text style={styles.stationBadge}>{stationLabel}</Text>
                ) : null}
            </View>

            <Pressable
                style={({ pressed }) => [
                    styles.iconButton,
                    pressed && {
                        backgroundColor: 'rgba(234,232,229,0.15)',
                    },
                ]}
                onPress={onNotificationPress}
                android_ripple={{
                    color: 'rgba(234,232,229,0.15)',
                    borderless: true,
                    radius: 20,
                }}
            >
                <MaterialIcons
                    name="notifications-none"
                    size={24}
                    color="#303338"
                />
            </Pressable>

            <FloatingMenu
                visible={menuAberto}
                onClose={() => setMenuAberto(false)}
            />
        </View>
    );
};