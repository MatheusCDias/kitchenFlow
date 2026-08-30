import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { TicketCard } from '../TicketCard/TicketCard';
import { Order } from '../../models/Order';
import { styles } from './ActiveWorkspace.styles';
import { CheckeredBorder } from '../Patterns/CheckeredBorder';
import Icon from '../Icon'

interface ActiveWorkspaceProps {
    order: Order | null;
    onCompleteOrder: (order: Order) => void;
    onCancelOrder: (order: Order) => void;
}

type ViewMode = 'recepcao' | 'cozinha';

export const ActiveWorkspace: React.FC<ActiveWorkspaceProps> = ({
    order,
    onCompleteOrder,
    onCancelOrder,
}) => {
    const [selectedItemIndex, setSelectedItemIndex] = useState<number>(0);
    const [activeMode, setActiveMode] = useState<ViewMode>('cozinha');
    const [secondsLeft, setSecondsLeft] = useState<number>(0);

    // Efeito para contagem regressiva do timer
    useEffect(() => {
        setSelectedItemIndex(0);

        if (!order) {
            setSecondsLeft(0);
            return;
        }

        const calculateSecondsLeft = () => {
            const deadlineMs = order.getKitchenDeadline().getTime();
            const nowMs = Date.now();
            // Diferença real em segundos (pode ser negativa se agora > deadline)
            return Math.ceil((deadlineMs - nowMs) / 1000);
        };

        setSecondsLeft(calculateSecondsLeft());

        const intervalId = setInterval(() => {
            setSecondsLeft(calculateSecondsLeft());
        }, 1000);

        return () => clearInterval(intervalId);
    }, [order?.getId()]);

    // Função utilitária para formatar segundos no padrão MM:SS
    const formatTime = (totalSeconds: number): string => {
        const isOverdue = totalSeconds < 0;
        const absSeconds = Math.abs(totalSeconds);

        const minutes = Math.floor(absSeconds / 60);
        const seconds = absSeconds % 60;

        const paddedMinutes = String(minutes).padStart(2, '0');
        const paddedSeconds = String(seconds).padStart(2, '0');

        // Adiciona o prefixo '+' quando o tempo estoura (ex: +00:01)
        return isOverdue ? `+${paddedMinutes}:${paddedSeconds}` : `${paddedMinutes}:${paddedSeconds}`;
    };

    // 1. Ref para a animação da opacidade do texto
    const fadeAnim = useRef(new Animated.Value(1)).current;

    const isOverdue = secondsLeft < 0;

    // 2. Efeito para controlar o piscar suave quando o tempo estourar
    useEffect(() => {
        if (isOverdue) {
            const animation = Animated.loop(
                Animated.sequence([
                    Animated.timing(fadeAnim, {
                        toValue: 0.3, // Opacidade mínima (quase invisível)
                        duration: 800, // Duração do fade out (ms)
                        useNativeDriver: true,
                    }),
                    Animated.timing(fadeAnim, {
                        toValue: 1, // Voltar para total visibilidade
                        duration: 700, // Duração do fade in (ms)
                        useNativeDriver: true,
                    }),
                ])
            );

            animation.start();

            return () => animation.stop();
        } else {
            fadeAnim.setValue(1); // Reseta opacidade normal se o tempo não estiver estourado
        }
    }, [isOverdue]);

    // Cálculos dos dados da receita (só são processados se houver um order)
    const items = order ? order.getItems() : [];
    const selectedItem = items[selectedItemIndex] || items[0];
    const recipe = selectedItem?.getRecipe();

    return (
        <View style={styles.container}>

            {!order ? (
                /* Estado Vazio */
                <View style={styles.emptyContent}>
                    <Icon name="chef_hat" size={48} color='#EAE8E5' fill={false} />
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
                                <Icon name="timelapse" color="#EAE8E5" size={32} />
                                <Animated.Text
                                    style={[
                                        styles.timerText,
                                        isOverdue && {
                                            color: '#EAE8E5',
                                            opacity: fadeAnim
                                        }
                                    ]}
                                >
                                    {formatTime(secondsLeft)}
                                </Animated.Text>
                            </View>
                            <View style={styles.buttonArea}>
                                <TouchableOpacity
                                    style={styles.button}
                                    activeOpacity={0.8}
                                    onPress={() => onCancelOrder(order)}
                                >
                                    <Text style={[styles.buttonText, { color: '#ED4545' }]}>Cancelar</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.button}
                                    activeOpacity={0.8}
                                    onPress={() => onCompleteOrder(order)}
                                >
                                    <Text style={[styles.buttonText, { color: '#3EB26A' }]}>Concluir</Text>
                                </TouchableOpacity>

                            </View>

                        </View>
                    </View>
                </View>
            )}

            {/* Borda no rodapé da seção */}
            <CheckeredBorder />
        </View>
    );
};