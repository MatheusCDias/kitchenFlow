import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Pressable } from 'react-native';
import FloatingMenu from '../FloatingMenu/FloatingMenu';
import Icon from '../Icon';
import { styles } from './Header.styles';

export type ViewMode = 'recepcao' | 'cozinha';

interface HeaderProps {
    title?: string;
    activeMode: ViewMode;
    onModeChange: (mode: ViewMode) => void;
    onMenuPress?: () => void;
    onNotificationPress?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
    title = 'Kitchen Flow',
    activeMode,
    onModeChange,
    onMenuPress,
    onNotificationPress,
}) => {
    const [menuAberto, setMenuAberto] = useState(false);

    return (
        <View style={styles.container}>
            <View style={styles.topContainer}>
                <Pressable
                    style={({ pressed }) => [
                        styles.iconButton,
                        pressed && { backgroundColor: 'rgba(234,232,229, 0.15)' }
                    ]}
                    onPress={() => {
                        setMenuAberto(valorAtual => !valorAtual);
                        onMenuPress?.();
                    }}
                    android_ripple={{ color: 'rgba(234,232,229, 0.15)', borderless: true, radius: 20 }}
                >
                    <Icon name="menu" />
                </Pressable>

                <Text style={styles.title}>{title}</Text>

                <Pressable
                    style={({ pressed }) => [
                        styles.iconButton,
                        pressed && { backgroundColor: 'rgba(234,232,229, 0.15)' }
                    ]}
                    onPress={onNotificationPress}
                    android_ripple={{ color: 'rgba(234,232,229, 0.15)', borderless: true, radius: 20 }}
                >
                    <Icon name="notifications" fill={false} />
                </Pressable>

                <FloatingMenu
                    visible={menuAberto}
                    onClose={() => setMenuAberto(false)}
                />
            </View>

            <View style={styles.workspaceHeader}>
                <Text style={styles.headerTitle}>Área de Trabalho</Text>
                <View style={styles.toggleContainer}>
                    {/* Botão Recepção */}
                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={[
                            styles.toggleButton,
                            activeMode === 'recepcao' ? styles.activeToggleButton : styles.inactiveToggleButton,
                        ]}
                        onPress={() => onModeChange('recepcao')}
                    >
                        <Icon
                            name="desktop_windows"
                            fill={activeMode === 'recepcao'}
                            color={activeMode === 'recepcao' ? '#303338' : '#EAE8E5'}
                        />
                        <Text
                            style={[
                                styles.toggleText,
                                activeMode === 'recepcao' ? styles.activeToggleText : styles.inactiveToggleText,
                            ]}
                        >
                            Recepção
                        </Text>
                    </TouchableOpacity>

                    {/* Botão Cozinha */}
                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={[
                            styles.toggleButton,
                            activeMode === 'cozinha' ? styles.activeToggleButton : styles.inactiveToggleButton,
                        ]}
                        onPress={() => onModeChange('cozinha')}
                    >
                        <Icon
                            name="chef_hat"
                            fill={activeMode === 'cozinha'}
                            color={activeMode === 'cozinha' ? '#303338' : '#EAE8E5'}
                        />
                        <Text
                            style={[
                                styles.toggleText,
                                activeMode === 'cozinha' ? styles.activeToggleText : styles.inactiveToggleText,
                            ]}
                        >
                            Cozinha
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};