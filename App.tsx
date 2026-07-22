import React, { useEffect } from 'react';
import { StyleSheet, View, Text, SafeAreaView, StatusBar } from 'react-native';
import { Header } from './src/components/Header/Header';

import { Order } from './src/models/Order';

export default function App() {
  
  useEffect(() => {
    console.log('--- INICIANDO TESTE DO STATE PATTERN ---');

    // Teste 1: Fluxo Completo do Pedido
    const order1 = new Order('#101');
    console.log(`[Order ${order1.getId()}] Estado inicial:`, order1.getStatus());

    order1.advance();
    console.log(`[Order ${order1.getId()}] Após 1º advance:`, order1.getStatus());

    order1.advance();
    console.log(`[Order ${order1.getId()}] Após 2º advance:`, order1.getStatus());

    order1.advance();
    console.log(`[Order ${order1.getId()}] Após 3º advance:`, order1.getStatus());

    order1.advance();
    console.log(`[Order ${order1.getId()}] Após 4º advance:`, order1.getStatus());

    // Tentando avançar um pedido que já foi entregue (deve disparar o warning)
    order1.advance();

    console.log('\n--- TESTE DE CANCELAMENTO ---');

    // Teste 2: Cancelando no meio do processo
    const order2 = new Order('#102');
    console.log(`[Order ${order2.getId()}] Estado inicial:`, order2.getStatus());

    order2.advance();
    console.log(`[Order ${order2.getId()}] Após advance:`, order2.getStatus());

    order2.cancel();
    console.log(`[Order ${order2.getId()}] Após cancel:`, order2.getStatus());

    // Tentando avançar um pedido cancelado (deve disparar o warning)
    order2.advance();

    console.log('--- FIM DOS TESTES ---');
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#F26E3B" />
      <View style={styles.container}>
        <Header />
        <View style={styles.content}>
          <Text style={styles.text}>Acompanhe a saída no terminal/console do Metro!</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F26E3B',
  },
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
});