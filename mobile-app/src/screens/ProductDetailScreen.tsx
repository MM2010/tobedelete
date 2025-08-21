import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';
import { Product } from '../types/data';
import { getProductById } from '../services/productService';

type ProductDetailScreenRouteProp = RouteProp<
  RootStackParamList,
  'ProductDetail'
>;

interface Props {
  route: ProductDetailScreenRouteProp;
}

export const ProductDetailScreen: React.FC<Props> = ({ route }) => {
  const { productId } = route.params;
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        const fetchedProduct = await getProductById(productId);
        if (fetchedProduct) {
          setProduct(fetchedProduct);
          setError(null);
        } else {
          setError('Product not found.');
        }
      } catch (e) {
        setError('Failed to fetch product details.');
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  if (!product) {
    return null; // Should not happen if error is handled, but good for type safety
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{product.nome}</Text>
      <Text style={styles.category}>{product.categoria}</Text>
      <Text style={styles.price}>${product.prezzo.toFixed(2)}</Text>
      <Text style={styles.stock}>
        {product.quantita_disponibile} available
      </Text>
      <Text style={styles.description}>{product.descrizione}</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    color: 'red',
    fontSize: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  category: {
    fontSize: 18,
    color: '#666',
    marginBottom: 16,
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007bff',
    marginBottom: 16,
  },
  stock: {
      fontSize: 16,
      color: 'green',
      marginBottom: 24,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
});
