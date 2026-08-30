import React, { useCallback, useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Icon from '../../components/Icon';
import { styles } from '../RolePicker/RolePicker.styles';
import { CheckeredBorder } from '../../components/Patterns/CheckeredBorder';
import { ApiError, claimStationRequest, fetchOccupiedStations } from '../../services/api';

// Quantidade de bancadas físicas da cozinha. Fixo por enquanto — quando
// existir um cadastro de bancadas de verdade, isso vem de outro lugar.
const STATION_COUNT = 4;

// De quanto em quanto tempo verifica quais bancadas outras pessoas já
// pegaram, pra manter a lista de "ocupadas" desta tela atualizada.
const POLL_INTERVAL_MS = 4000;

interface StationPickerProps {
    holderId: string;
    onSelect: (stationNumber: number) => void;
}

export const StationPicker: React.FC<StationPickerProps> = ({ holderId, onSelect }) => {
    const stationNumbers = Array.from({ length: STATION_COUNT }, (_, index) => index + 1);
    const [occupied, setOccupied] = useState<number[]>([]);
    const [claimingNumber, setClaimingNumber] = useState<number | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const refreshOccupied = useCallback(async () => {
        try {
            const data = await fetchOccupiedStations();
            setOccupied(data.occupied);
        } catch {
            // Sem servidor por um instante não deve travar a tela — só tenta de novo no próximo ciclo.
        }
    }, []);

    useEffect(() => {
        refreshOccupied();
        const interval = setInterval(refreshOccupied, POLL_INTERVAL_MS);
        return () => clearInterval(interval);
    }, [refreshOccupied]);

    const handleSelect = async (stationNumber: number) => {
        setErrorMessage(null);
        setClaimingNumber(stationNumber);
        try {
            await claimStationRequest(stationNumber, holderId);
            onSelect(stationNumber);
        } catch (err) {
            setErrorMessage(
                err instanceof ApiError ? err.message : 'Não foi possível pegar essa bancada.',
            );
            refreshOccupied();
        } finally {
            setClaimingNumber(null);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Kitchen Flow</Text>
            <View style={styles.content}>
                <Text style={styles.optionTitle}>Qual bancada você representa?</Text>

                {errorMessage ? (
                    <Text style={{ fontFamily: 'Lexend', fontSize: 14, color: '#EAE8E5' }}>
                        {errorMessage}
                    </Text>
                ) : null}

                <View style={styles.optionsRow}>
                    {stationNumbers.map((number) => {
                        const isOccupied = occupied.includes(number);
                        const isBusy = claimingNumber === number;

                        return (
                            <TouchableOpacity
                                key={number}
                                style={[styles.option, isOccupied && { opacity: 0.4 }]}
                                activeOpacity={0.8}
                                disabled={isOccupied || isBusy}
                                onPress={() => handleSelect(number)}
                            >
                                <Icon name="soup_kitchen" size={32} color="#F07342" />
                                <Text style={styles.optionText}>Bancada {number}</Text>
                                {isOccupied ? (
                                    <Text style={{ fontFamily: 'Lexend', fontSize: 12, color: '#F07342' }}>
                                        Ocupada
                                    </Text>
                                ) : null}
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </View>
            <CheckeredBorder />
        </View>
    );
};

export default StationPicker;
