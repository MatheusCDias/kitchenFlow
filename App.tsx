import React, { useState } from 'react';
import { useFonts } from 'expo-font';
import { StyleSheet, View, SafeAreaView, StatusBar, ScrollView } from 'react-native';
import { Header, ViewMode } from './src/components/Header/Header';
import { Kitchen } from './src/pages/Kitchen/Kitchen';
import { Reception } from './src/pages/Reception/Reception';
import { CheckeredBorder } from './src/components/Patterns/CheckeredBorder';
import { Cook } from './src/models/employee/Cook';
import { useOrders } from './src/hooks/useOrders';
import { RolePicker, Role } from './src/pages/RolePicker/RolePicker'; // Importe o RolePicker

const currentUser = new Cook('emp-99', 'Funcionário #1', 5, 'Manhã');

export default function App() {
  const [fontsLoaded] = useFonts({
    'Lexend': require('./src/assets/fonts/Lexend.ttf'),
    'MaterialSymbolsRounded': require('./src/assets/fonts/MaterialSymbolsRounded-Regular.ttf'),
    'MaterialSymbolsRoundedFilled': require('./src/assets/fonts/MaterialSymbolsRounded_Filled-Regular.ttf'),
  });

  // Estado para controlar a bancada selecionada no início
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  // Mapeia Role para o formato esperado pelo Header (ViewMode)
  const [viewMode, setViewMode] = useState<ViewMode>('cozinha');

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

  // Ao selecionar no RolePicker, define a bancada inicial e o viewMode correspondente
  const handleSelectRole = (role: Role) => {
    setSelectedRole(role);
    setViewMode(role); // Passa 'cozinha' ou 'recepcao' diretamente!
  };

  // Se nenhuma bancada foi escolhida ainda, exibe a tela inicial de seleção
  if (!selectedRole) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor="#F07342" />
        <RolePicker onSelect={handleSelectRole} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#F07342" />
      <View style={styles.container}>
        <Header
          activeMode={viewMode}
          onModeChange={setViewMode}
        />
        <ScrollView contentContainerStyle={styles.content}>
          {viewMode === 'cozinha' ? (
            <Kitchen
              orders={allOrders}
              activeOrder={activeOrder}
              currentUser={currentUser}
              onClaimOrder={claimOrder}
              onCompleteOrder={completeOrder}
              onCancelOrder={cancelOrder}
            />
          ) : (
            <Reception orders={allOrders} />
          )}

          <View style={styles.footerWrapper}>
            <CheckeredBorder primaryColor="#ED4545" />
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F07342',
  },
  container: {
    flex: 1,
    backgroundColor: '#EAE8E5',
  },
  content: {
    flexGrow: 1,
  },
  footerWrapper: {
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
});