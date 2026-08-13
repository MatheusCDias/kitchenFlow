import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        backgroundColor: '#F07342',
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
        flexDirection: 'column',
        gap: 16,
        overflow: 'hidden',
        paddingTop: 8,
        paddingBottom: 24,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 6,
    },
    header: {
        paddingHorizontal: 32,
    },
    headerTitle: {
        fontFamily: 'Lexend_400Regular',
        fontSize: 20,
        color: '#EAE8E5',
        userSelect: 'none',
    },
});
