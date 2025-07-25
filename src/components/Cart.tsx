import React from 'react';
import { X, Plus, Minus, ShoppingBag, Trash2 } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

const Cart: React.FC = () => {
  const { state, removeItem, updateQuantity, closeCart, getCartTotal, getCartCount } = useCart();

  if (!state.isOpen) return null;

  const handleCheckout = () => {
    // Navigate to checkout page using hash
    window.location.hash = '#checkout';
    // Close the cart when going to checkout
    closeCart();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeCart} />
      
      {/* Cart Panel */}
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl">
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
            <div className="flex items-center gap-3">
              <ShoppingBag className="h-6 w-6 text-[#fa98d4]" />
              <h2 className="text-xl font-black text-black">
                Your Cart ({getCartCount()})
              </h2>
            </div>
            <button
              onClick={closeCart}
              className="rounded-full p-2 hover:bg-gray-100 transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {state.items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <ShoppingBag className="h-16 w-16 text-gray-300 mb-4" />
                <h3 className="text-lg font-bold text-gray-500 mb-2">Your cart is empty</h3>
                <p className="text-gray-400 mb-6">Add some cards to get started!</p>
                <button
                  onClick={closeCart}
                  className="bg-[#fa98d4] hover:bg-[#ff6b9d] text-white font-bold py-2 px-6 rounded-lg transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {state.items.map((item) => (
                  <div key={item.card.id} className="flex gap-4 bg-gray-50 rounded-lg p-4">
                    <img
                      src={item.card.image_url}
                      alt={item.card.name}
                     className="w-12 h-12 object-cover rounded border-2 border-black"
                    />
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-black text-sm line-clamp-2 mb-1">
                        {item.card.name}
                      </h3>
                      <p className="text-xs text-gray-600 mb-2">
                        {item.card.condition} • {item.card.rarity}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.card.id, item.quantity - 1)}
                            className="w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="font-bold text-sm w-8 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.card.id, item.quantity + 1)}
                            disabled={item.quantity >= item.card.stock_quantity}
                            className="w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <span className="font-black text-[#ff6b9d]">
                            ${(item.card.price * item.quantity).toFixed(2)}
                          </span>
                          <button
                            onClick={() => removeItem(item.card.id)}
                            className="text-red-500 hover:text-red-700 p-1 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {state.items.length > 0 && (
            <div className="border-t border-gray-200 px-6 py-4 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-black">Total:</span>
                <span className="text-2xl font-black text-[#ff6b9d]">
                  ${getCartTotal().toFixed(2)}
                </span>
              </div>
              
              <button
                onClick={handleCheckout}
                className="w-full bg-[#fa98d4] hover:bg-[#ff6b9d] text-white font-black py-4 px-6 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1"
              >
                Checkout
              </button>
              
              <button
                onClick={closeCart}
                className="w-full bg-white hover:bg-gray-50 text-black font-bold py-3 px-6 rounded-xl border-2 border-gray-300 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;