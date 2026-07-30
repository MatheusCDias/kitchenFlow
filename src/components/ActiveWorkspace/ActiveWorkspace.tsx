import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { TicketCard } from '../TicketCard/TicketCard';
import { Order } from '../../models/Order';
import { styles } from './ActiveWorkspace.styles';
import { CheckeredBorder } from '../Patterns/CheckeredBorder';

interface ActiveWorkspaceProps {
    order: Order | null;
    onCompleteOrder: (order: Order) => void;
}

type ViewMode = 'recepcao' | 'cozinha';

export const ActiveWorkspace: React.FC<ActiveWorkspaceProps> = ({
    order,
    onCompleteOrder,
}) => {
    const [selectedItemIndex, setSelectedItemIndex] = useState<number>(0);

    const [activeMode, setActiveMode] = useState<ViewMode>('cozinha');

    if (!order) {
        return (
            <View style={styles.emptyContainer}>
                <View style={styles.emptyContent}>
                    <MaterialIcons name="restaurant" size={48} color="#FFF" />
                    <Text style={styles.emptyTitle}>Nenhum pedido em preparo no momento</Text>
                    <Text style={styles.emptySubtitle}>
                        Selecione um pedido na lista abaixo para começar a cozinhar!
                    </Text>
                </View>
                <CheckeredBorder />
            </View>
        );
    }

    const items = order.getItems();
    const selectedItem = items[selectedItemIndex] || items[0];
    const recipe = selectedItem?.getRecipe();

    return (
        <View style={styles.container}>
            <View style={styles.workspaceHeader}>
                {/* Título à esquerda */}
                <Text style={styles.headerTitle}>Área de Trabalho</Text>

                {/* Chaveador à direita */}
                <View style={styles.toggleContainer}>
                    {/* Botão Recepção */}
                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={[
                            styles.toggleButton,
                            activeMode === 'recepcao' ? styles.activeToggleButton : styles.inactiveToggleButton,
                        ]}
                        onPress={() => setActiveMode('recepcao')}
                    >
                        <MaterialIcons
                            name="desktop-windows"
                            size={16}
                            color={activeMode === 'recepcao' ? '#333' : '#FFF'}
                        />
                        <Text
                            style={[
                                styles.toggleText,
                                activeMode === 'recepcao' ? styles.activeToggleText : styles.inactiveToggleText,
                            ]}
                        >
                            Recepção
                        </Text>
                    </TouchableOpacity>

                    {/* Botão Cozinha */}
                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={[
                            styles.toggleButton,
                            activeMode === 'cozinha' ? styles.activeToggleButton : styles.inactiveToggleButton,
                        ]}
                        onPress={() => setActiveMode('cozinha')}
                    >
                        <MaterialIcons
                            name="restaurant"
                            size={16}
                            color={activeMode === 'cozinha' ? '#333' : '#FFF'}
                        />
                        <Text
                            style={[
                                styles.toggleText,
                                activeMode === 'cozinha' ? styles.activeToggleText : styles.inactiveToggleText,
                            ]}
                        >
                            Cozinha
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.orderContainer}>
                <View style={styles.ticketWrapper}>
                    <TicketCard
                        order={order}
                        selectedItemIndex={selectedItemIndex}
                        onItemPress={(index) => setSelectedItemIndex(index)}
                    />
                </View>
                {/* Detalhes do Pedido e Receita */}
                {/*
                <View style={styles.detailsContainer}>
                    <View style={styles.recipeHeader}>
                        <Text style={styles.recipeTitleLabel}>Receita</Text>
                        <Text style={styles.selectedItemName}>{selectedItem?.getProductName()}</Text>
                    </View>

                    <View style={styles.recipeContent}>
                        {recipe ? (
                            <>
                                <Text style={styles.sectionSubTitle}>Ingredientes:</Text>
                                {recipe.getIngredients().map((ing) => (
                                    <View key={ing.getId()} style={styles.ingredientRow}>
                                        <Text style={styles.ingredientText}>
                                            • {ing.getProductName()} ({ing.getRecipeQuantity()} {ing.getUnitOfMeasure()})
                                        </Text>
                                    </View>
                                ))}

                                <Text style={[styles.sectionSubTitle, { marginTop: 12 }]}>Preparo:</Text>
                                <Text style={styles.instructionsText}>
                                    {recipe.getPrepInstructions()}
                                </Text>
                            </>
                        ) : (
                            <Text style={styles.noRecipeText}>
                                Este item não possui uma receita detalhada cadastrada.
                            </Text>
                        )}
                    </View>

                    <View style={styles.footer}>
                        <View style={styles.timerBox}>
                            <MaterialIcons name="access-time" size={28} color="#FFF" />
                            <Text style={styles.timerText}>04:59</Text>
                        </View>

                        <TouchableOpacity
                            style={styles.completeButton}
                            activeOpacity={0.8}
                            onPress={() => onCompleteOrder(order)}
                        >
                            <Text style={styles.completeButtonText}>Concluir</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                */}
            </View>
            <CheckeredBorder />
        </View>
    );
};