import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../services/api';

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    console.log('🔵 Login button clicked!');
    console.log('📧 Email:', email);
    console.log('🔒 Password:', password);
    
    if (!email || !password) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }
    setLoading(true);
    try {
      console.log('🔄 Sending request to API...');
      const response = await api.post('/auth/login', { email, password });
      console.log('✅ Response:', response.data);
      await AsyncStorage.setItem('token', response.data.token);
      navigation.replace('Home');  // <-- أضف هذا السطر
      Alert.alert('Success', 'Logged in successfully');
    } catch (error: any) {
      console.log('❌ Error:', error.response?.data || error.message);
      Alert.alert('Login Failed', error.response?.data?.error || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Wasallni</Text>
      <Text style={styles.subtitle}>Delivery App</Text>

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

      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        {loading ? <ActivityIndicator color="white" /> : <Text style={styles.buttonText}>Login</Text>}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.link}>Don't have an account? Register</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 32, fontWeight: 'bold', textAlign: 'center', color: '#FF6B35', marginBottom: 10 },
  subtitle: { fontSize: 16, textAlign: 'center', color: '#666', marginBottom: 40 },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 12, borderRadius: 10, marginBottom: 15, fontSize: 16 },
  button: { backgroundColor: '#FF6B35', padding: 15, borderRadius: 10, alignItems: 'center' },
  buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  link: { textAlign: 'center', marginTop: 20, color: '#FF6B35' },
});