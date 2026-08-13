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
import { StationPicker } from './src/components/StationPicker/StationPicker';
import { RolePicker, Role } from './src/components/RolePicker/RolePicker';
import { ReceptionWorkspace } from './src/components/ReceptionWorkspace/ReceptionWorkspace';

// Estado global de pedidos
import { OrderProvider, useOrderContext } from './src/context/OrderContext';
import { useStation } from './src/hooks/useStation';

// Tela da cozinha: só pode usar useOrderContext() porque fica dentro do OrderProvider.
// stationNumber vem de fora (do App) porque o OrderProvider também precisa dele.
function KitchenContent({ stationNumber }: { stationNumber: number }) {
  const { activeOrder, allOrders, claimOrder, completeOrder, releaseOrder, deleteOrder } = useOrderContext();

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor='#F07342' />
      <View style={styles.container}>
        <Header stationLabel={`Bancada ${stationNumber}`} />
        <ScrollView contentContainerStyle={styles.content}>

          <ActiveWorkspace
            order={activeOrder}
            onCompleteOrder={completeOrder}
            onReleaseOrder={releaseOrder}
            onDeleteOrder={deleteOrder}
          />

          <AllOrders
            orders={allOrders}
            onClaimOrder={claimOrder}
          />

          <View style={styles.footerWrapper}>
            <CheckeredBorder primaryColor='#ED4545' secondaryColor='#EAE8E5' />
          </View>

        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

// Tela da recepção: sem bancada, só cria pedido e acompanha a fila.
// Não consegue pegar nem concluir pedido — isso é só da cozinha.
function ReceptionContent() {
  const { allOrders, createOrder } = useOrderContext();

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor='#F07342' />
      <View style={styles.container}>
        <Header stationLabel="Recepção" />
        <ScrollView contentContainerStyle={styles.content}>

          <ReceptionWorkspace onCreateOrder={createOrder} />

          <AllOrders orders={allOrders} />

          <View style={styles.footerWrapper}>
            <CheckeredBorder primaryColor='#ED4545' secondaryColor='#EAE8E5' />
          </View>

        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

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

  // Escolha travada assim que a pessoa entra: recepção não vê cozinha, e vice-versa.
  const [role, setRole] = useState<Role | null>(null);
  const { stationNumber, occupiedStations, isConnecting, selectStation } = useStation();

  if (role === null) {
    return <RolePicker onSelect={setRole} />;
  }

  if (role === 'recepcao') {
    return (
      <OrderProvider stationNumber={null}>
        <ReceptionContent />
      </OrderProvider>
    );
  }

  // A partir daqui, role === 'cozinha': ainda falta escolher a bancada.
  if (isConnecting) {
    return null;
  }

  if (stationNumber === null) {
    return <StationPicker occupiedStations={occupiedStations} onSelect={selectStation} />;
  }

  return (
    <OrderProvider stationNumber={stationNumber}>
      <KitchenContent stationNumber={stationNumber} />
    </OrderProvider>
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
