import React from 'react';
import { StyleSheet, View, SafeAreaView, StatusBar, Alert } from 'react-native';
import { Header } from './src/components/Header/Header';

export default function App() {
  const handleMenuPress = () => {
    Alert.alert('Menu', 'Abrir menu de navegação');
  };

  const handleNotificationPress = () => {
    Alert.alert('Notificações', 'Nenhuma notificação no momento');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#F26E3B" />
      <View style={styles.container}>
        <Header
          onMenuPress={handleMenuPress}
          onNotificationPress={handleNotificationPress}
        />

        {/* Conteúdo do resto do app vai entrar aqui */}
        <View style={styles.content}>
          {/* Telas e comandas entram aqui */}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F26E3B', // Para combinar com a barra de status
  },
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5', // Cor de fundo do app
  },
  content: {
    flex: 1,
    padding: 16,
  },
});