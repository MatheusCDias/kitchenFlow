import React, { useState } from 'react';
import {
  useFonts,
  Lexend_100Thin,
  Lexend_200ExtraLight,
  Lexend_300Light,
  Lexend_400Regular,
  Lexend_500Medium,
  Lexend_600SemiBold,
  Lexend_700Bold,
  Lexend_800ExtraBold,
  Lexend_900Black,
} from '@expo-google-fonts/lexend';
import { StyleSheet, View, SafeAreaView, StatusBar, ScrollView } from 'react-native';
import { Header } from './src/components/Header/Header';
import { ActiveWorkspace } from './src/components/ActiveWorkspace/ActiveWorkspace';
import { AllOrders } from './src/components/AllOrders/AllOrders';
import { CheckeredBorder } from './src/components/Patterns/CheckeredBorder';

// Enums
import { OrderOriginEnum } from './src/enums/OrderOriginEnum';
import { DrinkTypeEnum } from './src/enums/DrinkTypeEnum';
import { CategoryEnum } from './src/enums/CategoryEnum';

// Modelos do Domínio
import { Order } from './src/models/Order';
import { Customer } from './src/models/Customer';
import { Address } from './src/models/Address';
import { TableService } from './src/models/service/TableService';
import { Cook } from './src/models/employee/Cook';
import { FoodItem } from './src/models/menu/FoodItem';
import { DrinkItem } from './src/models/menu/DrinkItem';
import { OrderItem } from './src/models/OrderItem';
import { Ingredient } from './src/models/kitchen/Ingredient';
import { Recipe } from './src/models/kitchen/Recipe';

// Função auxiliar para montar um pedido inicial de teste
const createMockOrder = (id: string, code: number): Order => {
  const address = new Address('Rua Principal', 100, '13730-000', 'Apto 12');
  const customer = new Customer('cust-101', 'João Silva', '(19) 98765-4321');
  customer.addAddress(address);

  const cook = new Cook('emp-1', 'Chef Roberto', 3, 'Tarde');
  const tableService = new TableService(new Date(), 5, 2);

  const ing1 = new Ingredient('ing-1', 'Carne Artesanal 180g', 1, 1, 'unidade');
  const ing2 = new Ingredient('ing-2', 'Queijo Cheddar', 2, 2, 'fatias');
  const burgerRecipe = new Recipe('rec-1', 'Grelhar a carne no ponto desejado e selar o pão na manteiga.', new Date(), 1, 12.0, [ing1, ing2]);

  const ingFries = new Ingredient('ing-3', 'Batata Palito', 250, 250, 'g');
  const friesRecipe = new Recipe('rec-2', 'Fritar a batata a 180°C por 5 minutos até dourar.', new Date(), 1, 4.0, [ingFries]);

  const burger = new FoodItem('menu-1', 'Hambúrguer Artesanal', 32.00, 'Delicioso hambúrguer', 2026, 10, new Date(), CategoryEnum.MAIN_COURSE, 1);
  const fries = new FoodItem('menu-2', 'Batata Frita Grande', 18.00, 'Porção individual', 2026, 15, new Date(), CategoryEnum.APPETIZER, 1);
  const soda = new DrinkItem('menu-3', 'Refrigerante', 7.00, 'Lata 350ml', 2026, 5, false, DrinkTypeEnum.CAN);

  const now = new Date();
  const order = new Order(
    id,
    code,
    OrderOriginEnum.PRESENTIAL,
    new Date(now.getTime() + 20 * 60000),
    new Date(now.getTime() + 10 * 60000),
    new Date(now.getTime() + 25 * 60000),
    customer,
    tableService,
    cook
  );

  order.addItem(new OrderItem('item-1', burger.getName(), 2, new Date(), '1x Sem picles', burger, burgerRecipe));
  order.addItem(new OrderItem('item-2', fries.getName(), 2, new Date(), '', fries, friesRecipe));
  order.addItem(new OrderItem('item-3', soda.getName(), 1, new Date(), 'Com Gelo', soda));

  return order;
};

export default function App() {
  const [fontsLoaded] = useFonts({
    Lexend_100Thin,
    Lexend_200ExtraLight,
    Lexend_300Light,
    Lexend_400Regular,
    Lexend_500Medium,
    Lexend_600SemiBold,
    Lexend_700Bold,
    Lexend_800ExtraBold,
    Lexend_900Black,
  });

  // Estado do pedido atualmente selecionado no workspace principal
  const [activeOrder, setActiveOrder] = useState<Order | null>(createMockOrder('ord-101', 101));

  // Estado da lista geral com 6 pedidos de exemplo para preencher a grid de 3 colunas
  const [allOrders, setAllOrders] = useState<Order[]>([
    createMockOrder('ord-101', 101),
    createMockOrder('ord-102', 102),
    createMockOrder('ord-103', 103),
    createMockOrder('ord-104', 104),
    createMockOrder('ord-105', 105),
    createMockOrder('ord-106', 106),
  ]);

  // Finaliza o pedido atual do ActiveWorkspace
  const handleCompleteOrder = (completedOrder: Order) => {
    completedOrder.advanceStage();
    setActiveOrder(null);
  };

  // Pega um pedido da lista geral e o define como o pedido ativo
  const handleClaimOrder = (orderId: string) => {
    const selected = allOrders.find((order) => order.getId() === orderId);
    if (selected) {
      setActiveOrder(selected);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor='#F07342' />
      <View style={styles.container}>
        <Header />
        <ScrollView contentContainerStyle={styles.content}>
          <ActiveWorkspace
            order={activeOrder}
            onCompleteOrder={handleCompleteOrder}
          />
          <AllOrders
            orders={allOrders}
            onClaimOrder={handleClaimOrder}
          />
        </ScrollView>
      </View>
      <CheckeredBorder primaryColor='#E52E24' secondaryColor='#EAE8E5' />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F07342' },
  container: { flex: 1, backgroundColor: '#EAE8E5' },
  content: { padding: 0 },
});