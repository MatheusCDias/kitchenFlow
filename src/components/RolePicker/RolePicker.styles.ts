import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F07342',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 32,
        gap: 24,
    },
    title: {
        fontFamily: 'Lexend_600SemiBold',
        fontSize: 24,
        color: '#EAE8E5',
        textAlign: 'center',
    },
    optionsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 16,
    },
    option: {
        width: 160,
        height: 140,
        borderRadius: 16,
        backgroundColor: '#EAE8E5',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    optionText: {
        fontFamily: 'Lexend_600SemiBold',
        fontSize: 18,
        color: '#F07342',
    },
    resetArea: {
        marginTop: 16,
        alignItems: 'center',
    },
    resetLink: {
        fontFamily: 'Lexend_300Light',
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.6)',
        textDecorationLine: 'underline',
    },
    resetConfirmRow: {
        alignItems: 'center',
        gap: 8,
    },
    resetConfirmText: {
        fontFamily: 'Lexend_400Regular',
        fontSize: 13,
        color: '#EAE8E5',
    },
    resetConfirmYes: {
        fontFamily: 'Lexend_600SemiBold',
        fontSize: 13,
        color: '#ED4545',
        backgroundColor: '#EAE8E5',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
        overflow: 'hidden',
    },
    resetConfirmNo: {
        fontFamily: 'Lexend_300Light',
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.7)',
    },
    resetDoneText: {
        fontFamily: 'Lexend_400Regular',
        fontSize: 13,
        color: '#EAE8E5',
    },
});
