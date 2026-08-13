import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import {
    Image,
    Modal,
    Pressable,
    Text,
    View,
} from 'react-native';

interface FloatingMenuProps {
    visible: boolean;
    onClose: () => void;
}

const FloatingMenu: React.FC<FloatingMenuProps> = ({
    visible,
    onClose,
}) => {
    const handleOptionPress = (option: string) => {
    console.log(`Opção selecionada: ${option}`);
    onClose();
};
    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={{ flex: 1 }}>
                {/* Área fora do menu */}
                <Pressable
                    onPress={onClose}
                    style={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        bottom: 0,
                        left: 0,
                    }}
                />

                {/* Caixa do menu */}
                <View
                    style={{
                        position: 'absolute',
                        top: 30,
                        left: 10,
                        width: 300,
                        height: 300,
                        padding: 12,
                        backgroundColor: '#EAE8E5',
                        borderTopLeftRadius: 16,
                        borderTopRightRadius: 16,
                        borderBottomRightRadius: 16,
                        borderBottomLeftRadius: 16,
                        boxShadow: '0px 8px 24px rgba(0,0,0,0.20)',
    }}
    
>
                    <Pressable
                        onPress={onClose}
                        style={({ pressed }) => ({
                        width: 40,
                        height: 40,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 8,
                        backgroundColor: pressed
                            ? 'rgba(48,51,56,0.10)'
                            : 'transparent',
                        })}
                    >
                        <MaterialIcons
                            name="menu"
                            size={24}
                            color="#303338"
    />
                    </Pressable>

            <View style={{ marginTop: 4 }}>
                <Pressable
                    onPress={() => handleOptionPress('Área de Trabalho')}
                    style={({ pressed }) => ({
                        minHeight: 44,
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingHorizontal: 8,
                        borderRadius: 8,
                        backgroundColor: pressed
                            ? 'rgba(240,115,66,0.15)'
                            : 'transparent',
                    })}
                >
                    <Image
                        source={require('../../assets/spatula.png')}
                        style={{
                            width: 22,
                            height: 22,
                            tintColor: '#303338',
                        }}
                        resizeMode="contain"
                    />

        <Text
            style={{
                marginLeft: 14,
                color: '#303338',
                fontFamily: 'Lexend_400Regular',
                fontSize: 16,
                lineHeight: 20,
                flexShrink: 1,
            }}
        >
            Área de Trabalho
        </Text>
    </Pressable>

    <Pressable
        onPress={() =>
            handleOptionPress('Adicionar Item ao Cardápio')
        }
        style={({ pressed }) => ({
            minHeight: 44,
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 8,
            borderRadius: 8,
            backgroundColor: pressed
                ? 'rgba(240,115,66,0.15)'
                : 'transparent',
        })}
    >
        <MaterialIcons
            name="menu-book"
            size={22}
            color="#303338"
        />

        <Text
            style={{
                marginLeft: 14,
                color: '#303338',
                fontFamily: 'Lexend_400Regular',
                fontSize: 16,
                lineHeight: 20,
                flexShrink: 1,
            }}
        >
            Adicionar Item ao{'\n'}Cardápio
        </Text>
    </Pressable>

    <Pressable
        onPress={() =>
            handleOptionPress('Adicionar Funcionário')
        }
        style={({ pressed }) => ({
            minHeight: 44,
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 8,
            borderRadius: 8,
            backgroundColor: pressed
                ? 'rgba(240,115,66,0.15)'
                : 'transparent',
        })}
    >
        <MaterialIcons
            name="person-add"
            size={22}
            color="#303338"
        />

        <Text
            style={{
                marginLeft: 14,
                color: '#303338',
                fontFamily: 'Lexend_400Regular',
                fontSize: 16,
                lineHeight: 20,
                flexShrink: 1,
            }}
        >
            Adicionar Funcionário
        </Text>
    </Pressable>

    <Pressable
        onPress={() => handleOptionPress('Relatórios')}
        style={({ pressed }) => ({
            minHeight: 44,
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 8,
            borderRadius: 8,
            backgroundColor: pressed
                ? 'rgba(240,115,66,0.15)'
                : 'transparent',
        })}
    >
        <MaterialIcons
            name="assessment"
            size={22}
            color="#303338"
        />

        <Text
            style={{
                marginLeft: 14,
                color: '#303338',
                fontFamily: 'Lexend_400Regular',
                fontSize: 16,
                lineHeight: 20,
                flexShrink: 1,
            }}
        >
            Relatórios
        </Text>
    </Pressable>

    <Pressable
        onPress={() => handleOptionPress('Configurações')}
        style={({ pressed }) => ({
            minHeight: 44,
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 8,
            borderRadius: 8,
            backgroundColor: pressed
                ? 'rgba(240,115,66,0.15)'
                : 'transparent',
        })}
    >
        <MaterialIcons
            name="settings"
            size={22}
            color="#303338"
        />

        <Text
            style={{
                marginLeft: 14,
                color: '#303338',
                fontFamily: 'Lexend_400Regular',
                fontSize: 16,
                lineHeight: 20,
                flexShrink: 1,
            }}
        >
            Configurações
        </Text>
    </Pressable>
</View>
                </View>
            </View>
        </Modal>
    );
};

export default FloatingMenu;