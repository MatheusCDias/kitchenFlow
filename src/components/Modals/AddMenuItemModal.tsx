import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { addMenuItem } from '../../services/MenuService';
import { styles } from './Modal.styles';

interface AddMenuItemModalProps {
    visible: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export const AddMenuItemModal: React.FC<AddMenuItemModalProps> = ({
    visible,
    onClose,
    onSuccess,
}) => {
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [price, setPrice] = useState('');

    const handleSave = () => {
        if (!name.trim()) return;

        addMenuItem({
            name,
            category,
            price: parseFloat(price.replace(',', '.')) || 0,
        });

        setName('');
        setCategory('');
        setPrice('');

        if (onSuccess) onSuccess();
        onClose();
    };

    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
            <View style={styles.overlay}>
                <View style={styles.card}>
                    <Text style={styles.title}>Adicionar Item ao Cardápio</Text>

                    <Text style={styles.label}>Nome do Item</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Ex: Hambúrguer Artesanal"
                        placeholderTextColor="#A09C9D"
                        value={name}
                        onChangeText={setName}
                    />

                    <Text style={styles.label}>Categoria</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Ex: Lanches, Bebidas, Sobremesas"
                        placeholderTextColor="#A09C9D"
                        value={category}
                        onChangeText={setCategory}
                    />

                    <Text style={styles.label}>Preço (R$)</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Ex: 25.90"
                        placeholderTextColor="#A09C9D"
                        keyboardType="decimal-pad"
                        value={price}
                        onChangeText={setPrice}
                    />

                    <View style={styles.actions}>
                        <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
                            <Text style={styles.cancelText}>Cancelar</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                            <Text style={styles.saveText}>Adicionar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};