import React, { useState, useEffect } from 'react';
import { ArrowLeft, Search, Filter, Grid, List, RefreshCw, ShoppingCart, Heart, Star, Play } from 'lucide-react';
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
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const { addItem } = useCart();

  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('cards')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setCards(data || []);
    } catch (err) {
      console.error('Error fetching cards:', err);
      setError('Failed to load cards. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (card: Card) => {
    addItem(card);
  };

  const handleClose = () => {
    window.location.hash = '';
    window.location.reload();
  };

  // Filter and sort cards
  const filteredCards = cards
    .filter(card => {
      const matchesSearch = card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           card.set_name?.toLowerCase().includes(searchTerm.toLowerCase());
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

  const rarities = ['all', 'Common', 'Uncommon', 'Rare', 'Legendary'];

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
            
            <button
              onClick={fetchCards}
              className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-black font-bold py-2 px-4 rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
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

        {/* Filters */}
        <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 border-4 border-black shadow-xl mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black/60 h-5 w-5" />
              <input
                type="text"
                placeholder="Search cards..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border-2 border-black rounded-xl text-black placeholder-black/60 focus:outline-none focus:border-[#fa98d4] transition-colors font-medium"
              />
            </div>

            {/* Filters */}
            <div className="flex gap-4 items-center">
              <select
                value={selectedRarity}
                onChange={(e) => setSelectedRarity(e.target.value)}
                className="px-4 py-3 bg-white border-2 border-black rounded-xl text-black font-bold focus:outline-none focus:border-[#fa98d4] transition-colors"
              >
                {rarities.map(rarity => (
                  <option key={rarity} value={rarity}>
                    {rarity === 'all' ? 'All Rarities' : rarity}
                  </option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 bg-white border-2 border-black rounded-xl text-black font-bold focus:outline-none focus:border-[#fa98d4] transition-colors"
              >
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name A-Z</option>
              </select>

              {/* View Mode Toggle */}
              <div className="flex bg-gray-200 rounded-lg p-1 border-2 border-black">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded transition-colors ${
                    viewMode === 'grid' ? 'bg-[#fa98d4] text-white' : 'text-black hover:bg-gray-300'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded transition-colors ${
                    viewMode === 'list' ? 'bg-[#fa98d4] text-white' : 'text-black hover:bg-gray-300'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4"></div>
            <p className="text-white text-xl font-bold">Loading cards...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-100 border-4 border-red-500 rounded-3xl p-8 text-center mb-8">
            <p className="text-red-800 text-xl font-bold mb-4">{error}</p>
            <button
              onClick={fetchCards}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-xl transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Results Count */}
        {!loading && !error && (
          <div className="mb-6">
            <p className="text-white/80 font-medium">
              Showing {filteredCards.length} of {cards.length} cards
            </p>
          </div>
        )}

        {/* Cards Grid/List */}
        {!loading && !error && (
          <div className={`${
            viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
              : 'space-y-4'
          }`}>
            {filteredCards.map((card) => (
              <div
                key={card.id}
                className={`bg-white/95 backdrop-blur-md rounded-3xl border-4 border-black hover:border-[#fa98d4] transition-all duration-300 transform hover:scale-105 group shadow-xl hover:shadow-2xl ${
                  viewMode === 'list' ? 'flex gap-6 p-6' : 'p-6'
                }`}
              >
                {/* Card Image */}
                <div className={`relative overflow-hidden rounded-lg border-2 border-black ${
                  viewMode === 'list' ? 'w-32 h-44 flex-shrink-0' : 'mb-4'
                }`}>
                  <img
                    src={card.image_url}
                    alt={card.name}
                    className={`object-contain bg-white ${
                      viewMode === 'list' ? 'w-full h-full' : 'w-full aspect-[5/7]'
                    }`}
                  />
                  
                  {/* Video Badge */}
                  {card.video_episode && (
                    <div className="absolute top-2 left-2 bg-red-600/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1 border border-white">
                      <Play className="w-2 h-2 text-white fill-current" />
                      <span className="text-white text-xs font-bold">{card.video_episode}</span>
                    </div>
                  )}
                  
                  {/* Rarity Badge */}
                  <div className="absolute bottom-2 left-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold border border-black ${
                      card.rarity === 'Legendary' ? 'bg-[#fa98d4] text-white' :
                      card.rarity === 'Rare' ? 'bg-[#ff6b9d] text-white' :
                      'bg-[#3a4bcc] text-white'
                    }`}>
                      {card.rarity}
                    </span>
                  </div>
                  
                  {/* Condition Badge */}
                  <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 border border-black">
                    <span className="text-black text-xs font-bold">{card.condition}</span>
                  </div>
                </div>

                {/* Card Info */}
                <div className={`space-y-3 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                  <h3 className="text-black font-black text-lg line-clamp-2 group-hover:text-[#ff6b9d] transition-colors">
                    {card.name}
                  </h3>
                  
                  {card.set_name && (
                    <p className="text-black/70 text-sm font-bold">{card.set_name}</p>
                  )}
                  
                  {/* Pull Info */}
                  {card.pull_date && (
                    <div className="bg-[#fa98d4]/20 rounded-lg p-2 border border-[#fa98d4]/30">
                      <p className="text-black/70 text-xs font-bold mb-1">PULLED LIVE:</p>
                      <p className="text-black text-sm font-black">
                        {new Date(card.pull_date).toLocaleDateString()}
                      </p>
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
                    <span className={`text-sm font-semibold ${
                      card.stock_quantity > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
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

        {/* No Results */}
        {!loading && !error && filteredCards.length === 0 && (
          <div className="text-center py-12">
            <p className="text-white/70 text-xl font-bold mb-4">No cards found</p>
            <p className="text-white/60">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopPage;