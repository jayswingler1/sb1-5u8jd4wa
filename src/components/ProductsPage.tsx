import React, { useState, useEffect } from 'react';
import { ArrowLeft, ShoppingCart, CreditCard, Loader2 } from 'lucide-react';
import { products, Product } from '../stripe-config';
import { supabase } from '../lib/supabase';
import { User } from '@supabase/supabase-js';
import AuthModal from './AuthModal';
import StarField from './StarField';

interface ProductsPageProps {
  onClose: () => void;
}

const ProductsPage: React.FC<ProductsPageProps> = ({ onClose }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [subscription, setSubscription] = useState<any>(null);

  useEffect(() => {
    // Get initial user
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      if (user) {
        fetchSubscription(user);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchSubscription(session.user);
      } else {
        setSubscription(null);
      }
    });

    return () => authSubscription.unsubscribe();
  }, []);

  const fetchSubscription = async (user: User) => {
    try {
      const { data, error } = await supabase
        .from('stripe_user_subscriptions')
        .select('*')
        .maybeSingle();

      if (error) {
        console.error('Error fetching subscription:', error);
        return;
      }

      setSubscription(data);
    } catch (error) {
      console.error('Error fetching subscription:', error);
    }
  };

  const handlePurchase = async (product: Product) => {
    if (!user) {
      setAuthModalOpen(true);
      return;
    }

    setCheckoutLoading(product.id);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setAuthModalOpen(true);
        return;
      }

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          price_id: product.priceId,
          mode: product.mode,
          success_url: `${window.location.origin}/#success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${window.location.origin}/#products`,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch (error: any) {
      console.error('Checkout error:', error);
      alert(`Error: ${error.message}`);
    } finally {
      setCheckoutLoading(null);
    }
  };

  const handleClose = () => {
    window.location.hash = '';
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-[#3a4bcc] via-[#2a3ba0] to-[#1a2b80] z-50 flex items-center justify-center">
        <div className="text-white text-2xl font-bold">Loading...</div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-[#3a4bcc] via-[#2a3ba0] to-[#1a2b80] z-50 overflow-y-auto">
      <StarField />
      
      {/* Global Grid Background */}
      <div className="fixed inset-0 opacity-[0.08] pointer-events-none">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255, 255, 255, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 255, 255, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      {/* Header */}
      <header className="relative z-10 bg-gradient-to-r from-[#fa98d4] to-[#ff6b9d] backdrop-blur-md border-b-4 border-black shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={handleClose}
              className="flex items-center gap-3 text-black hover:text-white transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
              <span className="font-black text-lg">Back to Home</span>
            </button>
            
            <div className="flex items-center">
              <img 
                src="/Lucky Egg Logo.png" 
                alt="The Lucky Egg .Co" 
                className="h-12 w-auto drop-shadow-lg"
              />
            </div>
            
            <div className="w-24"></div> {/* Spacer for centering */}
          </div>
        </div>
      </header>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* User Status */}
        {user && (
          <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 border-4 border-black shadow-xl mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black text-black">Welcome back!</h3>
                <p className="text-black/70 font-medium">{user.email}</p>
              </div>
              {subscription && (
                <div className="text-right">
                  <p className="text-sm font-bold text-black/70">Current Plan:</p>
                  <p className="text-lg font-black text-[#fa98d4]">
                    {subscription.subscription_status === 'active' ? 'Active Subscription' : 'No Active Plan'}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Page Title */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-black text-white mb-6 tracking-tight">
            Premium <span className="text-transparent bg-gradient-to-r from-[#fa98d4] to-[#ff6b9d] bg-clip-text">Products</span>
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto font-medium leading-relaxed">
            Discover our exclusive collection of premium products and services.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <div key={product.id} className="bg-white/95 backdrop-blur-md rounded-3xl p-8 border-4 border-black hover:border-[#fa98d4] transition-all duration-300 transform hover:scale-105 group shadow-xl hover:shadow-2xl">
              {/* Product Header */}
              <div className="text-center mb-6">
                <div className="bg-gradient-to-r from-[#fa98d4] to-[#ff6b9d] rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 border-4 border-black shadow-lg">
                  <ShoppingCart className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-black text-black mb-2 group-hover:text-[#ff6b9d] transition-colors">
                  {product.name}
                </h3>
                {product.description && (
                  <p className="text-black/70 font-medium">
                    {product.description}
                  </p>
                )}
              </div>

              {/* Price */}
              <div className="text-center mb-6">
                <div className="text-4xl font-black text-[#ff6b9d] mb-2">
                  £{product.price.toFixed(2)}
                </div>
                <div className="text-sm font-bold text-black/60">
                  {product.mode === 'subscription' ? 'per month' : 'one-time payment'}
                </div>
              </div>

              {/* Features */}
              <div className="bg-gradient-to-r from-[#fa98d4]/20 to-[#ff6b9d]/20 rounded-2xl p-4 border-2 border-[#fa98d4]/30 mb-6">
                <div className="text-center">
                  <p className="text-black font-bold">
                    {product.mode === 'subscription' ? '🔄 Recurring Subscription' : '💳 One-Time Purchase'}
                  </p>
                  <p className="text-black/70 text-sm mt-1">
                    {product.mode === 'subscription' 
                      ? 'Cancel anytime, no commitment' 
                      : 'Instant access after payment'}
                  </p>
                </div>
              </div>

              {/* Purchase Button */}
              <button
                onClick={() => handlePurchase(product)}
                disabled={checkoutLoading === product.id}
                className="w-full bg-[#fa98d4] hover:bg-[#ff6b9d] disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-black py-4 px-6 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 disabled:transform-none disabled:shadow-none flex items-center justify-center gap-2"
              >
                {checkoutLoading === product.id ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    {user ? 'Purchase Now' : 'Login to Purchase'}
                  </>
                )}
              </button>

              {/* Security Badge */}
              <div className="text-center mt-4">
                <p className="text-xs text-black/60 font-bold">
                  🔒 Secure payment powered by Stripe
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* No Products Message */}
        {products.length === 0 && (
          <div className="bg-white/95 backdrop-blur-md rounded-3xl p-12 border-4 border-black shadow-xl text-center">
            <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-black text-black mb-2">No Products Available</h3>
            <p className="text-gray-600">
              Check back soon for new products and services!
            </p>
          </div>
        )}
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        mode={authMode}
        onModeChange={setAuthMode}
      />
    </div>
  );
};

export default ProductsPage;