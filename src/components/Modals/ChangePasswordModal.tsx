import React, { useState } from 'react';
import {
    Modal,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    Platform,
} from 'react-native';
import Icon from '../Icon';
import { updateAdminPassword } from '../../services/EmployeeService';

interface ChangePasswordModalProps {
    visible: boolean;
    onClose: () => void;
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
    visible,
    onClose,
}) => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const handleClose = () => {
        setNewPassword('');
        setConfirmPassword('');
        setError('');
        onClose();
    };

    const handleSave = () => {
        if (!newPassword.trim()) {
            setError('Digite a nova senha.');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('As senhas não coincidem!');
            return;
        }

        const success = updateAdminPassword(newPassword.trim());

        if (success) {
            if (Platform.OS === 'web') {
                window.alert('Senha do Admin atualizada com sucesso!');
            } else {
                Alert.alert('Sucesso', 'Senha do Admin atualizada com sucesso!');
            }
            handleClose();
        } else {
            setError('Erro ao atualizar a senha.');
        }
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={handleClose}
        >
            <View style={styles.overlay}>
                <View style={styles.card}>
                    <View style={styles.header}>
                        <TouchableOpacity onPress={handleClose} style={styles.backButton}>
                            <Icon name="arrow_back" size={24} color="#303338" />
                        </TouchableOpacity>
                        <Text style={styles.title}>Alterar Senha</Text>
                    </View>

                    <View style={styles.body}>
                        <Text style={styles.label}>Nova Senha</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Digite a nova senha"
                            placeholderTextColor="#A09C9D"
                            secureTextEntry
                            value={newPassword}
                            onChangeText={(text) => {
                                setNewPassword(text);
                                if (error) setError('');
                            }}
                        />

                        <Text style={styles.label}>Confirmar Nova Senha</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Confirme a nova senha"
                            placeholderTextColor="#A09C9D"
                            secureTextEntry
                            value={confirmPassword}
                            onChangeText={(text) => {
                                setConfirmPassword(text);
                                if (error) setError('');
                            }}
                        />

                        {error ? <Text style={styles.errorText}>{error}</Text> : null}
                    </View>

                    <View style={styles.footer}>
                        <TouchableOpacity
                            style={styles.confirmButton}
                            activeOpacity={0.8}
                            onPress={handleSave}
                        >
                            <Text style={styles.confirmButtonText}>Confirmar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        width: '100%',
        maxWidth: 380,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 5,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        gap: 12,
    },
    backButton: {
        padding: 4,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#303338',
    },
    body: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#303338',
        marginBottom: 6,
    },
    input: {
        backgroundColor: '#F8F7F5',
        borderWidth: 1,
        borderColor: '#DDD',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 15,
        color: '#303338',
        marginBottom: 12,
    },
    errorText: {
        color: '#D9383A',
        fontSize: 13,
        marginBottom: 6,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    confirmButton: {
        backgroundColor: '#F07342',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    confirmButtonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 15,
    },
});