import React, { useState, useEffect } from 'react';
import { ShoppingCart, Search, User, LogOut } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from './AuthModal';

const Header: React.FC = () => {
  const { toggleCart, getCartCount } = useCart();
  const { user, isAdmin, signOut } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  const handleNavigation = (hash: string) => {
    window.location.hash = hash;
    window.location.reload();
  };

  const handleSignOut = async () => {
    await signOut();
    window.location.reload();
  };

  const handleAuthClick = () => {
    if (user) {
      handleSignOut();
    } else {
      setAuthModalOpen(true);
    }
  };

  return (
    <>
      <div className="relative z-10 px-4 sm:px-6 lg:px-8 pt-4">
        <header className="bg-[#fa98d4] backdrop-blur-md border-4 border-black rounded-3xl max-w-7xl mx-auto shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <img 
                  src="/Lucky Egg Logo.png" 
                  alt="The Lucky Egg .Co" 
                  className="h-12 w-auto drop-shadow-lg"
                />
              </div>
            </div>

            {/* Navigation */}
            <nav className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <a href="#" className="text-black hover:text-white px-4 py-2 text-sm font-black transition-colors rounded-lg hover:bg-black/20">
                  Latest Pulls
                </a>
                <button 
                  onClick={() => handleNavigation('#shop')}
                  className="text-black hover:text-white px-4 py-2 text-sm font-black transition-colors rounded-lg hover:bg-black/20"
                >
                  Shop
                </button>
                <a href="https://www.youtube.com/@jayswingler2" target="_blank" rel="noopener noreferrer" className="text-black hover:text-white px-4 py-2 text-sm font-black transition-colors rounded-lg hover:bg-black/20">
                  YouTube
                </a>
                <button 
                  onClick={() => handleNavigation('#about')}
                  className="text-black hover:text-white px-4 py-2 text-sm font-black transition-colors rounded-lg hover:bg-black/20"
                >
                  About
                </button>
                {isAdmin && (
                  <button 
                    onClick={() => handleNavigation('#admin')}
                    className="text-black hover:text-white px-4 py-2 text-sm font-black transition-colors rounded-lg hover:bg-black/20"
                  >
                    Admin
                  </button>
                )}
              </div>
            </nav>

            {/* Right side icons */}
            <div className="flex items-center space-x-4">
              <button className="text-black hover:text-white transition-colors p-2 rounded-lg hover:bg-black/20">
                <Search className="h-5 w-5" />
              </button>
              
              <button 
                onClick={handleAuthClick}
                className="text-black hover:text-white transition-colors p-2 rounded-lg hover:bg-black/20 flex items-center gap-2"
                title={user ? 'Sign Out' : 'Sign In'}
              >
                {user ? <LogOut className="h-5 w-5" /> : <User className="h-5 w-5" />}
                {user && (
                  <span className="hidden sm:inline text-sm font-bold">
                    {user.email?.split('@')[0]}
                  </span>
                )}
              </button>
              
              <button 
                onClick={toggleCart}
                className="text-black hover:text-white transition-colors relative p-2 rounded-lg hover:bg-black/20"
              >
                <ShoppingCart className="h-5 w-5" />
                {getCartCount() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold border-2 border-white">
                    {getCartCount()}
                  </span>
                )}
              </button>
            </div>
          </div>
          </div>
        </header>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        mode={authMode}
        onModeChange={setAuthMode}
      />
    </>
  );
};

export default Header;