import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../services/api';

interface Shipment {
  id: number;
  tracking_number: string;
  pickup_address: string;
  delivery_address: string;
  status: string;
  price: string;
  customer_name: string;
}

export default function RiderDashboardScreen({ navigation }: any) {
  const [assignedShipments, setAssignedShipments] = useState<Shipment[]>([]);
  const [availableShipments, setAvailableShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [riderId, setRiderId] = useState<number | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const userData = await AsyncStorage.getItem('userData');
      const user = userData ? JSON.parse(userData) : null;
      const id = user?.id || 1;
      setRiderId(id);

      const [assignedRes, availableRes] = await Promise.all([
        api.get(`/shipments/rider/${id}`),
        api.get('/shipments?status=pending')
      ]);

      setAssignedShipments(assignedRes.data);
      setAvailableShipments(availableRes.data.filter((s: Shipment) => !s.rider_id));
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const acceptShipment = async (shipmentId: number) => {
    Alert.alert('Accept Order', 'Do you want to accept this delivery?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Accept',
        onPress: async () => {
          try {
            await api.put(`/shipments/${shipmentId}/assign`, { rider_id: riderId });
            await loadData();
            Alert.alert('Success', 'Order assigned to you');
          } catch (error) {
            Alert.alert('Error', 'Failed to accept order');
          }
        }
      }
    ]);
  };

  const updateStatus = async (shipmentId: number, status: string) => {
    try {
      await api.patch(`/shipments/${shipmentId}/status`, { status });
      await loadData();
      Alert.alert('Success', `Order marked as ${status}`);
    } catch (error) {
      Alert.alert('Error', 'Failed to update status');
    }
  };

  const renderShipment = (item: Shipment, type: 'assigned' | 'available') => (
    <View key={item.id} style={styles.orderCard}>
      <Text style={styles.trackingNumber}>{item.tracking_number}</Text>
      <Text style={styles.addressText}>📍 {item.pickup_address}</Text>
      <Text style={styles.addressText}>🏠 {item.delivery_address}</Text>
      <Text style={styles.priceText}>{item.price} SAR</Text>

      {type === 'assigned' && (
        <View style={styles.buttonGroup}>
          {item.status === 'assigned' && (
            <TouchableOpacity style={[styles.statusButton, styles.pickupButton]} onPress={() => updateStatus(item.id, 'in_transit')}>
              <Text style={styles.buttonText}>Start Delivery</Text>
            </TouchableOpacity>
          )}
          {item.status === 'in_transit' && (
            <TouchableOpacity style={[styles.statusButton, styles.deliverButton]} onPress={() => updateStatus(item.id, 'delivered')}>
              <Text style={styles.buttonText}>Mark Delivered</Text>
            </TouchableOpacity>
          )}
          <Text style={[styles.statusBadge, item.status === 'in_transit' && styles.statusInTransit]}>
            {item.status}
          </Text>
        </View>
      )}

      {type === 'available' && (
        <TouchableOpacity style={styles.acceptButton} onPress={() => acceptShipment(item.id)}>
          <Text style={styles.acceptButtonText}>Accept Order</Text>
        </TouchableOpacity>
      )}
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
      ListHeaderComponent={<Text style={styles.headerTitle}>Rider Dashboard</Text>}
      sections={[
        { title: 'Active Deliveries', data: assignedShipments, type: 'assigned' },
        { title: 'Available Orders', data: availableShipments, type: 'available' }
      ]}
      renderItem={({ item, section }: any) => renderShipment(item, section.type)}
      keyExtractor={(item) => item.id.toString()}
      ListEmptyComponent={<Text style={styles.emptyText}>No orders found</Text>}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  content: { padding: 20 },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#1F2937', marginBottom: 20 },
  orderCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, marginBottom: 16 },
  trackingNumber: { fontSize: 16, fontWeight: 'bold', color: '#1F2937', marginBottom: 8 },
  addressText: { fontSize: 13, color: '#6B7280', marginBottom: 4 },
  priceText: { fontSize: 16, fontWeight: 'bold', color: '#FF6B35', marginTop: 8 },
  buttonGroup: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 },
  statusButton: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8, flex: 1, marginRight: 8, alignItems: 'center' },
  pickupButton: { backgroundColor: '#3B82F6' },
  deliverButton: { backgroundColor: '#10B981' },
  acceptButton: { backgroundColor: '#10B981', padding: 12, borderRadius: 8, alignItems: 'center', marginTop: 12 },
  acceptButtonText: { color: '#FFFFFF', fontWeight: '600' },
  buttonText: { color: '#FFFFFF', fontWeight: '600' },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, backgroundColor: '#F3F4F6', color: '#6B7280' },
  statusInTransit: { backgroundColor: '#FEF3C7', color: '#D97706' },
  emptyText: { textAlign: 'center', color: '#9CA3AF', marginTop: 40 },
});