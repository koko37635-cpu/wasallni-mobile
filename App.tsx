import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './src/screens/auth/LoginScreen';
import RegisterScreen from './src/screens/auth/RegisterScreen';
import HomeScreen from './src/screens/customer/HomeScreen';
import OrdersScreen from './src/screens/customer/OrdersScreen';
import TrackingScreen from './src/screens/customer/TrackingScreen';
import ProfileScreen from './src/screens/customer/ProfileScreen';
import RiderDashboardScreen from './src/screens/rider/RiderDashboardScreen';
import RestaurantDashboardScreen from './src/screens/restaurant/RestaurantDashboardScreen';
import AdminDashboardScreen from './src/screens/admin/AdminDashboardScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Orders" component={OrdersScreen} />
        <Stack.Screen name="Tracking" component={TrackingScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="RiderDashboard" component={RiderDashboardScreen} />
        <Stack.Screen name="RestaurantDashboard" component={RestaurantDashboardScreen} />
        <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}