import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { OrderItem } from './src/models/OrderItem';
import { OrderStateEnum } from './src/enums/OrderStateEnum';

export default function App() {
  const newOrderItem = new OrderItem('1', 'Gourmet Burger', 2, 'No onions');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Kitchen Flow</Text>
      <Text style={styles.subtitle}>PET-TEC</Text>

      <View style={styles.card}>
        <Text style={styles.boldText}>Order Created:</Text>
        <Text style={styles.detailsText}>{newOrderItem.details}</Text>
        <Text style={styles.status}>
          Initial State: <Text style={styles.statusValue}>{OrderStateEnum.RECEIVED}</Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EAE8E5',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    width: '100%',
    maxWidth: 320,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  boldText: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
    color: '#444',
  },
  detailsText: {
    fontSize: 15,
    color: '#555',
    marginBottom: 12,
  },
  status: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  statusValue: {
    color: '#007AFF',
    fontWeight: 'bold',
  }
});