import React from 'react';
import { ShoppingCart, Search, User, Menu } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

const Header: React.FC = () => {
  const { toggleCart, getCartCount } = useCart();

  return (
    <header className="relative z-10 bg-gradient-to-r from-[#fa98d4] to-[#ff6b9d] backdrop-blur-md border-b-4 border-black shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <img 
                src="/Logo 2.png" 
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
                onClick={() => {
                  window.location.hash = '#shop';
                  window.location.reload();
                }}
                className="text-black hover:text-white px-4 py-2 text-sm font-black transition-colors rounded-lg hover:bg-black/20"
              >
                All Cards
              </button>
              <a href="https://www.youtube.com/@jayswingler2" target="_blank" rel="noopener noreferrer" className="text-black hover:text-white px-4 py-2 text-sm font-black transition-colors rounded-lg hover:bg-black/20">
                YouTube
              </a>
              <button 
                onClick={() => {
                  window.location.hash = '#about';
                  window.location.reload();
                }}
                className="text-black hover:text-white px-4 py-2 text-sm font-black transition-colors rounded-lg hover:bg-black/20"
              >
                About
              </button>
            </div>
          </nav>

          {/* Right side icons */}
          <div className="flex items-center space-x-4">
            <button className="text-black hover:text-white transition-colors p-2 rounded-lg hover:bg-black/20">
              <Search className="h-5 w-5" />
            </button>
            <button className="text-black hover:text-white transition-colors p-2 rounded-lg hover:bg-black/20">
              <User className="h-5 w-5" />
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
            <button className="bg-white/90 backdrop-blur-sm rounded-full p-3 hover:bg-white transition-colors border-3 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1">
              <Menu className="h-5 w-5 text-black" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;