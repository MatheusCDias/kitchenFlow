import { useEffect, useState } from 'react';
import { Order } from '../models/Order';

interface Countdown {
    secondsLeft: number;
    isOverdue: boolean;
}

// Faz o componente re-renderizar a cada segundo pra ler o tempo restante do pedido.
// Depois que o pedido é concluído (order.getCompletedAt() preenchido), para de
// re-renderizar e passa a calcular sempre a partir do instante da conclusão —
// ou seja, o número congela, mostrando com quanto tempo sobrou (ou atrasou).
export const useCountdown = (order: Order | null): Countdown => {
    const [, tick] = useState(0);
    const completedAt = order?.getCompletedAt();

    useEffect(() => {
        if (!order || completedAt) return;
        const interval = setInterval(() => tick(value => value + 1), 1000);
        return () => clearInterval(interval);
    }, [order, completedAt]);

    if (!order) {
        return { secondsLeft: 0, isOverdue: false };
    }

    const referenceMoment = completedAt ?? new Date();
    const secondsLeft = Math.ceil((order.getKitchenDeadline().getTime() - referenceMoment.getTime()) / 1000);
    return { secondsLeft, isOverdue: secondsLeft < 0 };
};

// Mesmo padrão MM:SS (com prefixo "+" quando estoura) já usado na Área de Trabalho.
export const formatCountdown = (totalSeconds: number): string => {
    const isOverdue = totalSeconds < 0;
    const absSeconds = Math.abs(totalSeconds);
    const minutes = Math.floor(absSeconds / 60);
    const seconds = absSeconds % 60;
    const paddedMinutes = String(minutes).padStart(2, '0');
    const paddedSeconds = String(seconds).padStart(2, '0');
    return isOverdue ? `+${paddedMinutes}:${paddedSeconds}` : `${paddedMinutes}:${paddedSeconds}`;
};
