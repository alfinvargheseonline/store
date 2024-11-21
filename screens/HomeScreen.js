import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = ({ navigation }) => {
  const [stockSummary, setStockSummary] = useState({
    totalProducts: 0,
    totalEarnings: 0,
    recentVehicle: null
  });

  useEffect(() => {
    loadStockSummary();
  }, []);

  const loadStockSummary = async () => {
    try {
      // Fetch stock data from AsyncStorage
      const stockData = await AsyncStorage.getItem('productStock');
      const vehicleData = await AsyncStorage.getItem('vehicles');
      
      const parsedStock = stockData ? JSON.parse(stockData) : [];
      const parsedVehicles = vehicleData ? JSON.parse(vehicleData) : [];

      const totalProducts = parsedStock.reduce((total, product) => total + product.quantity, 0);
      const totalEarnings = parsedStock.reduce((total, product) => total + (product.price * product.quantity), 0);
      const recentVehicle = parsedVehicles.length > 0 ? parsedVehicles[parsedVehicles.length - 1] : null;

      setStockSummary({
        totalProducts,
        totalEarnings,
        recentVehicle
      });
    } catch (error) {
      console.error('Error loading stock summary', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.summaryContainer}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Total Products in Stock</Text>
          <Text style={styles.summaryValue}>{stockSummary.totalProducts}</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Total Earnings</Text>
          <Text style={styles.summaryValue}>₹{stockSummary.totalEarnings.toFixed(2)}</Text>
        </View>
      </View>

      {stockSummary.recentVehicle && (
        <TouchableOpacity 
          style={styles.recentVehicleCard}
          onPress={() => navigation.navigate('Vehicles', { 
            screen: 'VehicleDetails', 
            params: { vehicle: stockSummary.recentVehicle }
          })}
        >
          <Text style={styles.recentVehicleTitle}>Recent Vehicle</Text>
          <Text style={styles.recentVehicleDetails}>
            {stockSummary.recentVehicle.make} {stockSummary.recentVehicle.model}
          </Text>
        </TouchableOpacity>
      )}

      <View style={styles.actionButtonContainer}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => navigation.navigate('Vehicles', { 
            screen: 'VehicleMain', 
            params: { addNew: true }
          })}
        >
          <Text style={styles.actionButtonText}>Add Vehicle</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
    padding: 20
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20
  },
  summaryCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    width: '48%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  summaryTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333'
  },
  recentVehicleCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  recentVehicleTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5
  },
  recentVehicleDetails: {
    fontSize: 14,
    color: '#666'
  },
  actionButtonContainer: {
    alignItems: 'center'
  },
  actionButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center'
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold'
  }
});

export default HomeScreen;