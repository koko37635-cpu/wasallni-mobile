import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../services/api';

export default function ProfileScreen({ navigation }: any) {
  const [user, setUser] = useState<any>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await api.get('/auth/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data);
      setName(response.data.name);
      setEmail(response.data.email);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Name is required');
      return;
    }
    setSaving(true);
    try {
      const token = await AsyncStorage.getItem('token');
      await api.put('/auth/profile', { name, email }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      Alert.alert('Success', 'Profile updated successfully');
      fetchProfile();
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    navigation.replace('Login');
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
      <Text style={styles.headerTitle}>My Profile</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Enter your name"
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={[styles.input, styles.disabledInput]}
          value={email}
          editable={false}
        />

        <Text style={styles.label}>Role</Text>
        <Text style={styles.roleText}>{user?.role || 'customer'}</Text>

        <TouchableOpacity style={styles.saveButton} onPress={handleUpdate} disabled={saving}>
          <Text style={styles.saveButtonText}>{saving ? 'Saving...' : 'Save Changes'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#1F2937', padding: 20, paddingBottom: 10 },
  card: { backgroundColor: '#FFFFFF', margin: 20, padding: 20, borderRadius: 16 },
  label: { fontSize: 14, fontWeight: '500', color: '#374151', marginBottom: 8, marginTop: 16 },
  input: { borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, padding: 12, fontSize: 16, backgroundColor: '#FFFFFF' },
  disabledInput: { backgroundColor: '#F3F4F6', color: '#9CA3AF' },
  roleText: { fontSize: 16, color: '#FF6B35', fontWeight: '600', textTransform: 'capitalize' },
  saveButton: { backgroundColor: '#FF6B35', padding: 15, borderRadius: 12, alignItems: 'center', marginTop: 24 },
  saveButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  logoutButton: { backgroundColor: '#F3F4F6', padding: 15, borderRadius: 12, alignItems: 'center', marginTop: 12 },
  logoutButtonText: { color: '#EF4444', fontSize: 16, fontWeight: '600' },
});