import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    overlay: {
        flex: 1,
    },
    backdropContainer: {
        ...StyleSheet.absoluteFill,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    backdrop: {
        flex: 1,
    },
    menuContainer: {
        position: 'absolute',
        height: '100%',
        justifyContent: 'space-between',
        backgroundColor: '#EAE8E5',
        borderTopRightRadius: 16,
        borderBottomRightRadius: 16,
        overflow: 'hidden',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.20,
        shadowRadius: 24,
        elevation: 8,
    },
    menuContent: {
        flexDirection: 'column',
        paddingTop: 32,
        paddingHorizontal: 16,
        gap: 24,
    },
    title: {
        fontSize: 24,
        color: '#303338',
        fontFamily: 'Lexend',
        fontWeight: 400,
        userSelect: 'none',
    },
    optionsList: {
        gap: 12,
    },
    optionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        minHeight: 48,
        gap: 16,
        paddingHorizontal: 8,
        borderRadius: 8,
        userSelect: 'none',
    },
    pressedOptionButton: {
        backgroundColor: 'rgba(240, 115, 66, 0.15)',
    },
    optionText: {
        color: '#303338',
        fontFamily: 'Lexend',
        fontWeight: 300,
        fontSize: 16,
        lineHeight: 16,
        flexShrink: 1,
    },
    footerVersion: {
        padding: 16,
        fontFamily: 'Lexend',
        fontWeight: 300,
        fontSize: 12,
        color: '#B2B2B2',
        paddingVertical: 12,
    },
});