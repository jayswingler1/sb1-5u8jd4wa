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
      <div className="relative z-20 px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 lg:pt-8">
        <header className="bg-[#fa98d4] backdrop-blur-md border-4 border-black rounded-2xl sm:rounded-3xl max-w-4xl mx-auto shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mb-4 sm:mb-6 lg:mb-8">
          <div className="px-3 sm:px-4 lg:px-6">
          <div className="flex items-center justify-between h-12 sm:h-14 lg:h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <img 
                  src="/Lucky Egg Logo.png" 
                  alt="The Lucky Egg .Co" 
                  className="h-8 sm:h-10 lg:h-12 w-auto drop-shadow-lg"
                />
              </div>
            </div>

            {/* Navigation */}
            <nav className="hidden md:block">
              <div className="ml-4 lg:ml-10 flex items-baseline space-x-4 lg:space-x-8">
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
            <div className="flex items-center space-x-2 sm:space-x-4">
              <button className="text-black hover:text-white transition-colors p-1.5 sm:p-2 rounded-lg hover:bg-black/20">
                <Search className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
              
              <button 
                onClick={handleAuthClick}
                className="text-black hover:text-white transition-colors p-1.5 sm:p-2 rounded-lg hover:bg-black/20 flex items-center gap-1 sm:gap-2"
                title={user ? 'Sign Out' : 'Sign In'}
              >
                {user ? <LogOut className="h-4 w-4 sm:h-5 sm:w-5" /> : <User className="h-4 w-4 sm:h-5 sm:w-5" />}
                {user && (
                  <span className="hidden md:inline text-xs sm:text-sm font-bold">
                    {user.email?.split('@')[0]}
                  </span>
                )}
              </button>
              
              <button 
                onClick={toggleCart}
                className="text-black hover:text-white transition-colors relative p-1.5 sm:p-2 rounded-lg hover:bg-black/20"
              >
                <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
                {getCartCount() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center font-bold border-2 border-white">
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