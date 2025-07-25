import React, { useState, useEffect } from 'react';
import { ArrowLeft, Search, ShoppingCart, Heart, Star, Play, Package, RefreshCw } from 'lucide-react';
import { supabase, Card } from '../lib/supabase';
import { useCart } from '../contexts/CartContext';
import StarField from './StarField';

interface ShopPageProps {
  onClose: () => void;
}

const ShopPage: React.FC<ShopPageProps> = ({ onClose }) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRarity, setSelectedRarity] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const { addItem, toggleCart, getCartCount } = useCart();

  // Fetch cards from database
  const fetchCards = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('cards')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setCards(data || []);
    } catch (err) {
      console.error('Error fetching cards:', err);
      setError('Failed to load cards. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Load cards on component mount
  useEffect(() => {
    fetchCards();
  }, []);

  // Filter and sort cards
  const filteredCards = cards
    .filter(card => {
      const matchesSearch = card.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRarity = selectedRarity === 'all' || card.rarity === selectedRarity;
      return matchesSearch && matchesRarity;
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

  const handleRefresh = () => {
    fetchCards();
  };

  // Get unique rarities
  const availableRarities = Array.from(new Set(cards.map(card => card.rarity)));

  if (loading) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-[#3a4bcc] via-[#2a3ba0] to-[#1a2b80] z-50 flex items-center justify-center">
        <StarField />
        <div className="bg-white/95 backdrop-blur-md rounded-3xl p-8 border-4 border-black shadow-2xl text-center">
          <div className="w-12 h-12 border-4 border-[#fa98d4] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-2xl font-black text-black">Loading Cards...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-[#3a4bcc] via-[#2a3ba0] to-[#1a2b80] z-50 flex items-center justify-center">
        <StarField />
        <div className="bg-white/95 backdrop-blur-md rounded-3xl p-8 border-4 border-black shadow-2xl text-center max-w-md">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <div className="text-2xl font-black text-black mb-4">Oops! Something went wrong</div>
          <div className="text-gray-600 mb-6">{error}</div>
          <div className="flex gap-4 justify-center">
            <button
              onClick={handleRefresh}
              className="bg-[#fa98d4] hover:bg-[#ff6b9d] text-white font-black py-3 px-6 rounded-xl transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={onClose}
              className="bg-gray-600 hover:bg-gray-700 text-white font-black py-3 px-6 rounded-xl transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
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
              onClick={onClose}
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
            
            <button 
              onClick={toggleCart}
              className="text-black hover:text-white transition-colors relative p-2 rounded-lg hover:bg-black/20"
            >
              <ShoppingCart className="h-6 w-6" />
              {getCartCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold border-2 border-white">
                  {getCartCount()}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-black text-white mb-4 tracking-tight">
            Card <span className="text-transparent bg-gradient-to-r from-[#fa98d4] to-[#ff6b9d] bg-clip-text">Shop</span>
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto font-medium">
            Every card pulled live on stream with guaranteed authenticity
          </p>
        </div>

        {/* Controls */}
        <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 border-4 border-black shadow-xl mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-black font-black text-lg">
                {filteredCards.length} Cards Available
              </span>
              <button
                onClick={handleRefresh}
                className="bg-[#fa98d4] hover:bg-[#ff6b9d] text-white p-2 rounded-lg transition-colors"
                title="Refresh cards"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black/60 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search cards..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-white border-2 border-black rounded-lg text-black placeholder-black/60 focus:outline-none focus:border-[#fa98d4] transition-colors font-medium w-full sm:w-64"
                />
              </div>

              {/* Rarity Filter */}
              <select
                value={selectedRarity}
                onChange={(e) => setSelectedRarity(e.target.value)}
                className="px-4 py-2 bg-white border-2 border-black rounded-lg text-black focus:outline-none focus:border-[#fa98d4] transition-colors font-medium"
              >
                <option value="all">All Rarities</option>
                {availableRarities.map(rarity => (
                  <option key={rarity} value={rarity}>{rarity}</option>
                ))}
              </select>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 bg-white border-2 border-black rounded-lg text-black focus:outline-none focus:border-[#fa98d4] transition-colors font-medium"
              >
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name A-Z</option>
              </select>
            </div>
          </div>
        </div>

        {/* Cards Grid */}
        {filteredCards.length === 0 ? (
          <div className="bg-white/95 backdrop-blur-md rounded-3xl p-12 border-4 border-black shadow-xl text-center">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-black text-black mb-2">No Cards Found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || selectedRarity !== 'all'
                ? 'Try adjusting your search or filters.'
                : 'No cards are currently available.'}
            </p>
            {(searchTerm || selectedRarity !== 'all') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedRarity('all');
                }}
                className="bg-[#fa98d4] hover:bg-[#ff6b9d] text-white font-black py-3 px-6 rounded-xl transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCards.map((card) => (
              <div key={card.id} className="bg-white/95 backdrop-blur-md rounded-3xl p-6 border-4 border-black hover:border-[#fa98d4] transition-all duration-300 transform hover:scale-105 group shadow-xl hover:shadow-2xl">
                {/* Card Image */}
                <div className="relative mb-4 overflow-hidden rounded-lg border-2 border-black">
                  <img
                    src={card.image_url}
                    alt={card.name}
                    className="w-full aspect-[5/7] object-contain bg-white"
                  />
                  
                  {/* Video Badge */}
                  {card.video_episode && (
                    <div className="absolute top-2 left-2 bg-red-600/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1 border-2 border-white">
                      <Play className="w-3 h-3 text-white fill-current" />
                      <span className="text-white text-xs font-bold">{card.video_episode}</span>
                    </div>
                  )}
                  
                  {/* Heart Button */}
                  <div className="absolute top-2 right-2">
                    <button className="bg-white/90 backdrop-blur-sm rounded-full p-2 hover:bg-[#fa98d4] transition-colors border-2 border-black shadow-lg">
                      <Heart className="h-4 w-4 text-black" />
                    </button>
                  </div>
                  
                  {/* Rarity Badge */}
                  <div className="absolute bottom-2 left-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold border-2 border-black ${
                      card.rarity === 'Legendary' ? 'bg-[#fa98d4] text-white' :
                      card.rarity === 'Rare' ? 'bg-[#ff6b9d] text-white' :
                      'bg-[#3a4bcc] text-white'
                    }`}>
                      {card.rarity}
                    </span>
                  </div>
                  
                  {/* Condition Badge */}
                  <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 border-2 border-black">
                    <span className="text-black text-xs font-bold">{card.condition}</span>
                  </div>
                </div>

                {/* Card Info */}
                <div className="space-y-3">
                  <h3 className="text-black font-black text-lg line-clamp-2 group-hover:text-[#ff6b9d] transition-colors">
                    {card.name}
                  </h3>
                  
                  {/* Set Info */}
                  {card.set_name && (
                    <div className="bg-[#fa98d4]/20 rounded-lg p-2 border border-[#fa98d4]/30">
                      <p className="text-black/70 text-xs font-bold mb-1">SET:</p>
                      <p className="text-black text-sm font-black">{card.set_name}</p>
                    </div>
                  )}
                  
                  {/* Rating */}
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 text-[#fa98d4] fill-current"
                      />
                    ))}
                    <span className="text-black/60 text-sm ml-2">(5.0)</span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-black text-[#ff6b9d]">${card.price}</span>
                    {card.original_price && card.original_price > card.price && (
                      <span className="text-black/60 line-through">${card.original_price}</span>
                    )}
                  </div>

                  {/* Stock Status */}
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-semibold ${card.stock_quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {card.stock_quantity > 0 ? `${card.stock_quantity} in Stock` : 'Out of Stock'}
                    </span>
                    <span className="text-xs text-black/60 font-bold">Authentic</span>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    onClick={() => handleAddToCart(card)}
                    disabled={card.stock_quantity === 0}
                    className={`w-full py-3 px-4 rounded-2xl font-bold transition-all duration-300 flex items-center justify-center space-x-2 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 ${
                      card.stock_quantity > 0
                        ? 'bg-[#fa98d4] hover:bg-[#ff6b9d] text-white font-black hover:scale-105'
                        : 'bg-gray-400 text-gray-600 cursor-not-allowed'
                    }`}
                  >
                    <ShoppingCart className="h-4 w-4" />
                    <span>{card.stock_quantity > 0 ? 'Add to Cart' : 'Sold Out'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopPage;