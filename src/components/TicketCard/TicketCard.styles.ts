import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    cardContainer: {
        backgroundColor: '#EAE8E5',
        justifyContent: 'space-between',
        width: 280,
        minHeight: 402,
    },
    cardContent: {
        padding: 24,
        justifyContent: 'space-between',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    orderCode: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1A1A1A',
    },
    serviceText: {
        fontSize: 14,
        color: '#555',
        fontWeight: '600',
    },
    divider: {
        height: 1,
        borderWidth: 0.8,
        borderColor: '#CCC',
        borderStyle: 'dashed',
        marginVertical: 8,
    },
    itemsContainer: {
        flex: 1,
        gap: 6,
    },
    itemRow: {
        paddingVertical: 2,
        paddingHorizontal: 4,
        borderRadius: 4,
    },
    selectedItemRow: {
        backgroundColor: 'rgba(242, 110, 59, 0.2)',
    },
    itemText: {
        fontSize: 13,
        color: '#333',
    },
    itemQuantity: {
        fontWeight: 'bold',
    },
    itemSubObs: {
        fontSize: 10,
        color: '#777',
        marginLeft: 14,
    },
    notesText: {
        fontSize: 11,
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
        gap: 4,
    },
    timerText: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#333',
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