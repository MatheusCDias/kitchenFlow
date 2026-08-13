import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 32,
        paddingBottom: 16,
        gap: 16,
    },
    fieldGroup: {
        gap: 8,
    },
    label: {
        fontFamily: 'Lexend_500Medium',
        fontSize: 14,
        color: '#EAE8E5',
    },
    input: {
        backgroundColor: '#EAE8E5',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        fontFamily: 'Lexend_400Regular',
        fontSize: 14,
        color: '#303338',
    },
    row: {
        flexDirection: 'row',
        gap: 12,
    },
    suggestionsBox: {
        backgroundColor: '#EAE8E5',
        borderRadius: 8,
        overflow: 'hidden',
        marginTop: -4,
    },
    suggestionRow: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderTopWidth: 1,
        borderTopColor: 'rgba(0, 0, 0, 0.08)',
    },
    suggestionText: {
        fontFamily: 'Lexend_400Regular',
        fontSize: 13,
        color: '#303338',
    },
    rowItem: {
        flex: 1,
    },
    presetsRow: {
        flexDirection: 'row',
        gap: 8,
    },
    presetButton: {
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#EAE8E5',
    },
    presetButtonActive: {
        backgroundColor: '#EAE8E5',
    },
    presetButtonText: {
        fontFamily: 'Lexend_400Regular',
        fontSize: 13,
        color: '#EAE8E5',
    },
    presetButtonTextActive: {
        color: '#F07342',
        fontFamily: 'Lexend_600SemiBold',
    },
    addItemButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        borderRadius: 8,
        paddingVertical: 10,
        alignItems: 'center',
    },
    addItemButtonText: {
        fontFamily: 'Lexend_500Medium',
        fontSize: 14,
        color: '#EAE8E5',
    },
    itemsList: {
        gap: 8,
    },
    itemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(255, 255, 255, 0.12)',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
    },
    itemRowText: {
        fontFamily: 'Lexend_300Light',
        fontSize: 14,
        color: '#EAE8E5',
        flex: 1,
    },
    itemRowNotes: {
        fontFamily: 'Lexend_300Light',
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.7)',
        fontStyle: 'italic',
    },
    submitButton: {
        backgroundColor: '#EAE8E5',
        borderRadius: 8,
        paddingVertical: 12,
        alignItems: 'center',
    },
    submitButtonDisabled: {
        opacity: 0.5,
    },
    submitButtonText: {
        fontFamily: 'Lexend_600SemiBold',
        fontSize: 16,
        color: '#F07342',
    },
    feedbackError: {
        fontFamily: 'Lexend_400Regular',
        fontSize: 13,
        color: '#FFD9D9',
    },
    feedbackSuccess: {
        fontFamily: 'Lexend_500Medium',
        fontSize: 13,
        color: '#EAE8E5',
    },
});
