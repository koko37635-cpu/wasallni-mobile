import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import api from '../../services/api';

export default function AdminDashboardScreen() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    pendingPayouts: 0,
    totalPaid: 0,
    totalShipments: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [summaryRes, shipmentsRes] = await Promise.all([
        api.get('/accounting/summary'),
        api.get('/shipments')
      ]);
      setStats({
        totalRevenue: summaryRes.data.totalRevenue || 0,
        pendingPayouts: summaryRes.data.pendingPayouts || 0,
        totalPaid: summaryRes.data.totalPaid || 0,
        totalShipments: shipmentsRes.data.length || 0
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#FF6B35" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.headerTitle}>Admin Dashboard</Text>

      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.totalShipments}</Text>
          <Text style={styles.statLabel}>Total Orders</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.totalRevenue} SAR</Text>
          <Text style={styles.statLabel}>Revenue</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.pendingPayouts} SAR</Text>
          <Text style={styles.statLabel}>Pending Payouts</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.totalPaid} SAR</Text>
          <Text style={styles.statLabel}>Paid to Riders</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#1F2937', padding: 20, paddingBottom: 10 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', padding: 10, justifyContent: 'space-between' },
  statCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 20, width: '48%', marginBottom: 15, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  statValue: { fontSize: 24, fontWeight: 'bold', color: '#FF6B35' },
  statLabel: { fontSize: 14, color: '#6B7280', marginTop: 8 },
});