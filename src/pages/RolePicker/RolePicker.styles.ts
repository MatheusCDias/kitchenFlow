import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F07342',
        justifyContent: 'space-between',
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 24,
    },
    title: {
        fontFamily: 'Lexend',
        fontWeight: 400,
        fontSize: 24,
        color: '#EAE8E5',
        textAlign: 'center',
    },
    optionsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 24,
    },
    option: {
        width: 160,
        height: 140,
        borderRadius: 16,
        backgroundColor: '#EAE8E5',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    optionText: {
        fontFamily: 'Lexend',
        fontWeight: 300,
        fontSize: 18,
        color: '#F07342',
    },
});