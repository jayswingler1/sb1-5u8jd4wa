import React from 'react';
import { useCards } from '../hooks/useCards';
import { Card } from '../lib/supabase';
import { useCart } from '../contexts/CartContext';
import { ShoppingCart, Heart, Star, Play } from 'lucide-react';

interface ProductCardProps extends Card {
  // Additional props if needed
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  price,
  original_price,
  image_url,
  rarity,
  condition,
  stock_quantity,
  video_episode,
  pull_date,
  ...cardData
}) => {
  const inStock = stock_quantity > 0;
  const rating = 5; // You can make this dynamic later
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem({
      id,
      name,
      price,
      original_price,
      image_url,
      rarity,
      condition,
      stock_quantity,
      video_episode,
      pull_date,
      ...cardData
    });
  };

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 border-4 border-black hover:border-[#fa98d4] transition-all duration-300 transform hover:scale-105 group shadow-xl hover:shadow-2xl">
      {/* Product Image */}
     <div className="relative mb-4 overflow-hidden rounded-lg border-2 border-black">
        <img
          src={image_url}
          alt={name}
          className="w-full aspect-[5/7] object-contain bg-white"
        />
        
        {/* Video Badge */}
        {video_episode && (
          <div className="absolute top-2 left-2 bg-red-600/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1 border-2 border-white">
            <Play className="w-3 h-3 text-white fill-current" />
            <span className="text-white text-xs font-bold">{video_episode}</span>
          </div>
        )}
        
        <div className="absolute top-2 right-2">
          <button className="bg-white/90 backdrop-blur-sm rounded-full p-2 hover:bg-[#fa98d4] transition-colors border-2 border-black shadow-lg">
            <Heart className="h-4 w-4 text-black" />
          </button>
        </div>
        
        <div className="absolute bottom-2 left-2">
          <span className={`px-2 py-1 rounded-full text-xs font-bold border-2 border-black ${
            rarity === 'Legendary' ? 'bg-[#fa98d4] text-white' :
            rarity === 'Rare' ? 'bg-[#ff6b9d] text-white' :
            'bg-[#3a4bcc] text-white'
          }`}>
            {rarity}
          </span>
        </div>
        
        <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 border-2 border-black">
          <span className="text-black text-xs font-bold">{condition}</span>
        </div>
      </div>

      {/* Product Info */}
      <div className="space-y-3">
        <h3 className="text-black font-black text-lg line-clamp-2 group-hover:text-[#ff6b9d] transition-colors">{name}</h3>
        
        {/* Pull Info */}
        {pull_date && (
          <div className="bg-[#fa98d4]/20 rounded-lg p-2 border border-[#fa98d4]/30">
            <p className="text-black/70 text-xs font-bold mb-1">PULLED LIVE:</p>
            <p className="text-black text-sm font-black">{new Date(pull_date).toLocaleDateString()}</p>
          </div>
        )}
        
        {/* Rating */}
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

        {/* Price */}
        <div className="flex items-center space-x-2">
          <span className="text-2xl font-black text-[#ff6b9d]">${price}</span>
          {original_price && original_price > price && (
            <span className="text-black/60 line-through">${original_price}</span>
          )}
        </div>

        {/* Stock Status */}
        <div className="flex items-center justify-between">
          <span className={`text-sm font-semibold ${inStock ? 'text-green-600' : 'text-red-600'}`}>
            {inStock ? `${stock_quantity} in Stock` : 'Out of Stock'}
          </span>
          <span className="text-xs text-black/60 font-bold">Condition Guaranteed</span>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
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

const FeaturedProducts: React.FC = () => {
  const { cards, loading, error } = useCards(true); // Get featured cards only

  const handleViewAllCards = () => {
    window.location.hash = '#shop';
    window.location.reload();
  };

  if (loading) {
    return (
      <section className="relative z-10 py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="text-white text-xl">Loading cards...</div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="relative z-10 py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="text-red-400 text-xl">Error loading cards: {error}</div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative z-10 py-14 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-5xl md:text-6xl font-black text-white mb-6 tracking-tight">
            Premium <span className="text-transparent bg-gradient-to-r from-[#fa98d4] to-[#ff6b9d] bg-clip-text">Singles</span>
          </h2>
          <p className="text-xl text-white/90 max-w-3xl mx-auto font-medium leading-relaxed">
            Every card pulled live on stream with <span className="text-[#fa98d4] font-bold">guaranteed authenticity</span>. 
            Watch the pull, buy the card, get it shipped same day.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-6">
          {cards.map((card) => (
            <ProductCard key={card.id} {...card} />
          ))}
        </div>

        {cards.length === 0 && (
          <div className="text-center text-white/70 text-lg mb-16">
            No featured cards available at the moment.
          </div>
        )}

        <div className="text-center">
          <button 
            onClick={handleViewAllCards}
            className="inline-block bg-[#fa98d4] hover:bg-[#ff6b9d] text-white font-black py-5 px-10 rounded-3xl text-xl transition-all shadow-xl hover:shadow-2xl hover:scale-105 hover:-translate-y-1"
          >
            View All Cards
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;