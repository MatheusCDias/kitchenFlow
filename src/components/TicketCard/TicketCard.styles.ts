import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    cardContainer: {
        backgroundColor: '#EAE8E5',
        justifyContent: 'space-between',
        width: 280,
        minHeight: 402,
    },
    cardContent: {
        height: '90%',
        marginHorizontal: 24,
        gap: 16,
        //backgroundColor: '#FF0000',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    orderCode: {
        fontFamily: 'Lexend_400Regular',
        fontSize: 20,
        color: '#303338',
    },
    serviceText: {
        fontFamily: 'Lexend_300Light',
        fontSize: 20,
        color: '#303338',
    },
    divider: {
        height: 1,
        borderWidth: 0.8,
        borderColor: '#F07342',
        borderStyle: 'dashed',
        //marginVertical: 8,
    },
    itemsContainer: {
        flex: 1,
        gap: 16,
    },
    itemRow: {
        paddingVertical: 2,
        paddingHorizontal: 4,
        borderRadius: 4,
        gap: 8,
    },
    selectedItemRow: {
        backgroundColor: 'rgba(242, 110, 59, 0.2)',
    },
    itemText: {
        fontFamily: 'Lexend_300Light',
        fontSize: 16,
        color: '#303338',
    },
    itemQuantity: {
        fontFamily: 'Lexend_400Regular',
        fontWeight: 'bold',
    },
    itemSubObs: {
        fontFamily: 'Lexend_300Light',
        fontSize: 12,
        color: '#555',
        marginLeft: 24,
    },
    notesText: {
        fontFamily: 'Lexend_300Light',
        fontSize: 14,
        color: '#555',
        fontStyle: 'italic',
        marginVertical: 6,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 8,
    },
    timerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    timerText: {
        fontFamily: 'Lexend_400Regular',
        fontSize: 20,
        color: '#303338',
    },
    actionButton: {
        backgroundColor: '#F26E3B',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 6,
    },
    disabledButton: {
        backgroundColor: '#AAA',
    },
    actionButtonText: {
        color: '#FFF',
        fontSize: 11,
        fontWeight: 'bold',
    },
});