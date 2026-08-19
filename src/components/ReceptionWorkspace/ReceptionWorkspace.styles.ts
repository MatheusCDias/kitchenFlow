import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        backgroundColor: '#F07342',
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
        flexDirection: 'column',
        gap: 16,
        alignItems: 'stretch',
        overflow: 'hidden',
        userSelect: 'none',
        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 6,
    },
    content: {
        flexDirection: 'column',
        paddingHorizontal: 32,
        gap: 16,
    },
    sectionContent: {
        flexDirection: 'row',
        gap: 16,
        paddingBottom: 16,
    },
    ticketSection: {
        alignItems: 'flex-start',
    },
    sectionTitle: {
        fontSize: 20,
        fontFamily: 'Lexend',
        fontWeight: 400,
        color: '#EAE8E5',
    },
    formContainer: {
        flex: 1,
        justifyContent: 'space-between',
    },
    label: {
        fontSize: 16,
        fontFamily: 'Lexend',
        fontWeight: 400,
        color: '#EAE8E5',
    },
    input: {
        backgroundColor: '#EAE8E5',
        borderRadius: 16,
        height: 48,
        paddingHorizontal: 16,
        fontSize: 16,
        fontFamily: 'Lexend',
        fontWeight: 400,
        color: '#303338',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    flexInput: {
        flex: 1,
        gap: 8,
    },
    qtyInput: {
        maxWidth: 80,
        paddingHorizontal: 24,
        textAlign: 'center',
    },
    addButton: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255, 255, 255, 0.25)',
        height: 48,
        paddingHorizontal: 16,
        borderRadius: 16,
        gap: 8,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.4)',
    },
    addButtonText: {
        color: '#EAE8E5',
        fontSize: 16,
        fontFamily: 'Lexend',
        fontWeight: 400,
    },
    submitButton: {
        backgroundColor: '#303338',
        height: 48,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    submitButtonText: {
        color: '#EAE8E5',
        fontSize: 16,
        fontFamily: 'Lexend',
        fontWeight: 400,
    },
    dropdownContainer: {
        position: 'absolute',
        top: 48, // Logo abaixo do input
        left: 0,
        right: 0,
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        maxHeight: 180,
        borderWidth: 1,
        borderColor: '#D1CDCE',
        elevation: 5, // Sombra no Android
        shadowColor: '#000', // Sombra no iOS / Web
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        zIndex: 999, // Fica por cima dos outros elementos
    },
    dropdownItem: {
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F0ECE9',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    dropdownItemText: {
        fontSize: 14,
        fontFamily: 'Lexend',
        color: '#303338',
    },
    dropdownCategoryText: {
        fontSize: 12,
        fontFamily: 'Lexend',
        color: '#A09C9D',
    },
});