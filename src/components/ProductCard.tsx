import React from 'react';
import { ShoppingCart, Heart, Star, Play } from 'lucide-react';

interface ProductCardProps {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rarity: string;
  rating: number;
  inStock: boolean;
  videoEpisode?: string;
  pullDate?: string;
  condition: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  name,
  price,
  originalPrice,
  image,
  rarity,
  rating,
  inStock,
  videoEpisode,
  pullDate,
  condition,
}) => {
  return (
    <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 border-4 border-black hover:border-[#fa98d4] transition-all duration-300 transform hover:scale-105 group shadow-xl hover:shadow-2xl">
      {/* Product Image */}
      <div className="relative mb-4 overflow-hidden rounded-2xl border-2 border-black">
        <img
          src={image}
          alt={name}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
        />
        
        {/* Video Badge */}
        {videoEpisode && (
          <div className="absolute top-2 left-2 bg-red-600/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1 border-2 border-white">
            <Play className="w-3 h-3 text-white fill-current" />
            <span className="text-white text-xs font-bold">{videoEpisode}</span>
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
        {pullDate && (
          <div className="bg-[#fa98d4]/20 rounded-lg p-2 border border-[#fa98d4]/30">
            <p className="text-black/70 text-xs font-bold mb-1">PULLED LIVE:</p>
            <p className="text-black text-sm font-black">{pullDate}</p>
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
          {originalPrice && (
            <span className="text-black/60 line-through">${originalPrice}</span>
          )}
        </div>

        {/* Stock Status */}
        <div className="flex items-center justify-between">
          <span className={`text-sm font-semibold ${inStock ? 'text-green-600' : 'text-red-600'}`}>
            {inStock ? 'In Stock' : 'Out of Stock'}
          </span>
          <span className="text-xs text-black/60 font-bold">Condition Guaranteed</span>
        </div>

        {/* Add to Cart Button */}
        <button
          disabled={!inStock}
          className={`w-full py-3 px-4 rounded-2xl font-bold transition-all duration-300 flex items-center justify-center space-x-2 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 ${
            inStock
              ? 'bg-[#fa98d4] hover:bg-[#ff6b9d] text-white font-black'
              : 'bg-gray-400 text-gray-600 cursor-not-allowed'
          }`}
        >
          <ShoppingCart className="h-4 w-4" />
          <span>{inStock ? 'Buy Now' : 'Sold Out'}</span>
        </button>
      </div>
    </div>
  );
};

export default ProductCard;