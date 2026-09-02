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

export default function App() {
  const [fontsLoaded] = useFonts({
    'Lexend': require('./src/assets/fonts/Lexend.ttf'),
    'MaterialSymbolsRounded': require('./src/assets/fonts/MaterialSymbolsRounded-Regular.ttf'),
    'MaterialSymbolsRoundedFilled': require('./src/assets/fonts/MaterialSymbolsRounded_Filled-Regular.ttf'),
  });

  useEffect(() => {
    initDatabase();
  }, []);

  // 1. Estados de usuário, papel e visualização
  const [currentUser, setCurrentUser] = useState<Employee | null>(null);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('cozinha');

  // 2. Modais
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [isMenuManagerOpen, setIsMenuManagerOpen] = useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  // 3. Hook de pedidos (recebe o usuário atual dinâmico)
  const {
    activeOrder,
    allOrders,
    addOrder,
    claimOrder,
    completeOrder,
    cancelOrder,
    getNextOrderCode,
  } = useOrders(currentUser || undefined);

  // 4. Tratamento das opções do menu lateral
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
      setIsChangePasswordModalOpen(true); // <-- Abre o modal de alterar senha
    } else if (option === 'Sair') {
      setCurrentUser(null);
      setSelectedRole(null);
    }
  };

  // 5. Recebe o cargo e o usuário instanciado (Admin ou Employee) vindos do RolePicker
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

  // Se nenhum setor/usuário estiver logado, exibe a tela de RolePicker
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
          onModeChange={setViewMode}
          onSelectMenuOption={handleSelectMenuOption}
          currentUser={currentUser} // Passa o usuário para o Header repassar ao FloatingMenu
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
            <Reception
              orders={allOrders}
              onAddOrder={addOrder}
              getNextOrderCode={getNextOrderCode}
            />
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