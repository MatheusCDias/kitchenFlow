import React, { useEffect, useRef, useState } from 'react';
import { Modal, Pressable, Text, View, Animated, Easing } from 'react-native';
import Icon from '../Icon';
import { styles } from './FloatingMenu.styles';
import { CheckeredBorder } from '../Patterns/CheckeredBorder';
import { version } from '../../../package.json';
import { Employee } from '../../models/employee/Employee';
import { Admin } from '../../models/employee/Admin';

interface FloatingMenuProps {
    visible: boolean;
    onClose: () => void;
    onSelectOption?: (option: string) => void;
    currentUser?: Employee | null;
}

export const FloatingMenu: React.FC<FloatingMenuProps> = ({
    visible,
    onClose,
    onSelectOption,
    currentUser,
}) => {
    const slideAnim = useRef(new Animated.Value(-300)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;

    const [currentView, setCurrentView] = useState<'main' | 'config'>('main');

    const isAdmin =
        currentUser instanceof Admin ||
        currentUser?.getRole()?.toLowerCase() === 'admin';

    useEffect(() => {
        if (visible) {
            setCurrentView('main');
            Animated.parallel([
                Animated.timing(slideAnim, {
                    toValue: 0,
                    duration: 250,
                    easing: Easing.out(Easing.ease),
                    useNativeDriver: true,
                }),
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 250,
                    easing: Easing.out(Easing.ease),
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            slideAnim.setValue(-300);
            fadeAnim.setValue(0);
        }
    }, [visible]);

    const handleClose = () => {
        Animated.parallel([
            Animated.timing(slideAnim, {
                toValue: -300,
                duration: 200,
                easing: Easing.in(Easing.ease),
                useNativeDriver: true,
            }),
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }),
        ]).start(() => {
            onClose();
        });
    };

    const handleOptionPress = (option: string) => {
        if (option === 'Configurações') {
            setCurrentView('config');
            return;
        }

        if (onSelectOption) {
            onSelectOption(option);
        } else {
            console.log(`Opção selecionada: ${option}`);
        }
        handleClose();
    };

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="none"
            onRequestClose={handleClose}
        >
            <View style={styles.overlay}>
                <Animated.View style={[styles.backdropContainer, { opacity: fadeAnim }]}>
                    <Pressable style={styles.backdrop} onPress={handleClose} />
                </Animated.View>

                <Animated.View
                    style={[
                        styles.menuContainer,
                        { transform: [{ translateX: slideAnim }] },
                    ]}
                >
                    <View style={styles.menuContent}>
                        {/* Cabeçalho dinâmico com botão de voltar na tela de config */}
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                            {currentView === 'config' && (
                                <Pressable
                                    onPress={() => setCurrentView('main')}
                                    hitSlop={10}
                                    style={({ pressed }) => [pressed && { opacity: 0.6 }]}
                                >
                                    <Icon name="arrow_back" size={24} color="#303338" />
                                </Pressable>
                            )}
                            <Text style={styles.title}>
                                {currentView === 'config' ? 'Configurações' : 'Kitchen Flow'}
                            </Text>
                        </View>

                        {/* VIEW 1: MENU PRINCIPAL */}
                        {currentView === 'main' ? (
                            <View style={styles.optionsList}>
                                <Pressable
                                    onPress={() => handleOptionPress('Área de Trabalho')}
                                    style={({ pressed }) => [
                                        styles.optionButton,
                                        pressed && styles.pressedOptionButton,
                                    ]}
                                >
                                    <Icon name="skillet_cooktop" />
                                    <Text style={styles.optionText}>Área de Trabalho</Text>
                                </Pressable>

                                <Pressable
                                    onPress={() => handleOptionPress('Cardápio')}
                                    style={({ pressed }) => [
                                        styles.optionButton,
                                        pressed && styles.pressedOptionButton,
                                    ]}
                                >
                                    <Icon name="receipt_long" />
                                    <Text style={styles.optionText}>Cardápio</Text>
                                </Pressable>

                                {isAdmin && (
                                    <Pressable
                                        onPress={() => handleOptionPress('Adicionar Funcionário')}
                                        style={({ pressed }) => [
                                            styles.optionButton,
                                            pressed && styles.pressedOptionButton,
                                        ]}
                                    >
                                        <Icon name="person_add" />
                                        <Text style={styles.optionText}>Funcionários</Text>
                                    </Pressable>
                                )}

                                <Pressable
                                    onPress={() => handleOptionPress('Relatórios')}
                                    style={({ pressed }) => [
                                        styles.optionButton,
                                        pressed && styles.pressedOptionButton,
                                    ]}
                                >
                                    <Icon name="assessment" />
                                    <Text style={styles.optionText}>Relatórios</Text>
                                </Pressable>

                                <Pressable
                                    onPress={() => handleOptionPress('Configurações')}
                                    style={({ pressed }) => [
                                        styles.optionButton,
                                        pressed && styles.pressedOptionButton,
                                    ]}
                                >
                                    <Icon name="settings" />
                                    <Text style={styles.optionText}>Configurações</Text>
                                </Pressable>

                                <Pressable
                                    onPress={() => handleOptionPress('Sair')}
                                    style={({ pressed }) => [
                                        styles.optionButton,
                                        pressed && styles.pressedOptionButton,
                                    ]}
                                >
                                    <Icon name="logout" color="#D9383A" />
                                    <Text style={[styles.optionText, { color: '#D9383A' }]}>Sair</Text>
                                </Pressable>
                            </View>
                        ) : (
                            <View style={styles.optionsList}>
                                {isAdmin && (
                                    <Pressable
                                        onPress={() => handleOptionPress('Alterar Senha')}
                                        style={({ pressed }) => [
                                            styles.optionButton,
                                            pressed && styles.pressedOptionButton,
                                        ]}
                                    >
                                        <Icon name="lock" />
                                        <Text style={styles.optionText}>Alterar Senha do Admin</Text>
                                    </Pressable>
                                )}

                                <Pressable
                                    onPress={() => handleOptionPress('Sobre')}
                                    style={({ pressed }) => [
                                        styles.optionButton,
                                        pressed && styles.pressedOptionButton,
                                    ]}
                                >
                                    <Icon name="info" />
                                    <Text style={styles.optionText}>Sobre a Aplicação</Text>
                                </Pressable>
                            </View>
                        )}
                    </View>

                    <View>
                        <Text style={styles.footerVersion}>
                            Versão {version}
                        </Text>
                        <CheckeredBorder primaryColor="#ED4545" />
                    </View>
                </Animated.View>
            </View>
        </Modal>
    );
};

export default FloatingMenu;