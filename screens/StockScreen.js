import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const StockScreen = () => {
  const [products, setProducts] = useState([]);
  const navigation = useNavigation(); // useNavigation hook

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const storedProducts = await AsyncStorage.getItem('productStock');
      if (storedProducts) {
        setProducts(JSON.parse(storedProducts));
      }
    } catch (error) {
      console.error('Error loading products', error);
    }
  };

  const deleteProduct = async (productId) => {
    Alert.alert(
      'Delete Product',
      'Are you sure you want to delete this product?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Delete',
          onPress: async () => {
            const updatedProducts = products.filter(product => product.id !== productId);
            setProducts(updatedProducts);
            await AsyncStorage.setItem('productStock', JSON.stringify(updatedProducts));
          },
          style: 'destructive'
        }
      ]
    );
  };

  const renderHiddenItem = (data) => (
    <View style={styles.rowBack}>
      <TouchableOpacity
        style={[styles.backRightBtn, styles.backRightBtnRight]}
        onPress={() => deleteProduct(data.item.id)}
      >
        <Text style={styles.backTextWhite}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  const renderItem = ({ item }) => (
    <View style={styles.productCard}>
      <View style={styles.productDetails}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productInfo}>
          Quantity: {item.quantity} | Price: ₹{item.price.toFixed(2)}
        </Text>
      </View>
    </View>
  );

  const handleAddProduct = () => {
    navigation.navigate('AddProduct');
  };

  if (!products.length) {
    return (
      <View style={styles.container}>
        <Text>No products available. Add a new product.</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddProduct}>
          <Text style={styles.addButtonText}>Add Product</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SwipeListView
        data={products}
        renderItem={renderItem}
        renderHiddenItem={renderHiddenItem}
        rightOpenValue={-75}
        keyExtractor={(item) => item.id.toString()}
        disableRightSwipe
      />
      <TouchableOpacity style={styles.addButton} onPress={handleAddProduct}>
        <Text style={styles.addButtonText}>Add Product</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4'
  },
  productCard: {
    backgroundColor: 'white',
    padding: 15,
    marginVertical: 5,
    marginHorizontal: 10,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  productDetails: {
    flex: 1
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5
  },
  productInfo: {
    fontSize: 14,
    color: '#666'
  },
  rowBack: {
    alignItems: 'center',
    backgroundColor: '#DDD',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 15,
    margin: 5,
    marginVertical: 5,
    borderRadius: 10
  },
  backRightBtn: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: 75,
    backgroundColor: 'red',
    right: 0,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10
  },
  backRightBtnRight: {
    backgroundColor: 'red'
  },
  backTextWhite: {
    color: '#FFF',
    fontWeight: 'bold'
  },
  addButton: {
    backgroundColor: '#007bff',
    padding: 15,
    margin: 10,
    borderRadius: 10,
    alignItems: 'center'
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold'
  }
});

export default StockScreen;
