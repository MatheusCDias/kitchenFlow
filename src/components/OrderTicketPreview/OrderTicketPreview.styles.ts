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
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    orderCode: {
        fontFamily: 'Lexend',
        fontWeight: 400,
        fontSize: 20,
        color: '#303338',
    },
    serviceText: {
        fontFamily: 'Lexend',
        fontWeight: 300,
        fontSize: 16,
        color: '#303338',
    },
    placeholderText: {
        color: '#A09C9D',
        fontStyle: 'italic',
    },
    divider: {
        height: 1,
        borderWidth: 0.8,
        borderColor: '#F07342',
        borderStyle: 'dashed',
        //marginVertical: 8,
    },
    itemsList: {
        flex: 1,
        gap: 16,
    },
    emptyState: {
        color: '#A09C9D',
        fontFamily: 'Lexend_400Regular',
        fontSize: 14,
    },
    itemRow: {
        paddingVertical: 2,
        paddingHorizontal: 4,
        borderRadius: 4,
        gap: 8,
    },
    itemHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 8,
    },
    itemQuantity: {
        fontFamily: 'Lexend',
        fontWeight: 400,
    },
    itemName: {
        fontFamily: 'Lexend',
        fontWeight: 300,
        fontSize: 16,
        color: '#303338',
    },
    itemObservation: {
        fontFamily: 'Lexend',
        fontWeight: 300,
        fontSize: 12,
        color: '#555',
        marginLeft: 24,
    },
    dividerLine: {
        height: 1,
        backgroundColor: '#303338',
        opacity: 0.3,
        marginVertical: 8,
    },
    generalObsContainer: {
        marginBottom: 12,
    },
    generalObsText: {
        fontFamily: 'Lexend',
        fontWeight: 300,
        fontSize: 14,
        color: '#555',
        fontStyle: 'italic',
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
        fontFamily: 'Lexend',
        fontWeight: 400,
        fontSize: 20,
        color: '#303338',
    }
});