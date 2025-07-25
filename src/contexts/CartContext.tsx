import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Card, CartItem } from '../lib/supabase';

interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: Card }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { cardId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'TOGGLE_CART' }
  | { type: 'OPEN_CART' }
  | { type: 'CLOSE_CART' }
  | { type: 'LOAD_CART'; payload: CartItem[] };

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find(item => item.card.id === action.payload.id);
      
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.card.id === action.payload.id
              ? { ...item, quantity: Math.min(item.quantity + 1, action.payload.stock_quantity) }
              : item
          )
        };
      }
      
      return {
        ...state,
        items: [...state.items, { card: action.payload, quantity: 1 }]
      };
    }
    
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.card.id !== action.payload)
      };
    
    case 'UPDATE_QUANTITY': {
      const { cardId, quantity } = action.payload;
      
      if (quantity <= 0) {
        return {
          ...state,
          items: state.items.filter(item => item.card.id !== cardId)
        };
      }
      
      return {
        ...state,
        items: state.items.map(item =>
          item.card.id === cardId
            ? { ...item, quantity: Math.min(quantity, item.card.stock_quantity) }
            : item
        )
      };
    }
    
    case 'CLEAR_CART':
      return {
        ...state,
        items: []
      };
    
    case 'TOGGLE_CART':
      return {
        ...state,
        isOpen: !state.isOpen
      };
    
    case 'OPEN_CART':
      return {
        ...state,
        isOpen: true
      };
    
    case 'CLOSE_CART':
      return {
        ...state,
        isOpen: false
      };
    
    case 'LOAD_CART':
      return {
        ...state,
        items: action.payload
      };
    
    default:
      return state;
  }
};

interface CartContextType {
  state: CartState;
  addItem: (card: Card) => void;
  removeItem: (cardId: string) => void;
  updateQuantity: (cardId: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    isOpen: false
  });

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('luckyegg_cart');
    if (savedCart) {
      try {
        const cartItems = JSON.parse(savedCart);
        dispatch({ type: 'LOAD_CART', payload: cartItems });
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('luckyegg_cart', JSON.stringify(state.items));
  }, [state.items]);

  const addItem = (card: Card) => {
    dispatch({ type: 'ADD_ITEM', payload: card });
  };

  const removeItem = (cardId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: cardId });
  };

  const updateQuantity = (cardId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { cardId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const toggleCart = () => {
    dispatch({ type: 'TOGGLE_CART' });
  };

  const openCart = () => {
    dispatch({ type: 'OPEN_CART' });
  };

  const closeCart = () => {
    dispatch({ type: 'CLOSE_CART' });
  };

  const getCartTotal = () => {
    return state.items.reduce((total, item) => total + (item.card.price * item.quantity), 0);
  };

  const getCartCount = () => {
    return state.items.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        state,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        toggleCart,
        openCart,
        closeCart,
        getCartTotal,
        getCartCount
      }}
    >
      {children}
    </CartContext.Provider>
  );
};