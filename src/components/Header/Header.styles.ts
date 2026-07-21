import { StyleSheet, StatusBar, Platform } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        backgroundColor: '#F07342', // Cor laranja da imagem
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingBottom: 16,
        // Garante que o Header não fique escondido sob a barra de status do celular
        paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 12 : 50,
    },
    title: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: '600',
        textAlign: 'center',
    },
    iconButton: {
        padding: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
});