import React, { useState } from 'react';
import { useFonts } from 'expo-font';
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
import { Employee } from './src/models/employee/Employee';
import { FoodItem } from './src/models/menu/FoodItem';
import { DrinkItem } from './src/models/menu/DrinkItem';
import { OrderItem } from './src/models/OrderItem';
import { Ingredient } from './src/models/kitchen/Ingredient';
import { Recipe } from './src/models/kitchen/Recipe';

// Usuário atual logado na aplicação (Simulação)
const currentUser: Employee = new Cook('emp-99', 'Funcionário #1', 5, 'Manhã');

// Função auxiliar para montar um pedido inicial de teste
const createMockOrder = (id: string, code: number, deadline: number, assignedEmployee?: Employee): Order => {
  const address = new Address('Rua Principal', 100, '13730-000', 'Apto 12');
  const customer = new Customer('cust-101', 'João Silva', '(19) 98765-4321');
  customer.addAddress(address);

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
  const kitchenDeadlineDate = new Date(now.getTime() + deadline * 60000); // tempo limite do pedido

  const order = new Order(
    id,
    code,
    OrderOriginEnum.PRESENTIAL,
    kitchenDeadlineDate,
    kitchenDeadlineDate,
    new Date(now.getTime() + (deadline + 15) * 60000),
    deadline,
    customer,
    tableService,
    assignedEmployee,
    now,
  );

  order.addItem(new OrderItem('item-1', burger.getName(), 2, new Date(), '1x Sem picles', burger, burgerRecipe));
  order.addItem(new OrderItem('item-2', fries.getName(), 2, new Date(), '', fries, friesRecipe));
  order.addItem(new OrderItem('item-3', soda.getName(), 1, new Date(), 'Com Gelo', soda));

  return order;
};

// Pedido inicial do ActiveWorkspace (já atribuído ao usuário atual)
const initialActiveOrder = createMockOrder('ord-101', 101, 5, currentUser);

// Exemplo de outro funcionário para testar a indicação no botão
const otherCook = new Cook('emp-2', 'Funcionário #2', 3, 'Tarde');

export default function App() {
  const [fontsLoaded] = useFonts({
    'Lexend': require('./src/assets/fonts/Lexend.ttf'),
    'MaterialSymbolsRounded': require('./src/assets/fonts/MaterialSymbolsRounded-Regular.ttf'),
    'MaterialSymbolsRoundedFilled': require('./src/assets/fonts/MaterialSymbolsRounded_Filled-Regular.ttf'),
  });

  // Estado do pedido atualmente selecionado no workspace principal
  const [activeOrder, setActiveOrder] = useState<Order | null>(initialActiveOrder);

  // Lista geral de pedidos
  const [allOrders, setAllOrders] = useState<Order[]>([
    initialActiveOrder,                             // Em Andamento (usuário atual)
    createMockOrder('ord-102', 102, 10, otherCook),     // Atribuído a outro funcionário ("Chef Roberto")
    createMockOrder('ord-103', 103, 7),                 // Disponível ("Pegar Pedido")
    createMockOrder('ord-104', 104, 20),                 // Disponível ("Pegar Pedido")
    createMockOrder('ord-105', 105, 9),                 // Disponível ("Pegar Pedido")
    createMockOrder('ord-106', 106, 30),                 // Disponível ("Pegar Pedido")
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
      selected.setAssignedEmployee(currentUser);

      // 🚀 O SEGREDO ESTÁ AQUI: Dispara o timer do pedido no MOMENTO do clique!
      selected.startKitchenTimer();

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
            key={activeOrder ? activeOrder.getId() : 'no-active-order'}
            order={activeOrder}
            onCompleteOrder={handleCompleteOrder}
          />

          <AllOrders
            orders={allOrders}
            activeOrder={activeOrder}
            currentUser={currentUser}
            onClaimOrder={handleClaimOrder}
          />

          <View style={styles.footerWrapper}>
            <CheckeredBorder primaryColor='#ED4545' />
          </View>

        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F07342'
  },
  container: {
    flex: 1,
    backgroundColor: '#EAE8E5'
  },
  content: {
    flexGrow: 1,
  },
  footerWrapper: {
    flexGrow: 1,
    justifyContent: 'flex-end',
  }
});