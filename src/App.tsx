import React from 'react';
import { useState } from 'react';
import { CartProvider } from './contexts/CartContext';
import { AuthProvider } from './contexts/AuthContext';
import StarField from './components/StarField';
import Header from './components/Header';
import Hero from './components/Hero';
import LatestPulls from './components/LatestPulls';
import FeaturedProducts from './components/FeaturedProducts';
import Newsletter from './components/Newsletter';
import Footer from './components/Footer';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import ShopPage from './components/ShopPage';
import AboutPage from './components/AboutPage';
import SuccessPage from './components/SuccessPage';
import ProductManagement from './components/ProductManagement';
import PageTransition from './components/PageTransition';
import { usePageTransition } from './hooks/usePageTransition';

function App() {
  const [showAbout, setShowAbout] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');
  const { isTransitioning, startTransition, completeTransition } = usePageTransition();

  // Check for about page
  const isAbout = window.location.hash === '#about' || showAbout;
  
  // Check for success page
  const isSuccess = window.location.hash.startsWith('#success') || showSuccess;
  
  // Check for checkout page
  const isCheckout = window.location.hash === '#checkout' || currentPage === 'checkout';

  // Check for shop page
  const isShop = window.location.hash === '#shop' || currentPage === 'shop';

  // Check for admin page
  const isAdmin = window.location.hash === '#admin' || currentPage === 'admin';

  // Listen for hash changes
  React.useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#checkout') {
        setCurrentPage('checkout');
      } else if (window.location.hash === '#shop') {
        setCurrentPage('shop');
      } else if (window.location.hash === '#about') {
        setCurrentPage('about');
      } else if (window.location.hash.startsWith('#success')) {
        setCurrentPage('success');
      } else if (window.location.hash === '#admin') {
        setCurrentPage('admin');
      } else {
        setCurrentPage('home');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Check initial hash

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Handle checkout page
  if (isCheckout) {
    return (
      <AuthProvider>
        <CartProvider>
          <Checkout />
        </CartProvider>
      </AuthProvider>
    );
  }
  
  // Handle shop page
  if (isShop) {
    return (
      <AuthProvider>
        <CartProvider>
          <ShopPage onClose={() => {
            window.location.hash = '';
            setCurrentPage('home');
          }} />
          <Cart />
        </CartProvider>
      </AuthProvider>
    );
  }
  
  // Handle success page
  if (isSuccess) {
    return (
      <AuthProvider>
        <CartProvider>
          <SuccessPage onClose={() => {
            window.location.hash = '';
            setShowSuccess(false);
          }} />
          <Cart />
        </CartProvider>
      </AuthProvider>
    );
  }
  
  // Handle about page
  if (isAbout) {
    return (
      <AuthProvider>
        <CartProvider>
          <AboutPage onClose={() => {
            window.location.hash = '';
            setShowAbout(false);
          }} />
          <Cart />
        </CartProvider>
      </AuthProvider>
    );
  }

  // Handle admin page
  if (isAdmin) {
    return (
      <AuthProvider>
        <CartProvider>
          <ProductManagement onClose={() => {
            window.location.hash = '';
            setCurrentPage('home');
          }} />
          <Cart />
        </CartProvider>
      </AuthProvider>
    );
  }

  // Default frontend view
  return (
    <AuthProvider>
      <CartProvider>
        <div className="min-h-screen bg-gradient-to-br from-[#3a4bcc] via-[#2a3ba0] to-[#1a2b80] relative overflow-x-hidden">
          <PageTransition 
            isTransitioning={isTransitioning} 
            onTransitionComplete={completeTransition}
          />
          
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
          
          <StarField />
          <Header />
          <Hero />
          <LatestPulls />
          <FeaturedProducts />
          <Newsletter />
          <Footer />
          <Cart />
        </div>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;