import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { OrderTicketPreview, OrderItem } from '../OrderTicketPreview/OrderTicketPreview';
import { styles } from './ReceptionWorkspace.styles';
import { CheckeredBorder } from '../Patterns/CheckeredBorder';
import Icon from '../Icon';

export const ReceptionWorkspace = () => {
    const [table, setTable] = useState('');
    const [prepTime, setPrepTime] = useState('');
    const [generalObs, setGeneralObs] = useState('');
    const [items, setItems] = useState<OrderItem[]>([]);

    const [itemQuantity, setItemQuantity] = useState('1');
    const [itemName, setItemName] = useState('');
    const [itemObs, setItemObs] = useState('');

    const handleAddItem = () => {
        if (!itemName.trim()) return;

        const newItem: OrderItem = {
            id: Date.now().toString(),
            quantity: Number(itemQuantity) || 1,
            name: itemName,
            observation: itemObs,
        };

        setItems((prev) => [...prev, newItem]);
        setItemName('');
        setItemObs('');
        setItemQuantity('1');
    };

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.sectionTitle}>Novo Pedido</Text>
                <View style={styles.sectionContent}>
                    <View style={styles.ticketSection}>
                        <OrderTicketPreview
                            orderNumber="101"
                            table={table}
                            items={items}
                            generalObs={generalObs}
                            prepTime={prepTime}
                        />
                    </View>
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

                        {/* Adicionar Item */}
                        <Text style={styles.label}>Adicionar item</Text>
                        <View style={styles.row}>
                            <TextInput
                                style={[styles.input, styles.qtyInput]}
                                placeholder="000"
                                placeholderTextColor="#A09C9D"
                                keyboardType="numeric"
                                value={itemQuantity}
                                onChangeText={setItemQuantity}
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
                            <TouchableOpacity style={styles.addButton} onPress={handleAddItem}>
                                <Icon name="add" size={16} color="#EAE8E5" />
                                <Text style={styles.addButtonText}>Adicionar item</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Prazo e Obs Geral */}
                        <View style={styles.row}>
                            <View style={styles.flexInput}>
                                <Text style={styles.label}>Prazo de Preparo</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="(Em minutos)"
                                    placeholderTextColor="#A09C9D"
                                    keyboardType="numeric"
                                    value={prepTime}
                                    onChangeText={setPrepTime}
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

                        {/* Submit */}
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