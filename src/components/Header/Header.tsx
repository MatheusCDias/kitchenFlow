import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Pressable } from 'react-native';
import FloatingMenu from '../FloatingMenu/FloatingMenu';
import Icon from '../Icon';
import { styles } from './Header.styles';
import { Employee } from '../../models/employee/Employee';
import { Admin } from '../../models/employee/Admin';

export type ViewMode = 'recepcao' | 'cozinha';

interface HeaderProps {
    title?: string;
    activeMode: ViewMode;
    onModeChange: (mode: ViewMode) => void;
    onMenuPress?: () => void;
    onNotificationPress?: () => void;
    onSelectMenuOption?: (option: string) => void;
    currentUser?: Employee | null;
    showWorkspaceHeader?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
    title = 'Kitchen Flow',
    activeMode,
    onModeChange,
    onMenuPress,
    onNotificationPress,
    onSelectMenuOption,
    currentUser,
    showWorkspaceHeader = true,
}) => {
    const [menuAberto, setMenuAberto] = useState(false);

    const isAdmin =
        currentUser instanceof Admin ||
        currentUser?.getRole()?.toLowerCase() === 'admin';

    return (
        <View style={styles.container}>
            <View style={styles.topContainer}>
                <Pressable
                    style={({ pressed }) => [
                        styles.iconButton,
                        pressed && { backgroundColor: 'rgba(234,232,229, 0.15)' },
                    ]}
                    onPress={() => {
                        setMenuAberto((valorAtual) => !valorAtual);
                        onMenuPress?.();
                    }}
                    android_ripple={{
                        color: 'rgba(234,232,229, 0.15)',
                        borderless: true,
                        radius: 20,
                    }}
                >
                    <Icon name="menu" />
                </Pressable>

                <Text style={styles.title}>{title}</Text>

                <Pressable
                    style={({ pressed }) => [
                        styles.iconButton,
                        pressed && { backgroundColor: 'rgba(234,232,229, 0.15)' },
                    ]}
                    onPress={onNotificationPress}
                    android_ripple={{
                        color: 'rgba(234,232,229, 0.15)',
                        borderless: true,
                        radius: 20,
                    }}
                >
                    <Icon name="notifications" fill={false} />
                </Pressable>

                <FloatingMenu
                    visible={menuAberto}
                    onClose={() => setMenuAberto(false)}
                    currentUser={currentUser}
                    onSelectOption={(option) => {
                        onSelectMenuOption?.(option);
                        setMenuAberto(false);
                    }}
                />
            </View>

            {showWorkspaceHeader && (
                <View style={styles.workspaceHeader}>
                    <Text style={styles.headerTitle}>
                        {activeMode === 'recepcao' ? 'Novo Pedido' : 'Área de Trabalho'}
                    </Text>

                    {isAdmin && (
                        <View style={styles.toggleContainer}>
                            <TouchableOpacity
                                activeOpacity={0.8}
                                style={[
                                    styles.toggleButton,
                                    activeMode === 'recepcao'
                                        ? styles.activeToggleButton
                                        : styles.inactiveToggleButton,
                                ]}
                                onPress={() => onModeChange('recepcao')}
                            >
                                <Icon
                                    name="badge"
                                    fill={activeMode === 'recepcao'}
                                    color={activeMode === 'recepcao' ? '#303338' : '#EAE8E5'}
                                />
                                <Text
                                    style={[
                                        styles.toggleText,
                                        activeMode === 'recepcao'
                                            ? styles.activeToggleText
                                            : styles.inactiveToggleText,
                                    ]}
                                >
                                    Recepção
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                activeOpacity={0.8}
                                style={[
                                    styles.toggleButton,
                                    activeMode === 'cozinha'
                                        ? styles.activeToggleButton
                                        : styles.inactiveToggleButton,
                                ]}
                                onPress={() => onModeChange('cozinha')}
                            >
                                <Icon
                                    name="soup_kitchen"
                                    fill={activeMode === 'cozinha'}
                                    color={activeMode === 'cozinha' ? '#303338' : '#EAE8E5'}
                                />
                                <Text
                                    style={[
                                        styles.toggleText,
                                        activeMode === 'cozinha'
                                            ? styles.activeToggleText
                                            : styles.inactiveToggleText,
                                    ]}
                                >
                                    Cozinha
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            )}
        </View>
    );
};