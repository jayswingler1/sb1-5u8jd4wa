import React from 'react';
import { Play, Star, Shield, Clock, Zap, Trophy, Sparkles } from 'lucide-react';

const Hero: React.FC = () => {

  const handleNavigation = (hash: string) => {
    window.location.hash = hash;
    window.location.reload();
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden pt-8 sm:pt-12 lg:pt-16">
      {/* Hero Content */}
      <div className="relative z-10 text-center max-w-6xl mx-auto -mt-12 sm:-mt-16 lg:-mt-24">
        {/* Main Headline with enhanced styling */}
        <div className="relative mb-4">
          {/* Main text */}
          <h1 className="mb-4">
            <div className="relative overflow-hidden">
            <img 
              src="/Lucky Egg Logo.png" 
              alt="The Lucky Egg .Co - Fresh Pulls, Fair Prices" 
              className="mx-auto max-w-xs sm:max-w-lg lg:max-w-2xl h-auto animate-modern-logo-entrance"
            />
            </div>
          </h1>
        </div>

        {/* Subtitle with enhanced styling */}
        <div className="relative mb-6 sm:mb-8 mt-8 sm:mt-12 lg:mt-16">
          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-white/90 max-w-4xl mx-auto font-medium leading-relaxed px-4">
            Watch me pull cards live on YouTube, then buy them directly from me. 
            Every card comes with <span className="text-white font-bold">guaranteed authenticity</span> and condition transparency.
          </p>
        </div>

        {/* Enhanced CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-8 sm:mb-12 mt-8 sm:mt-12 lg:mt-16">
          <button className="group relative bg-[#fa98d4] hover:bg-[#ff6b9d] text-white font-black py-4 sm:py-5 lg:py-6 px-8 sm:px-10 lg:px-12 rounded-xl sm:rounded-2xl text-lg sm:text-xl transition-all duration-300 shadow-2xl hover:shadow-3xl hover:scale-105 border-4 border-white/20 overflow-hidden w-full sm:w-56 lg:w-64 max-w-xs">
            {/* Button glow effect */}
            <div className="absolute inset-0 bg-[#fa98d4] opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300"></div>
            Watch Latest Pull
          </button>
          
          <button className="group relative bg-white/10 backdrop-blur-md hover:bg-white/20 text-white font-black py-4 sm:py-5 lg:py-6 px-8 sm:px-10 lg:px-12 rounded-xl sm:rounded-2xl text-lg sm:text-xl transition-all duration-300 shadow-2xl hover:shadow-3xl border-4 border-white/30 hover:border-[#fa98d4] overflow-hidden w-full sm:w-56 lg:w-64 max-w-xs">
            {/* Button glow effect */}
            <div className="absolute inset-0 bg-[#fa98d4] opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-300"></div>
            View Collection
          </button>
        </div>

      </div>
    </section>
  );
};

export default Hero;