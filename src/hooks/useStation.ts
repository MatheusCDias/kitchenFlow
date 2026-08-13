import { useCallback, useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { SERVER_URL } from '../services/config';

interface UseStationResult {
    stationNumber: number | null;
    occupiedStations: number[];
    isConnecting: boolean;
    selectStation: (stationNumber: number) => Promise<boolean>;
}

// A bancada não fica salva em lugar nenhum: ela é "quem está segurando
// essa conexão de WebSocket agora". Fechar a aba derruba a conexão e o
// servidor libera a bancada sozinho (ver socket.on('disconnect') no server).
export const useStation = (): UseStationResult => {
    const socketRef = useRef<Socket | null>(null);
    const [stationNumber, setStationNumber] = useState<number | null>(null);
    const [occupiedStations, setOccupiedStations] = useState<number[]>([]);
    const [isConnecting, setIsConnecting] = useState(true);

    useEffect(() => {
        const socket = io(SERVER_URL);
        socketRef.current = socket;

        socket.on('connect', () => setIsConnecting(false));
        socket.on('stations:update', (stations: number[]) => setOccupiedStations(stations));

        return () => {
            socket.disconnect();
        };
    }, []);

    const selectStation = useCallback((selected: number): Promise<boolean> => {
        return new Promise(resolve => {
            const socket = socketRef.current;
            if (!socket) {
                resolve(false);
                return;
            }
            socket.emit('station:claim', selected, (ok: boolean) => {
                if (ok) setStationNumber(selected);
                resolve(ok);
            });
        });
    }, []);

    return { stationNumber, occupiedStations, isConnecting, selectStation };
};
