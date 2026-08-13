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
        paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 12 : 32,
    },
    titleGroup: {
        alignItems: 'center',
    },
    title: {
        color: '#EAE8E5',
        fontSize: 24,
        fontFamily: 'Lexend_600SemiBold',
        textAlign: 'center',
        userSelect: 'none',
    },
    stationBadge: {
        marginTop: 2,
        color: '#F07342',
        backgroundColor: '#EAE8E5',
        fontSize: 12,
        fontFamily: 'Lexend_500Medium',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 8,
        overflow: 'hidden',
    },
    iconButton: {
        width: 40,
        aspectRatio: 1,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        ...(Platform.OS === 'web' && {
            cursor: 'pointer',
            transition: 'background-color 0.2s ease',
        }),
    },
    iconButtonPressed: {
        backgroundColor: 'rgba(234,232,229, 0.15)',
    },
});