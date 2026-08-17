import React from 'react';
import { useFonts } from 'expo-font';
import { StyleSheet, View, SafeAreaView, StatusBar, ScrollView } from 'react-native';
import { Header } from './src/components/Header/Header';
import { ActiveWorkspace } from './src/components/ActiveWorkspace/ActiveWorkspace';
import { AllOrders } from './src/components/AllOrders/AllOrders';
import { CheckeredBorder } from './src/components/Patterns/CheckeredBorder';
import { Cook } from './src/models/employee/Cook';
import { useOrders } from './src/hooks/useOrders';

const currentUser = new Cook('emp-99', 'Funcionário #1', 5, 'Manhã');

export default function App() {
  const [fontsLoaded] = useFonts({
    'Lexend': require('./src/assets/fonts/Lexend.ttf'),
    'MaterialSymbolsRounded': require('./src/assets/fonts/MaterialSymbolsRounded-Regular.ttf'),
    'MaterialSymbolsRoundedFilled': require('./src/assets/fonts/MaterialSymbolsRounded_Filled-Regular.ttf'),
  });

  const {
    activeOrder,
    allOrders,
    claimOrder,
    completeOrder,
    cancelOrder,
  } = useOrders(currentUser);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor='#F07342' />
      <View style={styles.container}>
        <Header />
        <ScrollView contentContainerStyle={styles.content}>
          <ActiveWorkspace
            key={activeOrder ? activeOrder.getId() : 'no-active-order'}
            order={activeOrder}
            onCompleteOrder={completeOrder}
            onCancelOrder={cancelOrder}
          />

          <AllOrders
            orders={allOrders}
            activeOrder={activeOrder}
            currentUser={currentUser}
            onClaimOrder={claimOrder}
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