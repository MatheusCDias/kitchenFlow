import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { styles } from './StationPicker.styles';

// Quantidade de bancadas físicas da cozinha. Fixo por enquanto — quando
// existir um cadastro de bancadas de verdade, isso vem do servidor.
const STATION_COUNT = 4;

interface StationPickerProps {
    occupiedStations: number[];
    onSelect: (stationNumber: number) => void;
}

export const StationPicker: React.FC<StationPickerProps> = ({ occupiedStations, onSelect }) => {
    const stationNumbers = Array.from({ length: STATION_COUNT }, (_, index) => index + 1);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Qual bancada é essa?</Text>
            <Text style={styles.subtitle}>Fechar essa aba libera a bancada pra outra pessoa.</Text>

            <View style={styles.optionsRow}>
                {stationNumbers.map(number => {
                    const isOccupied = occupiedStations.includes(number);
                    return (
                        <TouchableOpacity
                            key={number}
                            style={[styles.option, isOccupied && styles.optionOccupied]}
                            activeOpacity={0.8}
                            disabled={isOccupied}
                            onPress={() => onSelect(number)}
                        >
                            <Text style={[styles.optionText, isOccupied && styles.optionTextOccupied]}>
                                {number}
                            </Text>
                            <Text style={[styles.optionLabel, isOccupied && styles.optionTextOccupied]}>
                                {isOccupied ? 'Ocupada' : 'Bancada'}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
};
