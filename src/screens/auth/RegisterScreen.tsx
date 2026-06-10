import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, ScrollView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../services/api';

export default function RegisterScreen({ navigation }: any) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('customer');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }
    setLoading(true);
    try {
      const response = await api.post('/auth/register', { name, email, password, role });
      await AsyncStorage.setItem('token', response.data.token);
      Alert.alert('Success', 'Account created successfully');
      navigation.replace('Login');
    } catch (error: any) {
      Alert.alert('Registration Failed', error.response?.data?.error || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Wasallni</Text>
      <Text style={styles.subtitle}>Create Account</Text>

      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <View style={styles.roleContainer}>
        <Text style={styles.roleLabel}>Account Type:</Text>
        <View style={styles.roleOptions}>
          <TouchableOpacity
            style={[styles.roleButton, role === 'customer' && styles.roleButtonActive]}
            onPress={() => setRole('customer')}
          >
            <Text style={[styles.roleText, role === 'customer' && styles.roleTextActive]}>Customer</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.roleButton, role === 'restaurant' && styles.roleButtonActive]}
            onPress={() => setRole('restaurant')}
          >
            <Text style={[styles.roleText, role === 'restaurant' && styles.roleTextActive]}>Restaurant</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.roleButton, role === 'rider' && styles.roleButtonActive]}
            onPress={() => setRole('rider')}
          >
            <Text style={[styles.roleText, role === 'rider' && styles.roleTextActive]}>Rider</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
        {loading ? <ActivityIndicator color="white" /> : <Text style={styles.buttonText}>Register</Text>}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>Already have an account? Login</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: 'center', padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 32, fontWeight: 'bold', textAlign: 'center', color: '#FF6B35', marginBottom: 10 },
  subtitle: { fontSize: 16, textAlign: 'center', color: '#666', marginBottom: 40 },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 12, borderRadius: 10, marginBottom: 15, fontSize: 16 },
  button: { backgroundColor: '#FF6B35', padding: 15, borderRadius: 10, alignItems: 'center' },
  buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  link: { textAlign: 'center', marginTop: 20, color: '#FF6B35' },
  roleContainer: { marginBottom: 20 },
  roleLabel: { fontSize: 14, color: '#666', marginBottom: 10 },
  roleOptions: { flexDirection: 'row', gap: 10 },
  roleButton: { flex: 1, padding: 10, borderRadius: 8, borderWidth: 1, borderColor: '#ddd', alignItems: 'center' },
  roleButtonActive: { backgroundColor: '#FF6B35', borderColor: '#FF6B35' },
  roleText: { color: '#666' },
  roleTextActive: { color: 'white' },
});