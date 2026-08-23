import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        width: '100%',
        paddingTop: 48,
        gap: 24,
        alignItems: 'center',
        paddingHorizontal: 32,
    },
    title: {
        fontFamily: 'Lexend',
        fontWeight: 400,
        fontSize: 20,
        color: '#303338',
        alignSelf: 'flex-start',
    },
    listContent: {
        alignItems: 'center',
    },
    columnWrapper: {
        justifyContent: 'center',
        gap: 32,
    },
    columnItem: {
        alignItems: 'center',
        marginBottom: 32,
    },
    placeholderCard: {
        backgroundColor: '#DEDEDE',
        width: 280,
        minHeight: 402,
        justifyContent: 'center',
        alignItems: 'center',
    },
});