import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { TicketCard } from '../TicketCard/TicketCard';
import { Order } from '../../models/Order';
import { styles } from './ActiveWorkspace.styles';
import { CheckeredBorder } from '../Patterns/CheckeredBorder';
import Icon from '../Icon'

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
    const [secondsLeft, setSecondsLeft] = useState<number>(0);

    // Efeito para contagem regressiva do timer baseado no deadline do pedido
    useEffect(() => {
        setSelectedItemIndex(0);

        if (!order) {
            setSecondsLeft(0);
            return;
        }

        const calculateSecondsLeft = () => {
            // Usa o promisedTime do pedido atual
            const deadline = order.getPromisedTime().getTime();
            const now = new Date().getTime();
            const diffInSeconds = Math.floor((deadline - now) / 1000);

            return diffInSeconds > 0 ? diffInSeconds : 0;
        };

        setSecondsLeft(calculateSecondsLeft());

        const intervalId = setInterval(() => {
            const remaining = calculateSecondsLeft();
            setSecondsLeft(remaining);

            if (remaining <= 0) {
                clearInterval(intervalId);
            }
        }, 1000);

        return () => clearInterval(intervalId);
    }, [order?.getId()]); // O ID garante a reinicialização ao trocar de pedido

    // Função utilitária para formatar segundos no padrão MM:SS
    const formatTime = (totalSeconds: number): string => {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        const paddedMinutes = String(minutes).padStart(2, '0');
        const paddedSeconds = String(seconds).padStart(2, '0');
        return `${paddedMinutes}:${paddedSeconds}`;
    };

    // Cálculos dos dados da receita (só são processados se houver um order)
    const items = order ? order.getItems() : [];
    const selectedItem = items[selectedItemIndex] || items[0];
    const recipe = selectedItem?.getRecipe();

    return (
        <View style={styles.container}>
            <View style={styles.workspaceHeader}>
                <Text style={styles.headerTitle}>Área de Trabalho</Text>
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
                        <Icon name="desktop_windows" fill={activeMode === 'recepcao' ? true : false} color={activeMode === 'recepcao' ? '#303338' : '#EAE8E5'} />
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
                        <Icon name="chef_hat" fill={activeMode === 'cozinha' ? true : false} color={activeMode === 'cozinha' ? '#303338' : '#EAE8E5'} />
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

            {!order ? (
                /* Estado Vazio */
                <View style={styles.emptyContent}>
                    <Icon name="chef_hat" />
                    {/* <MaterialIcons name="restaurant" size={48} color="#FFF" /> */}
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
                                <Icon name="timelapse" color='#EAE8E5' size={32} />
                                <Text style={styles.timerText}>{formatTime(secondsLeft)}</Text>
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
                </View>
            )}

            {/* Borda no rodapé da seção */}
            <CheckeredBorder />
        </View>
    );
};