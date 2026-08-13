import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { TicketCard } from '../TicketCard/TicketCard';
import { Order } from '../../models/Order';
import { styles } from './ActiveWorkspace.styles';
import { CheckeredBorder } from '../Patterns/CheckeredBorder';
import { useCountdown, formatCountdown } from '../../hooks/useCountdown';

interface ActiveWorkspaceProps {
    order: Order | null;
    onCompleteOrder: (order: Order) => void;
    onReleaseOrder: (order: Order) => void;
    onDeleteOrder: (order: Order) => void;
}

export const ActiveWorkspace: React.FC<ActiveWorkspaceProps> = ({
    order,
    onCompleteOrder,
    onReleaseOrder,
    onDeleteOrder,
}) => {
    const [selectedItemIndex, setSelectedItemIndex] = useState<number>(0);
    const [confirmingDelete, setConfirmingDelete] = useState(false);

    // Cálculos dos dados da receita (só são processados se houver um order)
    const items = order ? order.getItems() : [];
    const selectedItem = items[selectedItemIndex] || items[0];
    const recipe = selectedItem?.getRecipe();
    const { remainingSeconds, isLate } = useCountdown(order);

    return (
        <View style={styles.container}>
            <View style={styles.workspaceHeader}>
                <Text style={styles.headerTitle}>Área de Trabalho</Text>
            </View>

            {!order ? (
                /* Estado Vazio */
                <View style={styles.emptyContent}>
                    <MaterialIcons name="restaurant" size={48} color="#FFF" />
                    <Text style={styles.emptyTitle}>Nenhum pedido em preparo no momento</Text>
                    <Text style={styles.emptySubtitle}>
                        Selecione um pedido na lista abaixo para começar a cozinhar!
                    </Text>
                </View>
            ) : (
                /* Conteúdo do Pedido Ativo */
                <View style={styles.orderContainer}>
                    <View style={styles.ticketWrapper}>
                        <TicketCard
                            order={order}
                            selectedItemIndex={selectedItemIndex}
                            onItemPress={(index) => setSelectedItemIndex(index)}
                        />
                    </View>

                    {/* Detalhes do Pedido e Receita */}
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
                                <MaterialIcons name="timelapse" size={28} color={isLate ? '#FFD9D9' : '#FFF'} />
                                <Text style={[styles.timerText, isLate && styles.lateTimerText]}>
                                    {formatCountdown(remainingSeconds)}
                                </Text>
                            </View>

                            {confirmingDelete ? (
                                <View style={styles.actionsRow}>
                                    <Text style={styles.confirmText}>Excluir esse pedido?</Text>
                                    <TouchableOpacity
                                        style={styles.dangerButton}
                                        activeOpacity={0.8}
                                        onPress={() => {
                                            setConfirmingDelete(false);
                                            onDeleteOrder(order);
                                        }}
                                    >
                                        <Text style={styles.dangerButtonText}>Sim, excluir</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={styles.secondaryButton}
                                        activeOpacity={0.8}
                                        onPress={() => setConfirmingDelete(false)}
                                    >
                                        <Text style={styles.secondaryButtonText}>Cancelar</Text>
                                    </TouchableOpacity>
                                </View>
                            ) : (
                                <View style={styles.actionsRow}>
                                    <TouchableOpacity
                                        style={styles.secondaryButton}
                                        activeOpacity={0.8}
                                        onPress={() => setConfirmingDelete(true)}
                                    >
                                        <Text style={styles.secondaryButtonText}>Excluir</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={styles.secondaryButton}
                                        activeOpacity={0.8}
                                        onPress={() => onReleaseOrder(order)}
                                    >
                                        <Text style={styles.secondaryButtonText}>Desistir</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={styles.completeButton}
                                        activeOpacity={0.8}
                                        onPress={() => onCompleteOrder(order)}
                                    >
                                        <Text style={styles.completeButtonText}>Concluir</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
                    </View>
                </View>
            )}

            {/* Borda no rodapé da seção */}
            <CheckeredBorder />
        </View>
    );
};
