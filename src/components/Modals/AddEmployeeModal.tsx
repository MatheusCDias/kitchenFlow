import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { addEmployee } from '../../services/EmployeeService';
import { styles } from './Modal.styles';

interface AddEmployeeModalProps {
    visible: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export const AddEmployeeModal: React.FC<AddEmployeeModalProps> = ({
    visible,
    onClose,
    onSuccess,
}) => {
    const [name, setName] = useState('');
    const [role, setRole] = useState<'recepcao' | 'cozinha'>('cozinha');
    const [shift, setShift] = useState('Manhã');

    const handleSave = () => {
        if (!name.trim()) return;

        addEmployee({ name, role, shift });

        setName('');
        setRole('cozinha');
        setShift('Manhã');

        if (onSuccess) onSuccess();
        onClose();
    };

    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
            <View style={styles.overlay}>
                <View style={styles.card}>
                    <Text style={styles.title}>Adicionar Funcionário</Text>

                    <Text style={styles.label}>Nome Completo</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Nome do funcionário"
                        placeholderTextColor="#A09C9D"
                        value={name}
                        onChangeText={setName}
                    />

                    <Text style={styles.label}>Setor / Bancada</Text>
                    <View style={styles.row}>
                        <TouchableOpacity
                            style={[styles.roleChip, role === 'cozinha' && styles.activeChip]}
                            onPress={() => setRole('cozinha')}
                        >
                            <Text style={[styles.chipText, role === 'cozinha' && styles.activeChipText]}>
                                Cozinha
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.roleChip, role === 'recepcao' && styles.activeChip]}
                            onPress={() => setRole('recepcao')}
                        >
                            <Text style={[styles.chipText, role === 'recepcao' && styles.activeChipText]}>
                                Recepção
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.label}>Turno</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Ex: Manhã, Tarde, Noite"
                        placeholderTextColor="#A09C9D"
                        value={shift}
                        onChangeText={setShift}
                    />

                    <View style={styles.actions}>
                        <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
                            <Text style={styles.cancelText}>Cancelar</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                            <Text style={styles.saveText}>Cadastrar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};