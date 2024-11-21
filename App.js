import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

// Import Screens
import HomeScreen from './screens/HomeScreen';
import StockScreen from './screens/StockScreen';
import AddProductScreen from './screens/AddProductScreen'; // New Add Product Screen
import VehicleScreen from './screens/VehicleScreen';
import VehicleDetailsScreen from './screens/VehicleDetailsScreen';
import SalesReportScreen from './screens/SalesReportScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Stock Stack Navigator
function StockStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="StockMain" 
        component={StockScreen} 
        options={{ title: 'Stock Management' }}
      />
      <Stack.Screen 
        name="AddProduct" 
        component={AddProductScreen} 
        options={{ title: 'Add New Product' }}
      />
    </Stack.Navigator>
  );
}

// Vehicle Stack Navigator
function VehicleStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="VehicleMain" 
        component={VehicleScreen} 
        options={{ title: 'Vehicle Details' }}
      />
      <Stack.Screen 
        name="VehicleDetails" 
        component={VehicleDetailsScreen} 
        options={{ title: 'Vehicle Specific Details' }}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;
              if (route.name === 'Home') {
                iconName = focused ? 'home' : 'home-outline';
              } else if (route.name === 'Stock') {
                iconName = focused ? 'list' : 'list-outline';
              } else if (route.name === 'Vehicles') {
                iconName = focused ? 'car' : 'car-outline';
              } else if (route.name === 'Sales') {
                iconName = focused ? 'stats-chart' : 'stats-chart-outline';
              }
              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: 'blue',
            tabBarInactiveTintColor: 'gray',
          })}
        >
          <Tab.Screen name="Home" component={HomeScreen} />
          <Tab.Screen name="Stock" component={StockStackNavigator} />
          <Tab.Screen name="Vehicles" component={VehicleStackNavigator} />
          <Tab.Screen name="Sales" component={SalesReportScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
