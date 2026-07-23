import React, { useEffect } from 'react';
import { StyleSheet, View, Text, SafeAreaView, StatusBar, ScrollView } from 'react-native';
import { Header } from './src/components/Header/Header';

// Enums
import { OrderStateEnum } from './src/enums/OrderStateEnum';
import { OrderOriginEnum } from './src/enums/OrderOriginEnum';
import { CardTypeEnum } from './src/enums/CardTypeEnum';
import { DrinkTypeEnum } from './src/enums/DrinkTypeEnum';
import { CategoryEnum } from './src/enums/CategoryEnum';

// Modelos do Domínio
import { Order } from './src/models/Order';
import { Customer } from './src/models/Customer';
import { Address } from './src/models/Address';
import { DeliveryService } from './src/models/service/DeliveryService';
import { Cook } from './src/models/employee/Cook';
import { Attendant } from './src/models/employee/Attendant';
import { FoodItem } from './src/models/menu/FoodItem';
import { DrinkItem } from './src/models/menu/DrinkItem';
import { OrderItem } from './src/models/OrderItem';
import { PixPayment } from './src/models/payments/PixPayment';
import { CardPayment } from './src/models/payments/CardPayment';
import { Ingredient } from './src/models/kitchen/Ingredient';
import { Recipe } from './src/models/kitchen/Recipe';

export default function App() {

  useEffect(() => {
    console.log('--- 🚀 INICIANDO TESTE INTEGRADO DO KITCHEN FLOW ---');

    // 1. Criando Cliente e Endereço
    const address = new Address('Av. Paulista', 1000, '01310-100', 'Apto 42', 'Perto do MASP');
    const customer = new Customer('cust-1', 'Ana Silva', '(11) 99999-8888');
    customer.addAddress(address);

    // 2. Criando Equipe (Atendente e Cozinheiro)
    const attendant = new Attendant('emp-1', 'Carlos Atendente', 1, 'Manhã');
    const cook = new Cook('emp-2', 'Chef Roberto', 3, 'Manhã');

    // 3. Criando Serviço de Atendimento (Delivery)
    const deliveryService = new DeliveryService(new Date(Date.now() + 45 * 60000), address);

    // 4. Criando Itens do Cardápio com Receitas e Ingredientes
    const ingredient1 = new Ingredient('ing-1', 'Carne Hambúrguer 180g', 50, 1, 'unidade');
    const ingredient2 = new Ingredient('ing-2', 'Queijo Cheddar', 100, 2, 'fatias');

    const recipe = new Recipe('rec-1', 'Grelhar a carne por 3 min de cada lado e derreter o queijo', new Date(), 1, 8.50, [ingredient1, ingredient2]);

    const burgerDish = new FoodItem('menu-1', 'X-Burguer Gourmet', 35.00, 'Hambúrguer artesanal com cheddar', 2026, 7, new Date(), CategoryEnum.MAIN_COURSE, 1);
    const sodaDrink = new DrinkItem('menu-2', 'Coca-Cola 350ml', 7.00, 'Lata trincando de gelada', 2026, 7, false, DrinkTypeEnum.CAN);

    // 5. Instanciando a Comanda Principal (Order)
    const now = new Date();
    const order = new Order(
      'ord-1001',
      1001,
      OrderOriginEnum.IFOOD,
      new Date(now.getTime() + 40 * 60000),
      new Date(now.getTime() + 20 * 60000),
      new Date(now.getTime() + 45 * 60000),
      customer,
      deliveryService,
      cook
    );

    // 6. Adicionando Itens do Pedido na Comanda
    const item1 = new OrderItem('item-1', burgerDish.getName(), 2, new Date(), 'Sem cebola', burgerDish, recipe);
    const item2 = new OrderItem('item-2', sodaDrink.getName(), 2, new Date(), 'Com gelo e limão', sodaDrink);
    order.addItem(item1);
    order.addItem(item2);

    // 7. Adicionando Pagamento (Pix + Cartão)
    const pixPayment = new PixPayment(70.00, 'chave-pix-restaurante', 'qrcode-123', 5.00, 'CUPOM5', 5.00);
    order.addPayment(pixPayment);

    // --- LOGS DE VALIDAÇÃO DOS DADOS ---
    console.log(`\n📦 Comanda #${order.getOrderCode()} [Origem: ${order.getOrigin()}]`);
    console.log(`👤 Cliente: ${order.getCustomer()?.getName()} - Tel: ${order.getCustomer()?.getPhone()}`);
    console.log(`👨‍🍳 Cozinheiro Alocado: ${order.getAssignedEmployee()?.getName()}`);

    console.log('\n🍔 Itens do Pedido:');
    order.getItems().forEach((item, index) => {
      console.log(`   ${index + 1}. x${item.getQuantity()} ${item.getProductName()}`);
      if (item.getRecipe()) {
        console.log(`      📜 Instruções de Preparo: "${item.getRecipe()?.getPrepInstructions()}"`);
      }
    });

    console.log(`\n💳 Pagamentos Processados: ${order.getPayments().length}`);
    pixPayment.processPayment();

    // 8. Testando o Ciclo de Vida da Máquina de Estados (State Pattern)
    console.log('\n--- 🔄 CICLO DE VIDA DO PEDIDO ---');
    console.log(`Status 1: ${order.getStatus()}`); // RECEIVED

    order.advanceStage();
    console.log(`Status 2: ${order.getStatus()}`); // IN_PREPARATION

    order.advanceStage();
    console.log(`Status 3: ${order.getStatus()}`); // READY

    order.advanceStage();
    console.log(`Status 4: ${order.getStatus()}`); // ON_THE_WAY

    order.advanceStage();
    console.log(`Status 5: ${order.getStatus()}`); // DELIVERED

    console.log('--- ✅ FIM DO TESTE INTEGRADO ---');
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#F26E3B" />
      <View style={styles.container}>
        <Header />
        <View style={styles.content}>
          <Text style={styles.title}>Teste do Domínio Completo</Text>
          <Text style={styles.text}>Abra o terminal do Metro Bundler para ver os resultados detalhados.</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F26E3B' },
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  content: { flex: 1, padding: 16, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 8 },
  text: { fontSize: 14, color: '#666', textAlign: 'center' },
});