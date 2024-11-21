import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const VehicleScreen = ({ navigation, route }) => {
  const [vehicles, setVehicles] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [newVehicle, setNewVehicle] = useState({
    make: '',
    model: '',
    registrationNumber: '',
    customerName: '',
    contactNumber: ''
  });

  useEffect(() => {
    loadVehicles();
    
    // Check if we need to open add vehicle modal
    if (route.params?.addNew) {
      setModalVisible(true);
    }
  }, [route.params]);

  const loadVehicles = async () => {
    try {
      const storedVehicles = await AsyncStorage.getItem('vehicles');
      if (storedVehicles) {
        setVehicles(JSON.parse(storedVehicles));
      }
    } catch (error) {
      console.error('Error loading vehicles', error);
    }
  };

  const addVehicle = async () => {
    // Validate input
    if (!newVehicle.make || !newVehicle.model || !newVehicle.registrationNumber) {
      alert('Please fill in all required fields');
      return;
    }

    const vehicleToAdd = {
      ...newVehicle,
      id: Date.now(),
      dateAdded: new Date().toISOString()
    };

    const updatedVehicles = [...vehicles, vehicleToAdd];
    
    try {
      await AsyncStorage.setItem('vehicles', JSON.stringify(updatedVehicles));
      setVehicles(updatedVehicles);
      setModalVisible(false);
      
      // Reset form
      setNewVehicle({
        make: '',
        model: '',
        registrationNumber: '',
        customerName: '',
        contactNumber: ''
      });

      // Navigate to vehicle details
      navigation.navigate('VehicleDetails', { vehicle: vehicleToAdd });
    } catch (error) {
      console.error('Error saving vehicle', error);
    }
  };

  const renderVehicleCard = (vehicle) => (
    <TouchableOpacity
      key={vehicle.id}
      style={styles.vehicleCard}
      onPress={() => navigation.navigate('VehicleDetails', { vehicle })}
    >
      <View>
        <Text style={styles.vehicleMake}>{vehicle.make} {vehicle.model}</Text>
        <Text style={styles.vehicleDetails}>
          Reg: {vehicle.registrationNumber}
        </Text>
        <Text style={styles.vehicleDetails}>
          Customer: {vehicle.customerName || 'N/A'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ScrollView>
        {vehicles.length > 0 ? (
          vehicles.map(renderVehicleCard)
        ) : (
          <Text style={styles.noVehiclesText}>No vehicles added yet</Text>
        )}
      </ScrollView>

      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.addButtonText}>Add New Vehicle</Text>
      </TouchableOpacity>

      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Vehicle</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Make"
              value={newVehicle.make}
              onChangeText={(text) => setNewVehicle({...newVehicle, make: text})}
            />
            <TextInput
              style={styles.input}
              placeholder="Model"
              value={newVehicle.model}
              onChangeText={(text) => setNewVehicle({...newVehicle, model: text})}
            />
            <TextInput
              style={styles.input}
              placeholder="Registration Number"
              value={newVehicle.registrationNumber}
              onChangeText={(text) => setNewVehicle({...newVehicle, registrationNumber: text})}
            />
            <TextInput
              style={styles.input}
              placeholder="Customer Name"
              value={newVehicle.customerName}
              onChangeText={(text) => setNewVehicle({...newVehicle, customerName: text})}
            />
            <TextInput
              style={styles.input}
              placeholder="Contact Number"
              keyboardType="phone-pad"
              value={newVehicle.contactNumber}
              onChangeText={(text) => setNewVehicle({...newVehicle, contactNumber: text})}
            />

            <View style={styles.modalButtonContainer}>
              <TouchableOpacity 
                style={styles.modalCancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalCancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.modalAddButton}
                onPress={addVehicle}
              >
                <Text style={styles.modalAddButtonText}>Add Vehicle</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
    padding: 10
  },
  vehicleCard: {
    backgroundColor: 'white',
    padding: 15,
    marginVertical: 5,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  vehicleMake: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5
  },
  vehicleDetails: {
    fontSize: 14,
    color: '#666'
  },
  noVehiclesText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#666'
  },
  addButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    margin: 10
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold'
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  modalContent: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center'
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%'
  },
  modalCancelButton: {
    backgroundColor: '#f4f4f4',
    padding: 10,
    borderRadius: 5,
    width: '45%',
    alignItems: 'center'
  },
  modalCancelButtonText: {
    color: '#333'
  },
  modalAddButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    width: '45%',
    alignItems: 'center'
  },
  modalAddButtonText: {
    color: 'white'
  }
});

export default VehicleScreen;