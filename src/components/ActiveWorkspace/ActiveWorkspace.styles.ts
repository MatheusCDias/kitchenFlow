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
        gap: 16,
    },
    workspaceHeader: {
        width: '100%',
        flexDirection: 'row',
        paddingHorizontal: 32,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#EAE8E5',
        userSelect: 'none',
    },
    toggleContainer: {
        flexDirection: 'row',
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#EAE8E5',
        borderRadius: 12,
        padding: 4,
    },
    toggleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        padding: 8,
        borderRadius: 8,
    },
    activeToggleButton: {
        backgroundColor: '#EAE8E5',
    },
    inactiveToggleButton: {
        backgroundColor: 'transparent',
    },
    toggleText: {
        fontSize: 12,
        fontWeight: '600',
    },
    activeToggleText: {
        color: '#333',
    },
    inactiveToggleText: {
        color: '#EAE8E5',
    },
    emptyContainer: {
        backgroundColor: '#F07342',
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
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
    emptyContent: {
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 240,
        padding: 32,
        gap: 8,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#EAE8E5',
        marginTop: 12,
    },
    emptySubtitle: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.8)',
        textAlign: 'center',
        marginTop: 4,
    },
    ticketWrapper: {
        justifyContent: 'center',
    },
    detailsContainer: {
        flex: 1,
        justifyContent: 'space-between',
    },
    recipeHeader: {
        marginBottom: 8,
    },
    recipeTitleLabel: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#EAE8E5',
    },
    selectedItemName: {
        fontSize: 16,
        color: '#EAE8E5',
        opacity: 0.9,
        marginTop: 2,
    },
    recipeContent: {
        flex: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.12)',
        borderRadius: 8,
        padding: 12,
        marginVertical: 8,
    },
    sectionSubTitle: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#EAE8E5',
        marginBottom: 4,
    },
    ingredientRow: {
        marginVertical: 1,
    },
    ingredientText: {
        fontSize: 12,
        color: '#EAE8E5',
    },
    instructionsText: {
        fontSize: 13,
        color: '#EAE8E5',
        lineHeight: 18,
    },
    noRecipeText: {
        fontSize: 13,
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
        fontSize: 26,
        fontWeight: 'bold',
        color: '#EAE8E5',
    },
    completeButton: {
        backgroundColor: '#EAE8E5',
        paddingHorizontal: 24,
        paddingVertical: 10,
        borderRadius: 8,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 3,
    },
    completeButtonText: {
        color: '#F26E3B',
        fontSize: 15,
        fontWeight: 'bold',
    },
});