import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { styles } from './RolePicker.styles';
import { resetAllOrdersRequest } from '../../services/api';

export type Role = 'recepcao' | 'cozinha';

interface RolePickerProps {
    onSelect: (role: Role) => void;
}

// Primeira tela que qualquer um vê ao abrir o site. A escolha aqui trava
// o que a pessoa consegue ver depois — quem entra como cozinha não vê
// a recepção, e vice-versa.
export const RolePicker: React.FC<RolePickerProps> = ({ onSelect }) => {
    const [confirmingReset, setConfirmingReset] = useState(false);
    const [isResetting, setIsResetting] = useState(false);
    const [resetDone, setResetDone] = useState(false);

    const handleReset = async () => {
        setIsResetting(true);
        try {
            await resetAllOrdersRequest();
            setResetDone(true);
        } finally {
            setIsResetting(false);
            setConfirmingReset(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Você é da Recepção ou da Cozinha?</Text>

            <View style={styles.optionsRow}>
                <TouchableOpacity style={styles.option} activeOpacity={0.8} onPress={() => onSelect('recepcao')}>
                    <MaterialIcons name="desktop-windows" size={32} color="#F07342" />
                    <Text style={styles.optionText}>Recepção</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.option} activeOpacity={0.8} onPress={() => onSelect('cozinha')}>
                    <MaterialIcons name="restaurant" size={32} color="#F07342" />
                    <Text style={styles.optionText}>Cozinha</Text>
                </TouchableOpacity>
            </View>

            {/* Ferramenta de ambiente de testes — apaga todos os pedidos e reinicia a contagem do #1. */}
            <View style={styles.resetArea}>
                {resetDone ? (
                    <Text style={styles.resetDoneText}>Ambiente reiniciado! Pode criar pedidos do zero.</Text>
                ) : confirmingReset ? (
                    <View style={styles.resetConfirmRow}>
                        <Text style={styles.resetConfirmText}>Apagar todos os pedidos e reiniciar do #1?</Text>
                        <TouchableOpacity onPress={handleReset} disabled={isResetting}>
                            <Text style={styles.resetConfirmYes}>{isResetting ? 'Reiniciando...' : 'Sim, apagar tudo'}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setConfirmingReset(false)}>
                            <Text style={styles.resetConfirmNo}>Cancelar</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <TouchableOpacity onPress={() => setConfirmingReset(true)}>
                        <Text style={styles.resetLink}>Reiniciar ambiente de testes</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};
