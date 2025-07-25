import React, { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { supabase } from '../lib/supabase';
import { CreditCard, Lock, ArrowLeft, MapPin, User, Mail, Phone, CheckCircle, AlertCircle } from 'lucide-react';

interface CheckoutForm {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  billingAddress: {
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  shippingAddress: {
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  sameAsShipping: boolean;
  paymentMethod: string;
}

const Checkout: React.FC = () => {
  const { state, clearCart, getCartTotal } = useCart();
  const [loading, setLoading] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [error, setError] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<CheckoutForm>({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    billingAddress: {
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'US'
    },
    shippingAddress: {
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'US'
    },
    sameAsShipping: true,
    paymentMethod: 'stripe'
  });

  const subtotal = getCartTotal();
  const taxRate = 0.08; // 8% tax
  const taxAmount = subtotal * taxRate;
  const shippingAmount = subtotal > 50 ? 0 : 9.99; // Free shipping over $50
  const total = subtotal + taxAmount + shippingAmount;

  const handleInputChange = (field: string, value: string) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof CheckoutForm],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleSameAsShippingChange = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      sameAsShipping: checked,
      billingAddress: checked ? prev.shippingAddress : prev.billingAddress
    }));
  };

  const handleSubmitOrder = async () => {
    // Validate required fields
    if (!formData.email || !formData.firstName || !formData.lastName || 
        !formData.shippingAddress.addressLine1 || !formData.shippingAddress.city || 
        !formData.shippingAddress.state || !formData.shippingAddress.postalCode) {
      setError('Please fill in all required fields');
      return;
    }

    if (!supabase) {
      setError('Store is not configured. Please contact support.');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      // Create customer
      const { data: customer, error: customerError } = await supabase
        .from('customers')
        .insert([{
          email: formData.email,
          first_name: formData.firstName,
          last_name: formData.lastName,
          phone: formData.phone
        }])
        .select()
        .single();

      if (customerError) throw customerError;

      // Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert([{
          customer_id: customer.id,
          subtotal: subtotal,
          tax_amount: taxAmount,
          shipping_amount: shippingAmount,
          total_amount: total,
          billing_address: formData.billingAddress,
          shipping_address: formData.shippingAddress,
          payment_method: formData.paymentMethod,
          status: 'pending',
          payment_status: 'pending'
        }])
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = state.items.map(item => ({
        order_id: order.id,
        card_id: item.card.id,
        quantity: item.quantity,
        unit_price: item.card.price,
        total_price: item.card.price * item.quantity
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Update card stock
      for (const item of state.items) {
        const { error: stockError } = await supabase
          .from('cards')
          .update({ 
            stock_quantity: item.card.stock_quantity - item.quantity 
          })
          .eq('id', item.card.id);

        if (stockError) throw stockError;
      }

      // Clear cart and redirect to success page
      clearCart();
      setOrderNumber(order.order_number);
      setOrderComplete(true);
      
    } catch (error) {
      console.error('Error creating order:', error);
      setError('There was an error processing your order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Order Success Screen
  if (orderComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#3a4bcc] via-[#2a3ba0] to-[#1a2b80] flex items-center justify-center px-4">
        <div className="bg-white/95 backdrop-blur-md rounded-3xl p-8 text-center border-4 border-black shadow-2xl max-w-md w-full">
          <div className="mb-6">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-3xl font-black text-black mb-2">Order Complete!</h2>
            <p className="text-gray-600 mb-4">
              Your order <span className="font-bold text-[#fa98d4]">#{orderNumber}</span> has been placed successfully.
            </p>
            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 mb-6">
              <p className="text-green-800 font-bold text-sm">
                📧 Confirmation email sent to {formData.email}
              </p>
              <p className="text-green-700 text-sm mt-1">
                🚚 Your cards will be shipped within 1-2 business days
              </p>
            </div>
          </div>
          
          <div className="space-y-3">
            <button
              onClick={() => {
                window.location.hash = '';
                window.location.reload();
              }}
              className="w-full bg-[#fa98d4] hover:bg-[#ff6b9d] text-white font-black py-3 px-6 rounded-xl transition-colors"
            >
              Continue Shopping
            </button>
            <button
              onClick={() => {
                window.location.hash = '#shop';
                window.location.reload();
              }}
              className="w-full bg-white hover:bg-gray-50 text-black font-bold py-3 px-6 rounded-xl border-2 border-gray-300 transition-colors"
            >
              Browse More Cards
            </button>
          </div>
        </div>
      </div>
    );
  }
  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#3a4bcc] via-[#2a3ba0] to-[#1a2b80] flex items-center justify-center px-4">
        <div className="bg-white/95 backdrop-blur-md rounded-3xl p-8 text-center border-4 border-black shadow-2xl">
          <h2 className="text-2xl font-black text-black mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add some cards before checking out!</p>
          <button
            onClick={() => {
              window.location.hash = '';
              window.location.reload();
            }}
            className="bg-[#fa98d4] hover:bg-[#ff6b9d] text-white font-black py-3 px-6 rounded-xl transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#3a4bcc] via-[#2a3ba0] to-[#1a2b80] py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 mb-8 border-4 border-black shadow-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => window.history.back()}
                className="bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-3xl font-black text-black">Checkout</h1>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Lock className="w-4 h-4" />
              <span>Secure Checkout</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Information */}
            <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 border-4 border-black shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <User className="w-6 h-6 text-[#fa98d4]" />
                <h2 className="text-xl font-black text-black">Customer Information</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-black mb-2">Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full border-2 border-black rounded-lg px-4 py-3 focus:outline-none focus:border-[#fa98d4] font-medium"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-black mb-2">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full border-2 border-black rounded-lg px-4 py-3 focus:outline-none focus:border-[#fa98d4] font-medium"
                    placeholder="(555) 123-4567"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-black mb-2">First Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className="w-full border-2 border-black rounded-lg px-4 py-3 focus:outline-none focus:border-[#fa98d4] font-medium"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-black mb-2">Last Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className="w-full border-2 border-black rounded-lg px-4 py-3 focus:outline-none focus:border-[#fa98d4] font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 border-4 border-black shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <MapPin className="w-6 h-6 text-[#fa98d4]" />
                <h2 className="text-xl font-black text-black">Shipping Address</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-black mb-2">Address Line 1 *</label>
                  <input
                    type="text"
                    required
                    value={formData.shippingAddress.addressLine1}
                    onChange={(e) => handleInputChange('shippingAddress.addressLine1', e.target.value)}
                    className="w-full border-2 border-black rounded-lg px-4 py-3 focus:outline-none focus:border-[#fa98d4] font-medium"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-black mb-2">Address Line 2</label>
                  <input
                    type="text"
                    value={formData.shippingAddress.addressLine2}
                    onChange={(e) => handleInputChange('shippingAddress.addressLine2', e.target.value)}
                    className="w-full border-2 border-black rounded-lg px-4 py-3 focus:outline-none focus:border-[#fa98d4] font-medium"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-black mb-2">City *</label>
                    <input
                      type="text"
                      required
                      value={formData.shippingAddress.city}
                      onChange={(e) => handleInputChange('shippingAddress.city', e.target.value)}
                      className="w-full border-2 border-black rounded-lg px-4 py-3 focus:outline-none focus:border-[#fa98d4] font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-black mb-2">State *</label>
                    <input
                      type="text"
                      required
                      value={formData.shippingAddress.state}
                      onChange={(e) => handleInputChange('shippingAddress.state', e.target.value)}
                      className="w-full border-2 border-black rounded-lg px-4 py-3 focus:outline-none focus:border-[#fa98d4] font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-black mb-2">ZIP Code *</label>
                    <input
                      type="text"
                      required
                      value={formData.shippingAddress.postalCode}
                      onChange={(e) => handleInputChange('shippingAddress.postalCode', e.target.value)}
                      className="w-full border-2 border-black rounded-lg px-4 py-3 focus:outline-none focus:border-[#fa98d4] font-medium"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment */}
            <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 border-4 border-black shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <CreditCard className="w-6 h-6 text-[#fa98d4]" />
                <h2 className="text-xl font-black text-black">Payment Method</h2>
              </div>
              
              <div className="bg-gradient-to-r from-[#fa98d4]/20 to-[#ff6b9d]/20 rounded-2xl p-6 border-2 border-[#fa98d4]/30">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-[#fa98d4] rounded-full flex items-center justify-center">
                    <CreditCard className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-black text-black">Stripe Payment Processing</span>
                </div>
                <p className="text-black/70 text-sm">
                  Secure payment processing powered by Stripe. Your payment information is encrypted and secure.
                </p>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 border-4 border-black shadow-xl sticky top-8">
              <h2 className="text-xl font-black text-black mb-6">Order Summary</h2>
              
              {/* Cart Items */}
              <div className="space-y-4 mb-6">
                {state.items.map((item) => (
                  <div key={item.card.id} className="flex gap-3">
                    <img
                      src={item.card.image_url}
                      alt={item.card.name}
                     className="w-12 h-12 object-cover rounded border-2 border-black"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-black text-sm line-clamp-2">
                        {item.card.name}
                      </h3>
                      <p className="text-xs text-gray-600">
                        {item.card.condition} • Qty: {item.quantity}
                      </p>
                      <p className="font-black text-[#ff6b9d] text-sm">
                        ${(item.card.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="border-t-2 border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-black">Subtotal:</span>
                  <span className="font-bold">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-black">Tax:</span>
                  <span className="font-bold">${taxAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-black">Shipping:</span>
                  <span className="font-bold">
                    {shippingAmount === 0 ? 'FREE' : `$${shippingAmount.toFixed(2)}`}
                  </span>
                </div>
                <div className="border-t-2 border-gray-200 pt-2 flex justify-between">
                  <span className="text-lg font-black text-black">Total:</span>
                  <span className="text-xl font-black text-[#ff6b9d]">
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Place Order Button */}
              <button
                onClick={handleSubmitOrder}
                disabled={loading}
                className="w-full mt-6 bg-[#fa98d4] hover:bg-[#ff6b9d] disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-black py-4 px-6 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 disabled:transform-none disabled:shadow-none flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing Order...
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5" />
                    Complete Purchase - ${total.toFixed(2)}
                  </>
                )}
              </button>

              <p className="text-xs text-gray-500 text-center mt-4">
                🔒 By placing your order, you agree to our Terms of Service and Privacy Policy.
              </p>
              <p className="text-xs text-gray-500 text-center mt-2">
                ✅ All cards are guaranteed authentic and in stated condition.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;