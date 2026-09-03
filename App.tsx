import React, { useEffect, useState } from 'react';
import { useFonts } from 'expo-font';
import { StyleSheet, View, SafeAreaView, StatusBar, ScrollView } from 'react-native';
import { Header, ViewMode } from './src/components/Header/Header';
import { Kitchen } from './src/pages/Kitchen/Kitchen';
import { Reception } from './src/pages/Reception/Reception';
import { CheckeredBorder } from './src/components/Patterns/CheckeredBorder';
import { Employee } from './src/models/employee/Employee';
import { useOrders } from './src/hooks/useOrders';
import { RolePicker, Role } from './src/pages/RolePicker/RolePicker';
import { initDatabase } from './src/services/db';
import { EmployeeManagerModal } from './src/components/Modals/EmployeeManagerModal';
import { MenuManagerModal } from './src/components/Modals/MenuManagerModal';
import { ChangePasswordModal } from './src/components/Modals/ChangePasswordModal';
import { Reports } from './src/pages/Reports/Reports';

export default function App() {
  const [fontsLoaded] = useFonts({
    'Lexend': require('./src/assets/fonts/Lexend.ttf'),
    'MaterialSymbolsRounded': require('./src/assets/fonts/MaterialSymbolsRounded-Regular.ttf'),
    'MaterialSymbolsRoundedFilled': require('./src/assets/fonts/MaterialSymbolsRounded_Filled-Regular.ttf'),
  });

  useEffect(() => {
    initDatabase();
  }, []);

  const [currentUser, setCurrentUser] = useState<Employee | null>(null);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('cozinha');

  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [isMenuManagerOpen, setIsMenuManagerOpen] = useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const [isReportsOpen, setIsReportsOpen] = useState(false);

  const {
    activeOrder,
    allOrders,
    addOrder,
    claimOrder,
    completeOrder,
    cancelOrder,
    deleteOrder,
    getNextOrderCode,
  } = useOrders(currentUser || undefined);

  const handleSelectMenuOption = (option: string) => {
    if (
      option === 'Adicionar Funcionário' ||
      option === 'Gerenciar Funcionários' ||
      option === 'Funcionários'
    ) {
      setIsEmployeeModalOpen(true);
    } else if (option === 'Cardápio') {
      setIsMenuManagerOpen(true);
    } else if (option === 'Alterar Senha') {
      setIsChangePasswordModalOpen(true);
    } else if (option === 'Relatórios') {
      setIsReportsOpen(true);
    } else if (option === 'Área de Trabalho') {
      setIsReportsOpen(false);
    } else if (option === 'Sair') {
      setIsReportsOpen(false);
      setCurrentUser(null);
      setSelectedRole(null);
    }
  };

  const handleSelectRole = (role: Role, user?: Employee) => {
    setSelectedRole(role);
    setViewMode(role);
    if (user) {
      setCurrentUser(user);
    }
  };

  if (!fontsLoaded) {
    return null;
  }

  if (!selectedRole || !currentUser) {
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
          onModeChange={(mode) => {
            setIsReportsOpen(false);
            setViewMode(mode);
          }}
          onSelectMenuOption={handleSelectMenuOption}
          currentUser={currentUser}
          showWorkspaceHeader={!isReportsOpen}
        />

        {isReportsOpen ? (
          <Reports onBack={() => setIsReportsOpen(false)} />
        ) : (
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
              <Reception
                orders={allOrders}
                onAddOrder={addOrder}
                getNextOrderCode={getNextOrderCode}
                onCancelOrder={cancelOrder}
                onDeleteOrder={deleteOrder}
              />
            )}

            <View style={styles.footerWrapper}>
              <CheckeredBorder primaryColor="#ED4545" />
            </View>
          </ScrollView>
        )}
      </View>

      <EmployeeManagerModal
        visible={isEmployeeModalOpen}
        onClose={() => setIsEmployeeModalOpen(false)}
      />

      <MenuManagerModal
        visible={isMenuManagerOpen}
        onClose={() => setIsMenuManagerOpen(false)}
      />

      <ChangePasswordModal
        visible={isChangePasswordModalOpen}
        onClose={() => setIsChangePasswordModalOpen(false)}
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