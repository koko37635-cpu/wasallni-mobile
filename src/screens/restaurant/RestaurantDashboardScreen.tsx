import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import api from '../../services/api';

interface Order {
  id: number;
  tracking_number: string;
  customer_name: string;
  pickup_address: string;
  delivery_address: string;
  status: string;
  price: string;
}

export default function RestaurantDashboardScreen() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const response = await api.get('/shipments');
      setOrders(response.data);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId: number, status: string) => {
    try {
      await api.patch(`/shipments/${orderId}/status`, { status });
      await loadOrders();
      Alert.alert('Success', `Order marked as ${status}`);
    } catch (error) {
      Alert.alert('Error', 'Failed to update status');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#F59E0B';
      case 'preparing': return '#3B82F6';
      case 'ready': return '#10B981';
      default: return '#6B7280';
    }
  };

  const renderOrder = ({ item }: { item: Order }) => (
    <View style={styles.orderCard}>
      <Text style={styles.trackingNumber}>{item.tracking_number}</Text>
      <Text style={styles.customerName}>{item.customer_name}</Text>
      <Text style={styles.addressText}>📍 {item.pickup_address}</Text>
      <Text style={styles.priceText}>{item.price} SAR</Text>

      <View style={styles.buttonGroup}>
        {item.status === 'pending' && (
          <TouchableOpacity style={[styles.actionButton, styles.prepareButton]} onPress={() => updateStatus(item.id, 'preparing')}>
            <Text style={styles.buttonText}>Start Preparing</Text>
          </TouchableOpacity>
        )}
        {item.status === 'preparing' && (
          <TouchableOpacity style={[styles.actionButton, styles.readyButton]} onPress={() => updateStatus(item.id, 'ready')}>
            <Text style={styles.buttonText}>Ready for Pickup</Text>
          </TouchableOpacity>
        )}
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>{item.status}</Text>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#FF6B35" />
      </View>
    );
  }

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.content}
      ListHeaderComponent={<Text style={styles.headerTitle}>Restaurant Dashboard</Text>}
      data={orders}
      renderItem={renderOrder}
      keyExtractor={(item) => item.id.toString()}
      ListEmptyComponent={<Text style={styles.emptyText}>No orders yet</Text>}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  content: { padding: 20 },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#1F2937', marginBottom: 20 },
  orderCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, marginBottom: 16 },
  trackingNumber: { fontSize: 16, fontWeight: 'bold', color: '#1F2937' },
  customerName: { fontSize: 14, color: '#6B7280', marginTop: 4 },
  addressText: { fontSize: 13, color: '#6B7280', marginTop: 8 },
  priceText: { fontSize: 16, fontWeight: 'bold', color: '#FF6B35', marginTop: 8 },
  buttonGroup: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 },
  actionButton: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8, flex: 1, marginRight: 8, alignItems: 'center' },
  prepareButton: { backgroundColor: '#3B82F6' },
  readyButton: { backgroundColor: '#10B981' },
  buttonText: { color: '#FFFFFF', fontWeight: '600' },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  statusText: { fontWeight: '600' },
  emptyText: { textAlign: 'center', color: '#9CA3AF', marginTop: 40 },
});