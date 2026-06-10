import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { useRoute } from '@react-navigation/native';
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

export default function TrackingScreen() {
  const route = useRoute();
  const { orderId } = route.params as { orderId: number };
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, []);

  const fetchOrder = async () => {
    try {
      const response = await api.get(`/shipments/${orderId}`);
      setOrder(response.data);
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusStep = (status: string) => {
    const steps = ['pending', 'assigned', 'in_transit', 'delivered'];
    return steps.indexOf(status);
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#FF6B35" />
      </View>
    );
  }

  if (!order) {
    return (
      <View style={styles.centerContainer}>
        <Text>Order not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.headerTitle}>Track Order</Text>
      <Text style={styles.trackingNumber}>{order.tracking_number}</Text>

      {/* Status Timeline */}
      <View style={styles.timeline}>
        <View style={[styles.timelineStep, getStatusStep(order.status) >= 0 && styles.timelineStepActive]}>
          <View style={[styles.timelineDot, getStatusStep(order.status) >= 0 && styles.timelineDotActive]} />
          <Text style={[styles.timelineText, getStatusStep(order.status) >= 0 && styles.timelineTextActive]}>Pending</Text>
        </View>
        <View style={[styles.timelineLine, getStatusStep(order.status) >= 1 && styles.timelineLineActive]} />
        
        <View style={[styles.timelineStep, getStatusStep(order.status) >= 1 && styles.timelineStepActive]}>
          <View style={[styles.timelineDot, getStatusStep(order.status) >= 1 && styles.timelineDotActive]} />
          <Text style={[styles.timelineText, getStatusStep(order.status) >= 1 && styles.timelineTextActive]}>Assigned</Text>
        </View>
        <View style={[styles.timelineLine, getStatusStep(order.status) >= 2 && styles.timelineLineActive]} />
        
        <View style={[styles.timelineStep, getStatusStep(order.status) >= 2 && styles.timelineStepActive]}>
          <View style={[styles.timelineDot, getStatusStep(order.status) >= 2 && styles.timelineDotActive]} />
          <Text style={[styles.timelineText, getStatusStep(order.status) >= 2 && styles.timelineTextActive]}>In Transit</Text>
        </View>
        <View style={[styles.timelineLine, getStatusStep(order.status) >= 3 && styles.timelineLineActive]} />
        
        <View style={[styles.timelineStep, getStatusStep(order.status) >= 3 && styles.timelineStepActive]}>
          <View style={[styles.timelineDot, getStatusStep(order.status) >= 3 && styles.timelineDotActive]} />
          <Text style={[styles.timelineText, getStatusStep(order.status) >= 3 && styles.timelineTextActive]}>Delivered</Text>
        </View>
      </View>

      {/* Order Details */}
      <View style={styles.detailsCard}>
        <Text style={styles.detailsTitle}>Order Details</Text>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>From:</Text>
          <Text style={styles.detailValue}>{order.pickup_address}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>To:</Text>
          <Text style={styles.detailValue}>{order.delivery_address}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Customer:</Text>
          <Text style={styles.detailValue}>{order.customer_name}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Total:</Text>
          <Text style={[styles.detailValue, styles.price]}>{order.price} SAR</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#1F2937', padding: 20, paddingBottom: 10 },
  trackingNumber: { fontSize: 14, color: '#6B7280', paddingHorizontal: 20, marginBottom: 20 },
  timeline: { backgroundColor: '#FFFFFF', margin: 20, padding: 20, borderRadius: 16, flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center' },
  timelineStep: { alignItems: 'center', flex: 1 },
  timelineStepActive: { opacity: 1 },
  timelineDot: { width: 16, height: 16, borderRadius: 8, backgroundColor: '#E5E7EB', marginBottom: 8 },
  timelineDotActive: { backgroundColor: '#FF6B35' },
  timelineText: { fontSize: 11, color: '#9CA3AF', textAlign: 'center' },
  timelineTextActive: { color: '#FF6B35', fontWeight: '600' },
  timelineLine: { width: 30, height: 2, backgroundColor: '#E5E7EB', flex: 0.5 },
  timelineLineActive: { backgroundColor: '#FF6B35' },
  detailsCard: { backgroundColor: '#FFFFFF', margin: 20, padding: 20, borderRadius: 16 },
  detailsTitle: { fontSize: 18, fontWeight: 'bold', color: '#1F2937', marginBottom: 16 },
  detailRow: { flexDirection: 'row', marginBottom: 12 },
  detailLabel: { width: 80, fontSize: 14, color: '#6B7280' },
  detailValue: { flex: 1, fontSize: 14, color: '#1F2937' },
  price: { fontWeight: 'bold', color: '#FF6B35' },
});