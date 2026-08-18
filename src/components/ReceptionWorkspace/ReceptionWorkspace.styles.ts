import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        backgroundColor: '#F07342',
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
        flexDirection: 'column',
        gap: 16,
        overflow: 'hidden',
        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 6,
    },
    header: {
        paddingHorizontal: 32,
    },
    headerTitle: {
        fontFamily: 'Lexend',
        fontWeight: 500,
        fontSize: 18,
        color: '#EAE8E5',
        userSelect: 'none',
    },
    optionsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 24,
    },
    option: {
        padding: 40,
        borderRadius: 16,
        backgroundColor: '#EAE8E5',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    optionText: {
        fontFamily: 'Lexend',
        fontWeight: 400,
        fontSize: 18,
        color: '#F07342',
    },
});