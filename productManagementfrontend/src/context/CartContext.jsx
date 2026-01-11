import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';

const API_URL = 'http://localhost:5000/api';

function getHeaders() {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
}

export const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const authContext = useContext(AuthContext);
  const isAuthenticated = authContext?.isAuthenticated || false;

  // Fetch cart when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      setCart(null);
      setCartItems([]);
    }
  }, [isAuthenticated]);

  // Fetch cart from API
  async function fetchCart() {
    try {
      setIsLoading(true);
      const response = await axios.get(`${API_URL}/cart`, {
        headers: getHeaders(),
      });
      
      if (response.data.success) {
        setCart(response.data.data);
        setCartItems(response.data.data.items || []);
      }
    } catch (error) {
      console.error('Fetch cart error:', error);
      setCart(null);
      setCartItems([]);
    } finally {
      setIsLoading(false);
    }
  }

  // Add item to cart
  async function addToCart(productId, quantity = 1) {
    try {
      if (!isAuthenticated) {
        return { success: false, message: 'Please login to add items to cart' };
      }

      const response = await axios.post(
        `${API_URL}/cart`,
        { productId, quantity },
        { headers: getHeaders() }
      );

      if (response.data.success) {
        setCart(response.data.data);
        setCartItems(response.data.data.items || []);
        return { success: true, message: 'Item added to cart' };
      }
      return { success: false, message: response.data.message || 'Failed to add to cart' };
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to add to cart';
      return { success: false, message };
    }
  }

  // Update cart item quantity
  async function updateCartItem(itemId, quantity) {
    try {
      const response = await axios.put(
        `${API_URL}/cart/${itemId}`,
        { quantity },
        { headers: getHeaders() }
      );

      if (response.data.success) {
        setCart(response.data.data);
        setCartItems(response.data.data.items || []);
        return { success: true };
      }
      return { success: false };
    } catch (error) {
      console.error('Update cart error:', error);
      return { success: false };
    }
  }

  // Remove item from cart
  async function removeFromCart(itemId) {
    try {
      const response = await axios.delete(`${API_URL}/cart/${itemId}`, {
        headers: getHeaders(),
      });

      if (response.data.success) {
        setCart(response.data.data);
        setCartItems(response.data.data.items || []);
        return { success: true };
      }
      return { success: false };
    } catch (error) {
      console.error('Remove from cart error:', error);
      return { success: false };
    }
  }

  // Clear cart
  async function clearCart() {
    try {
      const response = await axios.delete(`${API_URL}/cart`, {
        headers: getHeaders(),
      });

      if (response.data.success) {
        setCart(response.data.data);
        setCartItems([]);
        return { success: true };
      }
      return { success: false };
    } catch (error) {
      console.error('Clear cart error:', error);
      return { success: false };
    }
  }

  // Calculate cart total
  const cartTotal = cartItems.reduce((total, item) => {
    if (item.product) {
      return total + (item.product.price * item.quantity);
    }
    return total;
  }, 0);

  // Get cart items count
  const cartItemsCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  const value = {
    cart,
    cartItems,
    cartTotal,
    cartItemsCount,
    isLoading,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    fetchCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

