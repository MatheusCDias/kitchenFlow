import React, { useEffect, useMemo, useState } from 'react';
import { useFonts } from 'expo-font';
import { StyleSheet, View, SafeAreaView, StatusBar, ScrollView } from 'react-native';
import { Header } from './src/components/Header/Header';
import { Kitchen } from './src/pages/Kitchen/Kitchen';
import { Reception } from './src/pages/Reception/Reception';
import { CheckeredBorder } from './src/components/Patterns/CheckeredBorder';
import { Cook } from './src/models/employee/Cook';
import { useOrders } from './src/hooks/useOrders';
import { RolePicker, Role } from './src/pages/RolePicker/RolePicker';
import { StationPicker } from './src/pages/StationPicker/StationPicker';
import { initDatabase } from './src/services/db';
import { EmployeeManagerModal } from './src/components/Modals/EmployeeManagerModal';
import { MenuManagerModal } from './src/components/Modals/MenuManagerModal';
import { SERVER_URL } from './src/services/config';
import { heartbeatStationRequest, releaseStationRequest } from './src/services/api';

// De quanto em quanto tempo avisa o servidor que a bancada ainda está em
// uso — precisa ser bem menor que o tempo de expiração no backend (15s),
// pra uma falha isolada de rede não derrubar a posse à toa.
const STATION_HEARTBEAT_MS = 5000;

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

  // Escolha travada assim que a pessoa entra: nenhum dos dois pode trocar
  // de aba depois — só recarregando a página, o que faz perguntar de novo.
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [stationNumber, setStationNumber] = useState<number | null>(null);

  // Identifica essa aba/sessão perante o servidor — é o que permite
  // renovar (heartbeat) e liberar a própria bancada sem mexer na de outra
  // pessoa. Criado uma única vez por carregamento do app.
  const [holderId] = useState(
    () => `holder-${Date.now()}-${Math.random().toString(36).slice(2)}`,
  );

  // Enquanto essa aba estiver com uma bancada aberta, renova a posse dela
  // periodicamente no servidor — e tenta avisar quando sai (fecha/recarrega
  // a aba) pra liberar a bancada mais rápido pra outra pessoa. Se o aviso
  // não chegar (fechou à força, caiu a rede), o servidor libera sozinho
  // depois de alguns segundos sem heartbeat.
  useEffect(() => {
    if (stationNumber === null) return;

    const interval = setInterval(() => {
      heartbeatStationRequest(stationNumber, holderId).catch(() => {});
    }, STATION_HEARTBEAT_MS);

    const releaseBeacon = () => {
      if (typeof navigator === 'undefined' || !navigator.sendBeacon) return;
      const body = new Blob([JSON.stringify({ holderId })], { type: 'application/json' });
      navigator.sendBeacon(`${SERVER_URL}/stations/${stationNumber}/release`, body);
    };
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', releaseBeacon);
    }

    return () => {
      clearInterval(interval);
      if (typeof window !== 'undefined') {
        window.removeEventListener('beforeunload', releaseBeacon);
      }
      releaseStationRequest(stationNumber, holderId).catch(() => {});
    };
  }, [stationNumber, holderId]);

  // A bancada escolhida É a identidade do funcionário logado — reconstrói o
  // Cook só quando a bancada muda, pra não perder memoização à toa.
  const currentUser = useMemo(() => {
    if (stationNumber === null) return undefined;
    return new Cook(`station-${stationNumber}`, `Bancada ${stationNumber}`, stationNumber, 'Manhã');
  }, [stationNumber]);

  const {
    activeOrder,
    allOrders,
    claimOrder,
    completeOrder,
    cancelOrder,
    createOrder,
    getNextOrderCode,
  } = useOrders(currentUser);

  if (!fontsLoaded) {
    return null;
  }

  if (!selectedRole) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor="#F07342" />
        <RolePicker onSelect={setSelectedRole} />
      </SafeAreaView>
    );
  }

  // Escolher Cozinha exige também dizer qual bancada — Recepção não precisa.
  if (selectedRole === 'cozinha' && stationNumber === null) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor="#F07342" />
        <StationPicker holderId={holderId} onSelect={setStationNumber} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#F07342" />
      <View style={styles.container}>
        <Header
          activeMode={selectedRole}
          stationLabel={stationNumber !== null ? `Bancada ${stationNumber}` : undefined}
          onSelectMenuOption={handleSelectMenuOption}
        />
        <ScrollView contentContainerStyle={styles.content}>
          {selectedRole === 'cozinha' ? (
            <Kitchen
              orders={allOrders}
              activeOrder={activeOrder}
              // Garantido: só chega aqui depois da StationPicker preencher a bancada.
              currentUser={currentUser!}
              onClaimOrder={claimOrder}
              onCompleteOrder={completeOrder}
              onCancelOrder={cancelOrder}
            />
          ) : (
            <Reception
              orders={allOrders}
              createOrder={createOrder}
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