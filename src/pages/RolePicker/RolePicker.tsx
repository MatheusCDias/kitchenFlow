import React, { useState } from 'react';
import { Text, TouchableOpacity, View, TextInput, StyleSheet } from 'react-native';
import Icon from '../../components/Icon';
import { styles } from '../RolePicker/RolePicker.styles';
import { CheckeredBorder } from '../../components/Patterns/CheckeredBorder';
import { Employee } from '../../models/employee/Employee';
import { Admin } from '../../models/employee/Admin';

export type Role = 'recepcao' | 'cozinha';

interface RolePickerProps {
    onSelect: (role: Role, user?: Employee) => void;
}

const ADMIN_USER = new Admin('admin-01', 'Admin', 'Integral');

export const RolePicker: React.FC<RolePickerProps> = ({ onSelect }) => {
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSelectRole = (role: Role) => {
        setSelectedRole(role);
    };

    const handleOpenAdminAuth = () => {
        setShowPasswordModal(true);
        setPassword('');
        setError('');
    };

    const handleConfirmPassword = () => {
        if (password === 'admin') {
            if (selectedRole) {
                onSelect(selectedRole, ADMIN_USER);
            }
        } else {
            setError('Senha incorreta!');
        }
    };

    const handleBackToAccounts = () => {
        setShowPasswordModal(false);
        setPassword('');
        setError('');
    };

    const handleBackToRoles = () => {
        setSelectedRole(null);
        setShowPasswordModal(false);
        setPassword('');
        setError('');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Kitchen Flow</Text>
            <View style={styles.content}>
                {!selectedRole ? (
                    // Etapa 1: Seleção de Cargo
                    <>
                        <Text style={styles.optionTitle}>Você é da Recepção ou da Cozinha?</Text>

                        <View style={styles.optionsRow}>
                            <TouchableOpacity
                                style={styles.option}
                                activeOpacity={0.8}
                                onPress={() => handleSelectRole('recepcao')}
                            >
                                <Icon name="desktop_windows" size={32} color="#F07342" />
                                <Text style={styles.optionText}>Recepção</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.option}
                                activeOpacity={0.8}
                                onPress={() => handleSelectRole('cozinha')}
                            >
                                <Icon name="restaurant" size={32} color="#F07342" />
                                <Text style={styles.optionText}>Cozinha</Text>
                            </TouchableOpacity>
                        </View>
                    </>
                ) : !showPasswordModal ? (
                    // Etapa 2: Seleção de Conta
                    <>
                        <Text style={styles.optionTitle}>
                            Selecione sua conta ({selectedRole === 'recepcao' ? 'Recepção' : 'Cozinha'}):
                        </Text>

                        <View style={styles.optionsRow}>
                            <TouchableOpacity
                                style={styles.option}
                                activeOpacity={0.8}
                                onPress={handleOpenAdminAuth}
                            >
                                <Icon name="admin_panel_settings" size={32} color="#F07342" />
                                <Text style={styles.optionText}>Admin</Text>
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity
                            style={styles.Button}
                            activeOpacity={0.7}
                            onPress={handleBackToRoles}
                        >
                            <Text style={styles.ButtonText}>Voltar para seleção de cargo</Text>
                        </TouchableOpacity>
                    </>
                ) : (
                    // Etapa 3: Autenticação da Senha do Admin
                    <View style={styles.authContainer}>
                        <Text style={styles.optionTitle}>Digite a senha do Admin</Text>

                        <TextInput
                            style={styles.input}
                            secureTextEntry
                            value={password}
                            onChangeText={(text) => {
                                setPassword(text);
                                if (error) setError('');
                            }}
                            placeholder="Senha"
                            placeholderTextColor="#999"
                            autoCapitalize="none"
                        />

                        {error ? <Text style={styles.errorText}>{error}</Text> : null}

                        <View
                            style={{ flexDirection: 'row', gap: 24 }}>
                            <TouchableOpacity
                                style={styles.Button}
                                activeOpacity={0.7}
                                onPress={handleBackToAccounts}
                            >
                                <Text style={styles.ButtonText}>Voltar</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.Button}
                                activeOpacity={0.8}
                                onPress={handleConfirmPassword}
                            >
                                <Text style={styles.ButtonText}>Entrar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            </View>
            <CheckeredBorder />
        </View>
    );
};