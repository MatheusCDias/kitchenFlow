import React, { useMemo, useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { styles } from './NewOrderForm.styles';
import { NewOrderInput, NewOrderItemInput, MenuItemPayload, ApiError } from '../../services/api';
import { useMenu } from '../../hooks/useMenu';

interface NewOrderFormProps {
    onCreateOrder: (input: NewOrderInput) => Promise<unknown>;
}

const DEADLINE_PRESETS = [10, 20, 30];
const MAX_SUGGESTIONS = 6;

// Sem acento/maiúsculas, pra "camarao" achar "Camarão".
const DIACRITICS_PATTERN = new RegExp('[̀-ͯ]', 'g');
const normalize = (text: string): string =>
    text.normalize('NFD').replace(DIACRITICS_PATTERN, '').toLowerCase();

export const NewOrderForm: React.FC<NewOrderFormProps> = ({ onCreateOrder }) => {
    const menu = useMenu();

    const [tableNumber, setTableNumber] = useState('');
    const [deadlineMinutes, setDeadlineMinutes] = useState('20');

    const [itemName, setItemName] = useState('');
    const [itemQuantity, setItemQuantity] = useState('1');
    const [itemNotes, setItemNotes] = useState('');
    const [items, setItems] = useState<NewOrderItemInput[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const suggestions = useMemo<MenuItemPayload[]>(() => {
        const query = normalize(itemName.trim());
        if (!query) return [];
        return menu.filter(item => normalize(item.name).includes(query)).slice(0, MAX_SUGGESTIONS);
    }, [menu, itemName]);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const handleAddItem = () => {
        if (!itemName.trim()) return;
        setItems(current => [
            ...current,
            {
                productName: itemName.trim(),
                quantity: Number(itemQuantity) || 1,
                notes: itemNotes.trim() || undefined,
            },
        ]);
        setItemName('');
        setItemQuantity('1');
        setItemNotes('');
        setShowSuggestions(false);
    };

    const handleRemoveItem = (index: number) => {
        setItems(current => current.filter((_, i) => i !== index));
    };

    const deadlineMinutesNumber = Number(deadlineMinutes);
    const isDeadlineValid = deadlineMinutesNumber > 0;

    const handleSubmit = async () => {
        setErrorMessage(null);
        setSuccessMessage(null);
        setIsSubmitting(true);
        try {
            const created = await onCreateOrder({
                items,
                deadlineMinutes: deadlineMinutesNumber,
                tableNumber: tableNumber.trim() ? Number(tableNumber) : undefined,
            });
            const orderCode = (created as { orderCode?: number })?.orderCode;
            setSuccessMessage(orderCode ? `Pedido #${orderCode} criado!` : 'Pedido criado!');
            setItems([]);
            setTableNumber('');
        } catch (err) {
            setErrorMessage(err instanceof ApiError ? err.message : 'Não foi possível criar o pedido.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={{ gap: 16 }}>
            <View style={styles.fieldGroup}>
                <Text style={styles.label}>Mesa (opcional)</Text>
                <TextInput
                    style={styles.input}
                    value={tableNumber}
                    onChangeText={setTableNumber}
                    placeholder="Ex: 5"
                    placeholderTextColor="#999"
                    keyboardType="number-pad"
                />
            </View>

            <View style={styles.fieldGroup}>
                <Text style={styles.label}>Prazo de preparo (minutos)</Text>
                <TextInput
                    style={styles.input}
                    value={deadlineMinutes}
                    onChangeText={setDeadlineMinutes}
                    placeholder="Ex: 15"
                    placeholderTextColor="#999"
                    keyboardType="number-pad"
                />
                <View style={styles.presetsRow}>
                    {DEADLINE_PRESETS.map(minutes => (
                        <TouchableOpacity
                            key={minutes}
                            style={[
                                styles.presetButton,
                                deadlineMinutesNumber === minutes && styles.presetButtonActive,
                            ]}
                            onPress={() => setDeadlineMinutes(String(minutes))}
                        >
                            <Text
                                style={[
                                    styles.presetButtonText,
                                    deadlineMinutesNumber === minutes && styles.presetButtonTextActive,
                                ]}
                            >
                                {minutes} min
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            <View style={styles.fieldGroup}>
                <Text style={styles.label}>Adicionar item</Text>
                <TextInput
                    style={styles.input}
                    value={itemName}
                    onChangeText={text => {
                        setItemName(text);
                        setShowSuggestions(true);
                    }}
                    placeholder="Nome do item (comece a digitar pra ver o cardápio)"
                    placeholderTextColor="#999"
                />
                {showSuggestions && suggestions.length > 0 && (
                    <View style={styles.suggestionsBox}>
                        {suggestions.map(item => (
                            <TouchableOpacity
                                key={item.id}
                                style={styles.suggestionRow}
                                onPress={() => {
                                    setItemName(item.name);
                                    setShowSuggestions(false);
                                }}
                            >
                                <Text style={styles.suggestionText}>{item.name}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}
                <View style={styles.row}>
                    <TextInput
                        style={[styles.input, { width: 72 }]}
                        value={itemQuantity}
                        onChangeText={setItemQuantity}
                        keyboardType="number-pad"
                    />
                    <TextInput
                        style={[styles.input, styles.rowItem]}
                        value={itemNotes}
                        onChangeText={setItemNotes}
                        placeholder="Observação (opcional)"
                        placeholderTextColor="#999"
                    />
                </View>
                <TouchableOpacity style={styles.addItemButton} onPress={handleAddItem}>
                    <Text style={styles.addItemButtonText}>+ Adicionar item</Text>
                </TouchableOpacity>
            </View>

            {items.length > 0 && (
                <View style={styles.itemsList}>
                    {items.map((item, index) => (
                        <View key={`${item.productName}-${index}`} style={styles.itemRow}>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.itemRowText}>
                                    {item.quantity}x {item.productName}
                                </Text>
                                {item.notes ? <Text style={styles.itemRowNotes}>{item.notes}</Text> : null}
                            </View>
                            <TouchableOpacity onPress={() => handleRemoveItem(index)}>
                                <MaterialIcons name="close" size={20} color="#EAE8E5" />
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>
            )}

            {errorMessage ? <Text style={styles.feedbackError}>{errorMessage}</Text> : null}
            {successMessage ? <Text style={styles.feedbackSuccess}>{successMessage}</Text> : null}

            <TouchableOpacity
                style={[
                    styles.submitButton,
                    (items.length === 0 || !isDeadlineValid || isSubmitting) && styles.submitButtonDisabled,
                ]}
                disabled={items.length === 0 || !isDeadlineValid || isSubmitting}
                onPress={handleSubmit}
            >
                <Text style={styles.submitButtonText}>{isSubmitting ? 'Criando...' : 'Criar Pedido'}</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};
