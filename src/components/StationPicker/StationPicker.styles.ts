import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F07342',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 32,
        gap: 24,
    },
    title: {
        fontFamily: 'Lexend_600SemiBold',
        fontSize: 24,
        color: '#EAE8E5',
        textAlign: 'center',
    },
    subtitle: {
        fontFamily: 'Lexend_300Light',
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.8)',
        textAlign: 'center',
        marginTop: -12,
    },
    optionsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 16,
    },
    option: {
        width: 96,
        height: 96,
        borderRadius: 16,
        backgroundColor: '#EAE8E5',
        alignItems: 'center',
        justifyContent: 'center',
    },
    optionText: {
        fontFamily: 'Lexend_600SemiBold',
        fontSize: 18,
        color: '#F07342',
    },
    optionLabel: {
        fontFamily: 'Lexend_400Regular',
        fontSize: 12,
        color: '#F07342',
        marginTop: 2,
    },
    optionOccupied: {
        backgroundColor: 'rgba(234, 232, 229, 0.35)',
    },
    optionTextOccupied: {
        color: 'rgba(240, 115, 66, 0.6)',
    },
});
