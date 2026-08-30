import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import FloatingMenu from '../FloatingMenu/FloatingMenu';
import Icon from '../Icon';
import { styles } from './Header.styles';

export type ViewMode = 'recepcao' | 'cozinha';

interface HeaderProps {
    title?: string;
    activeMode: ViewMode;
    stationLabel?: string;
    onMenuPress?: () => void;
    onNotificationPress?: () => void;
    onSelectMenuOption?: (option: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
    title = 'Kitchen Flow',
    activeMode,
    stationLabel,
    onMenuPress,
    onNotificationPress,
    onSelectMenuOption,
}) => {
    const [menuAberto, setMenuAberto] = useState(false);

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

                <View style={styles.titleGroup}>
                    <Text style={styles.title}>{title}</Text>
                    {stationLabel ? (
                        <Text style={styles.stationLabel}>{stationLabel}</Text>
                    ) : null}
                </View>

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
                    onSelectOption={(option) => {
                        onSelectMenuOption?.(option);
                        setMenuAberto(false);
                    }}
                />
            </View>

            <View style={styles.workspaceHeader}>
                {/* Título dinâmico conforme o modo ativo */}
                <Text style={styles.headerTitle}>
                    {activeMode === 'recepcao' ? 'Novo Pedido' : 'Área de Trabalho'}
                </Text>

                {/* Só mostra em qual modo você está — não é mais clicável.
                    A escolha é feita uma vez, no início (RolePicker/StationPicker),
                    e trocar de aba exigiria recarregar a página. */}
                <View style={styles.toggleContainer}>
                    <View style={[styles.toggleButton, styles.activeToggleButton]}>
                        <Icon
                            name={activeMode === 'recepcao' ? 'badge' : 'soup_kitchen'}
                            fill
                            color="#303338"
                        />
                        <Text style={[styles.toggleText, styles.activeToggleText]}>
                            {activeMode === 'recepcao' ? 'Recepção' : 'Cozinha'}
                        </Text>
                    </View>
                </View>
            </View>
        </View>
    );
};