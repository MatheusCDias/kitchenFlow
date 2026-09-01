import React, { useEffect, useState } from 'react';
import { useFonts } from 'expo-font';
import { StyleSheet, View, SafeAreaView, StatusBar, ScrollView } from 'react-native';
import { Header, ViewMode } from './src/components/Header/Header';
import { Kitchen } from './src/pages/Kitchen/Kitchen';
import { Reception } from './src/pages/Reception/Reception';
import { CheckeredBorder } from './src/components/Patterns/CheckeredBorder';
import { Cook } from './src/models/employee/Cook';
import { useOrders } from './src/hooks/useOrders';
import { RolePicker, Role } from './src/pages/RolePicker/RolePicker';
import { initDatabase } from './src/services/db';
import { EmployeeManagerModal } from './src/components/Modals/EmployeeManagerModal';
import { MenuManagerModal } from './src/components/Modals/MenuManagerModal';

const currentUser = new Cook('emp-99', 'Funcionário #1', 'Manhã');

export default function App() {
  const [fontsLoaded] = useFonts({
    'Lexend': require('./src/assets/fonts/Lexend.ttf'),
    'MaterialSymbolsRounded': require('./src/assets/fonts/MaterialSymbolsRounded-Regular.ttf'),
    'MaterialSymbolsRoundedFilled': require('./src/assets/fonts/MaterialSymbolsRounded_Filled-Regular.ttf'),
  });

  useEffect(() => {
    initDatabase();
  }, []);

  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [isMenuManagerOpen, setIsMenuManagerOpen] = useState(false);

  // Função que responde ao clique do FloatingMenu
  const handleSelectMenuOption = (option: string) => {
    if (option === 'Adicionar Funcionário' || option === 'Gerenciar Funcionários' || option === 'Funcionários') {
      setIsEmployeeModalOpen(true);
    } else if (option === 'Cardápio') {
      setIsMenuManagerOpen(true);
    }
  };

  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

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

  const handleSelectRole = (role: Role) => {
    setSelectedRole(role);
    setViewMode(role);
  };

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
          onSelectMenuOption={handleSelectMenuOption}
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

      <EmployeeManagerModal
        visible={isEmployeeModalOpen}
        onClose={() => setIsEmployeeModalOpen(false)}
      />

      <MenuManagerModal
        visible={isMenuManagerOpen}
        onClose={() => setIsMenuManagerOpen(false)}
      />
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