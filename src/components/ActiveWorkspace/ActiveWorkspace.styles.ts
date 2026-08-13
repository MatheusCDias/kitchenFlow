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
        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 6,
    },
    orderContainer: {
        flexDirection: 'row',
        paddingHorizontal: 32,
        paddingBottom: 16,
        gap: 24,
    },
    workspaceHeader: {
        width: '100%',
        flexDirection: 'row',
        paddingHorizontal: 32,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerTitle: {
        fontFamily: 'Lexend_400Regular',
        fontSize: 20,
        color: '#EAE8E5',
        userSelect: 'none',
    },
    emptyContent: {
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 240,
        padding: 32,
        gap: 8,
    },
    emptyTitle: {
        fontFamily: 'Lexend_500Medium',
        fontSize: 18,
        color: '#EAE8E5',
    },
    emptySubtitle: {
        fontFamily: 'Lexend_300Light',
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.8)',
        textAlign: 'center',
    },
    ticketWrapper: {
        justifyContent: 'center',
    },
    detailsContainer: {
        flex: 1,
        justifyContent: 'space-between',
        gap: 8,
    },
    recipeHeader: {
        gap: 4,
    },
    recipeTitleLabel: {
        fontFamily: 'Lexend_500Medium',
        fontSize: 20,
        color: '#EAE8E5',
    },
    selectedItemName: {
        fontFamily: 'Lexend_300Light',
        fontSize: 16,
        color: '#EAE8E5',
    },
    recipeContent: {
        flex: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.12)',
        borderRadius: 8,
        padding: 16,
        gap: 8,
    },
    sectionSubTitle: {
        fontSize: 14,
        fontFamily: 'Lexend_600SemiBold',
        color: '#EAE8E5',
    },
    ingredientRow: {
        gap: 8,
    },
    ingredientText: {
        fontFamily: 'Lexend_300Light',
        fontSize: 14,
        color: '#EAE8E5',
    },
    instructionsText: {
        fontSize: 14,
        fontFamily: 'Lexend_300Light',
        color: '#EAE8E5',
    },
    noRecipeText: {
        fontSize: 14,
        fontFamily: 'Lexend_300Light',
        color: 'rgba(255, 255, 255, 0.7)',
        fontStyle: 'italic',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 8,
    },
    timerBox: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    timerText: {
        fontFamily: 'Lexend_400Regular',
        fontSize: 26,
        color: '#EAE8E5',
    },
    lateTimerText: {
        color: '#FFD9D9',
    },
    completeButton: {
        backgroundColor: '#EAE8E5',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 8,
        elevation: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 3,
    },
    completeButtonText: {
        fontFamily: 'Lexend_600SemiBold',
        color: '#F26E3B',
        fontSize: 16,
    },
    actionsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    secondaryButton: {
        paddingHorizontal: 14,
        paddingVertical: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.6)',
    },
    secondaryButtonText: {
        fontFamily: 'Lexend_500Medium',
        color: '#EAE8E5',
        fontSize: 14,
    },
    dangerButton: {
        paddingHorizontal: 14,
        paddingVertical: 12,
        borderRadius: 8,
        backgroundColor: '#ED4545',
    },
    dangerButtonText: {
        fontFamily: 'Lexend_600SemiBold',
        color: '#EAE8E5',
        fontSize: 14,
    },
    confirmText: {
        fontFamily: 'Lexend_400Regular',
        color: '#EAE8E5',
        fontSize: 14,
    },
});