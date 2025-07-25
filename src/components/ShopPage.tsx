import React, { useState, useEffect } from 'react';
import { Search, Filter, Grid, List, Star, ShoppingCart, Heart, Play, Package, User, Menu } from 'lucide-react';
import { useCards } from '../hooks/useCards';
import { useCart } from '../contexts/CartContext';
import { usePageTransition } from '../hooks/usePageTransition';
import { Card } from '../lib/supabase';
import StarField from './StarField';

interface ShopPageProps {
  onClose: () => void;
}

const ShopPage: React.FC<ShopPageProps> = ({ onClose }) => {
  const { cards, loading, error } = useCards(false); // Get all cards
  const { addItem, toggleCart, getCartCount } = useCart();
  const { startTransition } = usePageTransition();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSet, setSelectedSet] = useState('all');
  const [selectedRarity, setSelectedRarity] = useState('all');
  const [selectedCondition, setSelectedCondition] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  // Get unique sets from cards
  const availableSets = Array.from(new Set(cards.map(card => card.set_name).filter(Boolean)));
  const availableRarities = Array.from(new Set(cards.map(card => card.rarity)));
  const availableConditions = Array.from(new Set(cards.map(card => card.condition)));

  // Filter and sort cards
  const filteredCards = cards
    .filter(card => {
      const matchesSearch = card.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSet = selectedSet === 'all' || card.set_name === selectedSet;
      const matchesRarity = selectedRarity === 'all' || card.rarity === selectedRarity;
      const matchesCondition = selectedCondition === 'all' || card.condition === selectedCondition;
      const isActive = card.is_active;
      
      return matchesSearch && matchesSet && matchesRarity && matchesCondition && isActive;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'newest':
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });

  const handleAddToCart = (card: Card) => {
    addItem(card);
  };

  const handleNavigation = (hash: string) => {
    startTransition(() => {
      window.location.hash = hash;
      window.location.reload();
    });
  };

  const ProductCard: React.FC<{ card: Card }> = ({ card }) => {
    const inStock = card.stock_quantity > 0;
    const rating = 5; // You can make this dynamic later

    if (viewMode === 'list') {
      return (
        <div className="bg-white/95 backdrop-blur-md rounded-2xl p-4 border-3 border-black hover:border-[#fa98d4] transition-all duration-300 group shadow-lg hover:shadow-xl flex gap-4">
          <div className="relative w-24 h-24 flex-shrink-0">
            <img
              src={card.image_url}
              alt={card.name}
             className="w-full h-full object-cover rounded-lg border-2 border-black"
            />
            {card.video_episode && (
              <div className="absolute -top-1 -right-1 bg-red-600 rounded-full px-2 py-1 flex items-center gap-1 border-2 border-white">
                <Play className="w-2 h-2 text-white fill-current" />
                <span className="text-white text-xs font-bold">{card.video_episode}</span>
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-black text-black text-lg line-clamp-1 group-hover:text-[#ff6b9d] transition-colors">
                {card.name}
              </h3>
              <button className="text-gray-400 hover:text-[#fa98d4] transition-colors">
                <Heart className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex items-center gap-2 mb-2">
              <span className={`px-2 py-1 rounded-full text-xs font-bold border border-black ${
                card.rarity === 'Legendary' ? 'bg-[#fa98d4] text-white' :
                card.rarity === 'Rare' ? 'bg-[#ff6b9d] text-white' :
                'bg-[#3a4bcc] text-white'
              }`}>
                {card.rarity}
              </span>
              <span className="text-xs font-bold text-gray-600">{card.condition}</span>
              {card.set_name && (
                <span className="text-xs text-gray-500">• {card.set_name}</span>
              )}
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl font-black text-[#ff6b9d]">${card.price}</span>
                {card.original_price && card.original_price > card.price && (
                  <span className="text-gray-500 line-through text-sm">${card.original_price}</span>
                )}
              </div>
              
              <div className="flex items-center gap-3">
                <span className={`text-sm font-bold ${inStock ? 'text-green-600' : 'text-red-600'}`}>
                  {inStock ? `${card.stock_quantity} left` : 'Out of Stock'}
                </span>
                <button
                  onClick={() => handleAddToCart(card)}
                  disabled={!inStock}
                  className={`px-4 py-2 rounded-xl font-bold transition-all duration-300 flex items-center gap-2 border-2 border-black ${
                    inStock
                      ? 'bg-[#fa98d4] hover:bg-[#ff6b9d] text-white hover:scale-105'
                      : 'bg-gray-400 text-gray-600 cursor-not-allowed'
                  }`}
                >
                  <ShoppingCart className="w-4 h-4" />
                  {inStock ? 'Add' : 'Sold'}
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 border-4 border-black hover:border-[#fa98d4] transition-all duration-300 transform hover:scale-105 group shadow-xl hover:shadow-2xl">
       <div className="relative mb-4 overflow-hidden rounded-lg border-2 border-black">
          <img
            src={card.image_url}
            alt={card.name}
            className="w-full aspect-[5/7] object-contain bg-white"
          />
          
          {card.video_episode && (
            <div className="absolute top-2 left-2 bg-red-600/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1 border-2 border-white">
              <Play className="w-3 h-3 text-white fill-current" />
              <span className="text-white text-xs font-bold">{card.video_episode}</span>
            </div>
          )}
          
          <div className="absolute top-2 right-2">
            <button className="bg-white/90 backdrop-blur-sm rounded-full p-2 hover:bg-[#fa98d4] transition-colors border-2 border-black shadow-lg">
              <Heart className="h-4 w-4 text-black" />
            </button>
          </div>
          
          <div className="absolute bottom-2 left-2">
            <span className={`px-2 py-1 rounded-full text-xs font-bold border-2 border-black ${
              card.rarity === 'Legendary' ? 'bg-[#fa98d4] text-white' :
              card.rarity === 'Rare' ? 'bg-[#ff6b9d] text-white' :
              'bg-[#3a4bcc] text-white'
            }`}>
              {card.rarity}
            </span>
          </div>
          
          <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 border-2 border-black">
            <span className="text-black text-xs font-bold">{card.condition}</span>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-black font-black text-lg line-clamp-2 group-hover:text-[#ff6b9d] transition-colors">
            {card.name}
          </h3>
          
          {card.set_name && (
            <div className="bg-[#fa98d4]/20 rounded-lg p-2 border border-[#fa98d4]/30">
              <p className="text-black/70 text-xs font-bold mb-1">SET:</p>
              <p className="text-black text-sm font-black">{card.set_name}</p>
            </div>
          )}
          
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < rating ? 'text-[#fa98d4] fill-current' : 'text-gray-400'
                }`}
              />
            ))}
            <span className="text-black/60 text-sm ml-2">({rating})</span>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-2xl font-black text-[#ff6b9d]">${card.price}</span>
            {card.original_price && card.original_price > card.price && (
              <span className="text-black/60 line-through">${card.original_price}</span>
            )}
          </div>

          <div className="flex items-center justify-between">
            <span className={`text-sm font-semibold ${inStock ? 'text-green-600' : 'text-red-600'}`}>
              {inStock ? `${card.stock_quantity} in Stock` : 'Out of Stock'}
            </span>
            <span className="text-xs text-black/60 font-bold">Condition Guaranteed</span>
          </div>

          <button
            onClick={() => handleAddToCart(card)}
            disabled={!inStock}
            className={`w-full py-3 px-4 rounded-2xl font-bold transition-all duration-300 flex items-center justify-center space-x-2 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 ${
              inStock
                ? 'bg-[#fa98d4] hover:bg-[#ff6b9d] text-white font-black hover:scale-105'
                : 'bg-gray-400 text-gray-600 cursor-not-allowed'
            }`}
          >
            <ShoppingCart className="h-4 w-4" />
            <span>{inStock ? 'Add to Cart' : 'Sold Out'}</span>
          </button>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-[#3a4bcc] via-[#2a3ba0] to-[#1a2b80] z-50 flex items-center justify-center">
        <div className="text-white text-2xl font-bold">Loading cards...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-[#3a4bcc] via-[#2a3ba0] to-[#1a2b80] z-50 flex items-center justify-center">
        <div className="text-red-400 text-2xl font-bold">Error loading cards: {error}</div>
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

      {/* Main Header - Same as home page */}
      <header className="relative z-10 bg-gradient-to-r from-[#fa98d4] to-[#ff6b9d] backdrop-blur-md border-b-4 border-black shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <button
                  onClick={onClose}
                  className="hover:opacity-80 transition-opacity cursor-pointer"
                >
                  <img 
                    src="/Logo 2.png" 
                    alt="The Lucky Egg .Co" 
                    className="h-12 w-auto drop-shadow-lg"
                  />
                </button>
              </div>
            </div>

            {/* Navigation */}
            <nav className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <a href="#" className="text-black hover:text-white px-4 py-2 text-sm font-black transition-colors rounded-lg hover:bg-black/20">
                  Latest Pulls
                </a>
                <button 
                  className="text-black hover:text-white px-4 py-2 text-sm font-black transition-colors rounded-lg hover:bg-black/20 bg-black/20"
                >
                  All Cards
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
              <button
                onClick={onClose}
                className="bg-white/90 backdrop-blur-sm rounded-full p-3 hover:bg-white transition-colors border-3 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1"
              >
                <Menu className="h-5 w-5 text-black" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Shop Controls Bar */}
      <div className="sticky top-16 z-10 bg-white/10 backdrop-blur-md border-b-2 border-white/20 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-12">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-black text-white">Card Shop</h1>
              <span className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-white font-bold text-sm">
                {filteredCards.length} cards
              </span>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'grid' ? 'bg-white/20 text-white' : 'text-white/70 hover:text-white'
                  }`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'list' ? 'bg-white/20 text-white' : 'text-white/70 hover:text-white'
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
              
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="bg-white/20 backdrop-blur-sm rounded-full p-2 hover:bg-white/30 transition-colors md:hidden"
              >
                <Filter className="h-5 w-5 text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:w-80 space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            {/* Search */}
            <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 border-4 border-black shadow-xl">
              <h3 className="text-xl font-black text-black mb-4 flex items-center gap-2">
                <Search className="w-5 h-5 text-[#fa98d4]" />
                Search Cards
              </h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black/60 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search by name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white border-2 border-black rounded-xl text-black placeholder-black/60 focus:outline-none focus:border-[#fa98d4] transition-colors font-medium"
                />
              </div>
            </div>

            {/* Set Filter */}
            <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 border-4 border-black shadow-xl">
              <h3 className="text-xl font-black text-black mb-4">Filter by Set</h3>
              <select
                value={selectedSet}
                onChange={(e) => setSelectedSet(e.target.value)}
                className="w-full p-3 bg-white border-2 border-black rounded-xl text-black focus:outline-none focus:border-[#fa98d4] transition-colors font-medium"
              >
                <option value="all">All Sets ({cards.length})</option>
                {availableSets.map(set => {
                  const count = cards.filter(card => card.set_name === set).length;
                  return (
                    <option key={set} value={set}>
                      {set} ({count})
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Other Filters */}
            <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 border-4 border-black shadow-xl space-y-4">
              <h3 className="text-xl font-black text-black mb-4">More Filters</h3>
              
              <div>
                <label className="block text-sm font-bold text-black mb-2">Rarity</label>
                <select
                  value={selectedRarity}
                  onChange={(e) => setSelectedRarity(e.target.value)}
                  className="w-full p-2 bg-white border-2 border-black rounded-lg text-black focus:outline-none focus:border-[#fa98d4] transition-colors font-medium"
                >
                  <option value="all">All Rarities</option>
                  {availableRarities.map(rarity => (
                    <option key={rarity} value={rarity}>{rarity}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-black mb-2">Condition</label>
                <select
                  value={selectedCondition}
                  onChange={(e) => setSelectedCondition(e.target.value)}
                  className="w-full p-2 bg-white border-2 border-black rounded-lg text-black focus:outline-none focus:border-[#fa98d4] transition-colors font-medium"
                >
                  <option value="all">All Conditions</option>
                  {availableConditions.map(condition => (
                    <option key={condition} value={condition}>{condition}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-black mb-2">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full p-2 bg-white border-2 border-black rounded-lg text-black focus:outline-none focus:border-[#fa98d4] transition-colors font-medium"
                >
                  <option value="newest">Newest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">Name A-Z</option>
                </select>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {filteredCards.length === 0 ? (
              <div className="bg-white/95 backdrop-blur-md rounded-3xl p-12 border-4 border-black shadow-xl text-center">
                <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-2xl font-black text-black mb-2">No Cards Found</h3>
                <p className="text-gray-600 mb-6">
                  {searchTerm || selectedSet !== 'all' || selectedRarity !== 'all' || selectedCondition !== 'all'
                    ? 'Try adjusting your filters to see more results.'
                    : 'No cards are currently available in the shop.'}
                </p>
                {(searchTerm || selectedSet !== 'all' || selectedRarity !== 'all' || selectedCondition !== 'all') && (
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedSet('all');
                      setSelectedRarity('all');
                      setSelectedCondition('all');
                    }}
                    className="bg-[#fa98d4] hover:bg-[#ff6b9d] text-white font-black py-3 px-6 rounded-xl transition-colors"
                  >
                    Clear All Filters
                  </button>
                )}
              </div>
            ) : (
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
                {filteredCards.map((card) => (
                  <ProductCard key={card.id} card={card} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopPage;