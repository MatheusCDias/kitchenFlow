import { useEffect, useState } from 'react';
import { Order } from '../models/Order';

interface Countdown {
    remainingSeconds: number;
    isLate: boolean;
}

// Faz o componente re-renderizar a cada segundo pra ler o tempo restante do pedido.
export const useCountdown = (order: Order | null): Countdown => {
    const [, tick] = useState(0);

    useEffect(() => {
        if (!order) return;
        const interval = setInterval(() => tick((value) => value + 1), 1000);
        return () => clearInterval(interval);
    }, [order]);

    if (!order) {
        return { remainingSeconds: 0, isLate: false };
    }

    return {
        remainingSeconds: order.getRemainingSeconds(),
        isLate: order.isLate(),
    };
};

export const formatCountdown = (totalSeconds: number): string => {
    const sign = totalSeconds < 0 ? '-' : '';
    const absSeconds = Math.abs(totalSeconds);
    const minutes = Math.floor(absSeconds / 60);
    const seconds = absSeconds % 60;
    return `${sign}${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};
