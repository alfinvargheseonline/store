import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SalesReportScreen = () => {
  const [salesReport, setSalesReport] = useState([]);

  useEffect(() => {
    fetchSalesReport();
  }, []);

  const fetchSalesReport = async () => {
    try {
      // Collect sales data from different sources
      const vehiclesData = await AsyncStorage.getItem('vehicles');
      const vehiclePartsData = [];

      if (vehiclesData) {
        const vehicles = JSON.parse(vehiclesData);
        
        // Fetch parts for each vehicle
        for (let vehicle of vehicles) {
          const vehicleParts = await AsyncStorage.getItem(`vehicle_parts_${vehicle.id}`);
          if (vehicleParts) {
            const parsedParts = JSON.parse(vehicleParts);
            parsedParts.forEach(part => {
              vehiclePartsData.push({
                vehicleMake: vehicle.make,
                vehicleModel: vehicle.model,
                ...part,
                date: new Date(part.id).toLocaleDateString()
              });
            });
          }
        }
      }

      // Sort sales by date
      const sortedSales = vehiclePartsData.sort((a, b) => b.id - a.id);
      setSalesReport(sortedSales);
    } catch (error) {
      console.error('Error fetching sales report', error);
    }
  };

  const calculateTotalSales = () => {
    return salesReport.reduce((total, sale) => total + sale.totalCost, 0);
  };

  return (
    <View style={styles.container}>
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Total Sales</Text>
        <Text style={styles.summaryAmount}>
          ₹{calculateTotalSales().toFixed(2)}
        </Text>
      </View>

      <Text style={styles.reportTitle}>Sales Details</Text>

      <ScrollView>
        {salesReport.length > 0 ? (
          salesReport.map((sale, index) => (
            <View key={index} style={styles.salesCard}>
              <View style={styles.salesHeader}>
                <Text style={styles.vehicleName}>
                  {sale.vehicleMake} {sale.vehicleModel}
                </Text>
                <Text style={styles.saleDate}>{sale.date}</Text>
              </View>
              <View style={styles.salesDetails}>
                <Text style={styles.partName}>{sale.name}</Text>
                <Text style={styles.partDetails}>
                  Qty: {sale.quantity} | Price: ₹{sale.price}
                </Text>
                <Text style={styles.saleTotalCost}>
                  Total: ₹{sale.totalCost.toFixed(2)}
                </Text>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.noSalesText}>No sales recorded yet</Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
    padding: 10
  },
  summaryCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  summaryTitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5
  },
  summaryAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007bff'
  },
  reportTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    marginLeft: 5
  },
  salesCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  salesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10
  },
  vehicleName: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  saleDate: {
    fontSize: 14,
    color: '#666'
  },
  salesDetails: {
    marginTop: 5
  },
  partName: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 5
  },
  partDetails: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5
  },
  saleTotalCost: {
    fontSize: 16,
    color: '#007bff',
    fontWeight: 'bold',
    alignSelf: 'flex-end'
  },
  noSalesText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#666'
  }
});

export default SalesReportScreen;