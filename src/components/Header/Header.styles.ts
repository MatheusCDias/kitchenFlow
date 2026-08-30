import { StyleSheet, StatusBar, Platform } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        backgroundColor: '#F07342', // Cor laranja da imagem
        width: '100%',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        // Garante que o Header não fique escondido sob a barra de status do celular
        paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 12 : 32,
    },
    topContainer: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    titleGroup: {
        alignItems: 'center',
    },
    title: {
        color: '#EAE8E5',
        fontSize: 24,
        fontFamily: 'Lexend',
        fontWeight: 600,
        textAlign: 'center',
        userSelect: 'none',
    },
    stationLabel: {
        marginTop: 2,
        color: '#F07342',
        backgroundColor: '#EAE8E5',
        fontFamily: 'Lexend',
        fontSize: 12,
        fontWeight: 500,
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
        userSelect: 'none',
        ...(Platform.OS === 'web' && {
            cursor: 'pointer',
            transition: 'background-color 0.2s ease',
        }),
    },
    iconButtonPressed: {
        backgroundColor: 'rgba(234,232,229, 0.15)',
    },
    workspaceHeader: {
        width: '100%',
        flexDirection: 'row',
        paddingVertical: 16,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerTitle: {
        fontFamily: 'Lexend',
        fontWeight: 400,
        fontSize: 20,
        color: '#EAE8E5',
        userSelect: 'none',
    },
    toggleContainer: {
        flexDirection: 'row',
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#EAE8E5',
        borderRadius: 12,
        padding: 4,
    },
    toggleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        padding: 8,
        borderRadius: 8,
        userSelect: 'none',
    },
    activeToggleButton: {
        backgroundColor: '#EAE8E5',
    },
    inactiveToggleButton: {
        backgroundColor: 'transparent',
    },
    toggleText: {
        fontFamily: 'Lexend',
        fontWeight: 400,
        fontSize: 16,
    },
    activeToggleText: {
        color: '#333',
    },
    inactiveToggleText: {
        color: '#EAE8E5',
    },
});