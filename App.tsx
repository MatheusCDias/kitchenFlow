import React, { useEffect } from 'react';
import { StyleSheet, View, Text, SafeAreaView, StatusBar } from 'react-native';
import { Header } from './src/components/Header/Header';

// Importações dos Pagamentos e Enums
import { PixPayment } from './src/models/payments/PixPayment';
import { CardPayment } from './src/models/payments/CardPayment';
import { CashPayment } from './src/models/payments/CashPayment';
import { Payment } from './src/models/payments/Payment';
import { CardTypeEnum } from './src/enums/CardTypeEnum';

export default function App() {
  
  useEffect(() => {
    console.log('--- 💳 INICIANDO TESTE DOS PAGAMENTOS ---');

    // 1. Teste de Pagamento via Pix (com desconto e frete)
    console.log('\n--- 1. Teste Pix ---');
    const pix = new PixPayment(
      50.00,                 // itemsAmount
      'chave-pix-kitchenflow@test.com', // key
      'qrcode-hash-123456',  // qrCode
      5.00,                  // deliveryFee
      'PROMO10',             // couponCode
      10.00                  // discountAmount
    );
    console.log(`Valor Total Calculado: $${pix.getTotalAmount().toFixed(2)}`); // Esperado: 50 + 5 - 10 = 45.00
    const pixSuccess = pix.processPayment();
    console.log(`Status do processamento: ${pixSuccess ? 'SUCESSO' : 'FALHA'}`);

    // 2. Teste de Pagamento via Cartão de Crédito
    console.log('\n--- 2. Teste Cartão ---');
    const card = new CardPayment(
      120.00,                // itemsAmount
      CardTypeEnum.CREDIT,       // type
      '4532111122228888',    // cardNumber
      'Mastercard',          // brand
      8.00                   // deliveryFee
    );
    console.log(`Valor Total Calculado: $${card.getTotalAmount().toFixed(2)}`); // Esperado: 120 + 8 = 128.00
    card.processPayment();

    // 3. Teste de Pagamento em Dinheiro (Troco suficiente)
    console.log('\n--- 3. Teste Dinheiro (Troco OK) ---');
    const cashOk = new CashPayment(
      35.00,                 // itemsAmount
      50.00,                 // cashGiven (Cliente deu R$ 50)
      5.00                   // deliveryFee
    );
    console.log(`Valor Total Calculado: $${cashOk.getTotalAmount().toFixed(2)}`); // Esperado: 35 + 5 = 40.00
    cashOk.processPayment(); // Esperado: Troco de $10.00

    // 4. Teste de Pagamento em Dinheiro (Valor insuficiente)
    console.log('\n--- 4. Teste Dinheiro (Valor Insuficiente) ---');
    const cashFail = new CashPayment(
      35.00,                 // itemsAmount
      30.00,                 // cashGiven (Cliente deu só R$ 30)
      5.00                   // deliveryFee
    );
    console.log(`Valor Total Calculado: $${cashFail.getTotalAmount().toFixed(2)}`); // Esperado: 40.00
    const cashSuccess = cashFail.processPayment(); // Esperado: Alerta de valor insuficiente
    console.log(`Status do processamento: ${cashSuccess ? 'SUCESSO' : 'FALHA'}`);

    // 5. Teste de Polimorfismo (Lista de pagamentos genéricos)
    console.log('\n--- 5. Teste de Polimorfismo ---');
    const paymentsList: Payment[] = [pix, card, cashOk];
    
    paymentsList.forEach((payment, index) => {
      console.log(`\nProcessando pagamento #${index + 1}:`);
      payment.processPayment();
    });

    console.log('\n--- 💳 FIM DOS TESTES DE PAGAMENTO ---');
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#F26E3B" />
      <View style={styles.container}>
        <Header />
        <View style={styles.content}>
          <Text style={styles.text}>Verifique os testes de Pagamento no terminal!</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F26E3B' },
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  content: { flex: 1, padding: 16, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 16, color: '#333', textAlign: 'center' },
});