import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    card: {
        width: '100%',
        maxWidth: 400,
        backgroundColor: '#EAE8E5',
        borderRadius: 16,
        padding: 24,
    },
    title: {
        fontSize: 20,
        fontFamily: 'Lexend',
        fontWeight: '500',
        color: '#303338',
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontFamily: 'Lexend',
        fontWeight: '400',
        color: '#303338',
        marginTop: 12,
        marginBottom: 6,
    },
    input: {
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        height: 44,
        paddingHorizontal: 12,
        fontSize: 14,
        fontFamily: 'Lexend',
        fontWeight: '400',
        color: '#303338',
    },
    row: {
        flexDirection: 'row',
        gap: 10,
    },
    roleChip: {
        flex: 1,
        height: 40,
        borderRadius: 8,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#D1CDCE',
    },
    activeChip: {
        backgroundColor: '#F07342',
        borderColor: '#F07342',
    },
    chipText: {
        fontSize: 14,
        fontFamily: 'Lexend',
        fontWeight: '400',
        color: '#303338',
    },
    activeChipText: {
        color: '#FFFFFF',
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 12,
        marginTop: 24,
    },
    cancelBtn: {
        paddingVertical: 10,
        paddingHorizontal: 16,
    },
    cancelText: {
        fontSize: 14,
        fontFamily: 'Lexend',
        fontWeight: '400',
        color: '#686B70',
    },
    saveBtn: {
        backgroundColor: '#F07342',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    saveText: {
        fontSize: 14,
        fontFamily: 'Lexend',
        fontWeight: '400',
        color: '#FFFFFF',
    },
});