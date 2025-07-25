import React from 'react';
import { useState } from 'react';
import { CartProvider } from './contexts/CartContext';
import StarField from './components/StarField';
import Header from './components/Header';
import Hero from './components/Hero';
import LatestPulls from './components/LatestPulls';
import FeaturedProducts from './components/FeaturedProducts';
import Newsletter from './components/Newsletter';
import Footer from './components/Footer';
import AdminPanel from './components/AdminPanel';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import AboutPage from './components/AboutPage';
import SuccessPage from './components/SuccessPage';
import PageTransition from './components/PageTransition';
import { usePageTransition } from './hooks/usePageTransition';

function App() {
  const [showAdmin, setShowAdmin] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');
  const { isTransitioning, startTransition, completeTransition } = usePageTransition();

  // Check for admin access
  const isAdmin = window.location.hash === '#admin' || showAdmin;
  
  // Check for about page
  const isAbout = window.location.hash === '#about' || showAbout;
  
  // Check for success page
  const isSuccess = window.location.hash.startsWith('#success') || showSuccess;
  
  // Check for checkout page
  const isCheckout = window.location.hash === '#checkout' || currentPage === 'checkout';

  // Listen for hash changes
  React.useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#checkout') {
        setCurrentPage('checkout');
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

  const toggleAdmin = () => {
    if (isAdmin) {
      window.location.hash = '';
      setShowAdmin(false);
    } else {
      window.location.hash = '#admin';
      setShowAdmin(true);
    }
  };

  // Handle checkout page
  if (isCheckout) {
    return (
      <CartProvider>
        <Checkout />
      </CartProvider>
    );
  }
  
  // Handle success page
  if (isSuccess) {
    return (
      <CartProvider>
        <SuccessPage onClose={() => {
          window.location.hash = '';
          setShowSuccess(false);
        }} />
        <Cart />
      </CartProvider>
    );
  }
  
  // Handle about page
  if (isAbout) {
    return (
      <CartProvider>
        <AboutPage onClose={() => {
          window.location.hash = '';
          setShowAbout(false);
        }} />
        <Cart />
      </CartProvider>
    );
  }

  // If admin mode, show admin panel
  if (isAdmin) {
    return (
      <div>
        <button
          onClick={toggleAdmin}
          className="fixed top-4 right-4 z-50 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg"
        >
          View Frontend
        </button>
        <AdminPanel />
      </div>
    );
  }

  // Default frontend view
  return (
    <CartProvider>
      <div className="min-h-screen bg-gradient-to-br from-[#3a4bcc] via-[#2a3ba0] to-[#1a2b80] relative overflow-x-hidden">
        <PageTransition 
          isTransitioning={isTransitioning} 
          onTransitionComplete={completeTransition}
        />
        
        {/* Admin Toggle Button */}
        <button
          onClick={toggleAdmin}
          className="fixed top-4 right-4 z-50 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg"
        >
          Admin Panel
        </button>
        
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
  );
}

export default App;