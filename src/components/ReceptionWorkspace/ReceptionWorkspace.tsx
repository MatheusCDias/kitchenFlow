import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { OrderTicketPreview, OrderItem } from '../OrderTicketPreview/OrderTicketPreview';
import { styles } from './ReceptionWorkspace.styles';
import { CheckeredBorder } from '../Patterns/CheckeredBorder';
import Icon from '../Icon';

export const ReceptionWorkspace = () => {
    // Campos do Pedido
    const [table, setTable] = useState('');
    const [prepTime, setPrepTime] = useState('');
    const [generalObs, setGeneralObs] = useState('');
    const [items, setItems] = useState<OrderItem[]>([]);

    // Campos do Formulário de Item
    const [itemQuantity, setItemQuantity] = useState('1');
    const [itemName, setItemName] = useState('');
    const [itemObs, setItemObs] = useState('');

    // Estado para saber qual item está sendo editado (null = criando novo)
    const [editingItemId, setEditingItemId] = useState<string | null>(null);

    // Quando clica num item do ticket para editar
    const handleSelectItemToEdit = (item: OrderItem) => {
        setEditingItemId(item.id);
        setItemQuantity(String(item.quantity));
        setItemName(item.name);
        setItemObs(item.observation || '');
    };

    // Limpa o formulário de itens e sai do modo edição
    const resetItemForm = () => {
        setEditingItemId(null);
        setItemQuantity('1');
        setItemName('');
        setItemObs('');
    };

    // Adiciona ou Salva Alteração
    const handleSaveItem = () => {
        if (!itemName.trim()) return;

        if (editingItemId) {
            // Atualizando um item existente
            setItems((prev) =>
                prev.map((item) =>
                    item.id === editingItemId
                        ? {
                            ...item,
                            quantity: Number(itemQuantity) || 1,
                            name: itemName,
                            observation: itemObs,
                        }
                        : item
                )
            );
        } else {
            // Criando um novo item
            const newItem: OrderItem = {
                id: Date.now().toString(),
                quantity: Number(itemQuantity) || 1,
                name: itemName,
                observation: itemObs,
            };
            setItems((prev) => [...prev, newItem]);
        }

        resetItemForm();
    };

    // Exclui o item em edição
    const handleDeleteItem = () => {
        if (!editingItemId) return;
        setItems((prev) => prev.filter((item) => item.id !== editingItemId));
        resetItemForm();
    };

    // Função helper para aceitar APENAS dígitos de 0 a 9
    const handleNumericInput = (text: string, setter: (val: string) => void) => {
        const cleanedText = text.replace(/[^0-9]/g, ''); // Remove tudo que não for número
        setter(cleanedText);
    };

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.sectionTitle}>Novo Pedido</Text>
                <View style={styles.sectionContent}>
                    {/* Lado Esquerdo: Ticket Preview */}
                    <View style={styles.ticketSection}>
                        <OrderTicketPreview
                            orderNumber="101"
                            table={table}
                            items={items}
                            generalObs={generalObs}
                            prepTime={prepTime}
                            onSelectItem={handleSelectItemToEdit}
                        />
                    </View>

                    {/* Lado Direito: Formulário */}
                    <View style={styles.formContainer}>
                        {/* Mesa */}
                        <Text style={styles.label}>Mesa</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Ex: 5"
                            placeholderTextColor="#A09C9D"
                            value={table}
                            onChangeText={setTable}
                        />

                        {/* Adicionar / Editar Item */}
                        <Text style={styles.label}>
                            {editingItemId ? 'Editar item' : 'Adicionar item'}
                        </Text>
                        <View style={styles.row}>
                            <TextInput
                                style={[styles.input, styles.qtyInput]}
                                placeholder="000"
                                placeholderTextColor="#A09C9D"
                                keyboardType="number-pad" // Força teclado numérico no mobile
                                value={itemQuantity}
                                onChangeText={(text) => handleNumericInput(text, setItemQuantity)}
                            />
                            <TextInput
                                style={[styles.input, styles.flexInput]}
                                placeholder="Nome do item"
                                placeholderTextColor="#A09C9D"
                                value={itemName}
                                onChangeText={setItemName}
                            />
                        </View>

                        <View style={styles.row}>
                            <TextInput
                                style={[styles.input, styles.flexInput]}
                                placeholder="Observação (Opcional)"
                                placeholderTextColor="#A09C9D"
                                value={itemObs}
                                onChangeText={setItemObs}
                            />

                            {/* Botoes de Ação do Item (Condicionais) */}
                            {editingItemId ? (
                                <>
                                    <TouchableOpacity
                                        style={[styles.addButton, { backgroundColor: '#E53935' }]}
                                        onPress={handleDeleteItem}
                                    >
                                        <Icon name="delete" size={16} color="#EAE8E5" />
                                    </TouchableOpacity>

                                    <TouchableOpacity style={[styles.addButton, { backgroundColor: '#3EB26A' }]} onPress={handleSaveItem}>
                                        <Icon name="check" size={16} color="#EAE8E5" />
                                    </TouchableOpacity>
                                </>
                            ) : (
                                <TouchableOpacity style={styles.addButton} onPress={handleSaveItem}>
                                    <Icon name="add" size={16} color="#EAE8E5" />
                                    <Text style={styles.addButtonText}>Adicionar item</Text>
                                </TouchableOpacity>
                            )}
                        </View>

                        {/* Prazo e Obs Geral */}
                        <View style={styles.row}>
                            <View style={styles.flexInput}>
                                <Text style={styles.label}>Prazo de Preparo</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="(Em minutos)"
                                    placeholderTextColor="#A09C9D"
                                    keyboardType="number-pad" // Força teclado numérico no mobile
                                    value={prepTime}
                                    onChangeText={(text) => handleNumericInput(text, setPrepTime)}
                                />
                            </View>

                            <View style={styles.flexInput}>
                                <Text style={styles.label}>Observação Geral</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="(Opcional)"
                                    placeholderTextColor="#A09C9D"
                                    value={generalObs}
                                    onChangeText={setGeneralObs}
                                />
                            </View>
                        </View>

                        {/* Submit do Pedido */}
                        <TouchableOpacity style={styles.submitButton}>
                            <Text style={styles.submitButtonText}>Criar Pedido</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            <CheckeredBorder />
        </View>
    );
};