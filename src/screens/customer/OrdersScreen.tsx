import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../services/api';

interface Order {
  id: number;
  tracking_number: string;
  customer_name: string;
  pickup_address: string;
  delivery_address: string;
  status: string;
  price: string;
  created_at: string;
}

export default function OrdersScreen({ navigation }: any) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/shipments');
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return '#10B981';
      case 'in_transit': return '#3B82F6';
      case 'pending': return '#F59E0B';
      default: return '#6B7280';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'delivered': return 'Delivered';
      case 'in_transit': return 'In Transit';
      case 'pending': return 'Pending';
      default: return status;
    }
  };

  const renderOrder = ({ item }: { item: Order }) => (
    <TouchableOpacity 
      style={styles.orderCard}
      onPress={() => navigation.navigate('Tracking', { orderId: item.id })}
    >
      <View style={styles.orderHeader}>
        <Text style={styles.trackingNumber}>{item.tracking_number}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {getStatusText(item.status)}
          </Text>
        </View>
      </View>
      
      <View style={styles.orderDetails}>
        <Text style={styles.addressText}>📍 {item.pickup_address}</Text>
        <Text style={styles.addressArrow}>↓</Text>
        <Text style={styles.addressText}>🏠 {item.delivery_address}</Text>
      </View>
      
      <View style={styles.orderFooter}>
        <Text style={styles.priceText}>{item.price} SAR</Text>
        <Text style={styles.dateText}>{new Date(item.created_at).toLocaleDateString()}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#FF6B35" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>My Orders</Text>
      
      {orders.length === 0 ? (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>No orders yet</Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          renderItem={renderOrder}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#1F2937', padding: 20, paddingBottom: 10 },
  listContent: { paddingHorizontal: 20, paddingBottom: 20 },
  orderCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  orderHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  trackingNumber: { fontSize: 16, fontWeight: 'bold', color: '#1F2937' },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  statusText: { fontSize: 12, fontWeight: '600' },
  orderDetails: { borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#F3F4F6', paddingVertical: 12, marginBottom: 12 },
  addressText: { fontSize: 13, color: '#4B5563', marginVertical: 2 },
  addressArrow: { textAlign: 'center', fontSize: 16, color: '#9CA3AF', marginVertical: 2 },
  orderFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  priceText: { fontSize: 16, fontWeight: 'bold', color: '#FF6B35' },
  dateText: { fontSize: 12, color: '#9CA3AF' },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontSize: 16, color: '#9CA3AF' },
});