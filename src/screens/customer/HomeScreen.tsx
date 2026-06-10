import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen({ navigation }: any) {
  const [userRole, setUserRole] = useState('customer');

  useEffect(() => {
    const loadRole = async () => {
      const userData = await AsyncStorage.getItem('userData');
      if (userData) {
        const user = JSON.parse(userData);
        setUserRole(user.role || 'customer');
      }
    };
    loadRole();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('userData');
    navigation.replace('Login');
  };

  const navigateToRoleScreen = () => {
    if (userRole === 'rider') navigation.navigate('RiderDashboard');
    else if (userRole === 'restaurant') navigation.navigate('RestaurantDashboard');
    else if (userRole === 'admin') navigation.navigate('AdminDashboard');
    else navigation.navigate('Orders');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Wasallni!</Text>
      <Text style={styles.subtitle}>Role: {userRole}</Text>

      <TouchableOpacity style={styles.mainButton} onPress={navigateToRoleScreen}>
        <Text style={styles.mainButtonText}>
          {userRole === 'rider' ? '🚚 My Deliveries' :
           userRole === 'restaurant' ? '🍽️ Manage Orders' :
           userRole === 'admin' ? '📊 Admin Panel' : '📦 My Orders'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.navigate('Profile')}>
        <Text style={styles.secondaryButtonText}>👤 Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#FF6B35', marginBottom: 10 },
  subtitle: { fontSize: 16, color: '#666', marginBottom: 40, textTransform: 'capitalize' },
  mainButton: { backgroundColor: '#FF6B35', padding: 16, borderRadius: 12, width: '100%', alignItems: 'center', marginBottom: 15 },
  mainButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  secondaryButton: { backgroundColor: '#3B82F6', padding: 16, borderRadius: 12, width: '100%', alignItems: 'center', marginBottom: 15 },
  secondaryButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  logoutButton: { padding: 12, width: '100%', alignItems: 'center' },
  logoutText: { fontSize: 16, color: '#EF4444' },
});