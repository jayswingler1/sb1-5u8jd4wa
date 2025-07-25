import React from 'react';
import { Play, Star, Shield, Clock, Zap, Trophy, Sparkles } from 'lucide-react';

const Hero: React.FC = () => {

  const handleNavigation = (hash: string) => {
    window.location.hash = hash;
    window.location.reload();
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden pt-0">
      {/* Live Badge - Top Left */}
      <div className="absolute top-4 left-8 z-20">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-600 backdrop-blur-sm border-2 border-white rounded-full px-4 py-2 shadow-lg">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          <span className="text-white font-bold text-sm tracking-wide">LIVE PULLS ON YOUTUBE</span>
        </div>
      </div>
      
      {/* Hero Content */}
      <div className="relative z-10 text-center max-w-6xl mx-auto -mt-20">
        {/* Main Headline with enhanced styling */}
        <div className="relative mb-4">
          {/* Main text */}
          <h1 className="mb-4">
            <div className="relative overflow-hidden">
            <img 
              src="/Lucky Egg Logo.png" 
              alt="The Lucky Egg .Co - Fresh Pulls, Fair Prices" 
              className="mx-auto max-w-2xl h-auto animate-modern-logo-entrance"
            />
            </div>
          </h1>
        </div>

        {/* Subtitle with enhanced styling */}
        <div className="relative mb-8">
          <p className="text-2xl md:text-3xl text-white/90 max-w-4xl mx-auto font-medium leading-relaxed">
            Watch me pull cards live on YouTube, then buy them directly from me. 
            Every card comes with <span className="text-white font-bold">guaranteed authenticity</span> and condition transparency.
          </p>
        </div>

        {/* Enhanced CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
          <button className="group relative bg-gradient-to-r from-[#fa98d4] to-[#ff6b9d] hover:from-[#ff6b9d] hover:to-[#fa98d4] text-white font-black py-6 px-12 rounded-2xl text-xl transition-all duration-300 shadow-2xl hover:shadow-3xl hover:scale-105 border-4 border-white/20 overflow-hidden">
            {/* Button glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#fa98d4] to-[#ff6b9d] opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300"></div>
            Watch Latest Pull
          </button>
          
          <button className="group relative bg-white/10 backdrop-blur-md hover:bg-white/20 text-white font-black py-6 px-12 rounded-2xl text-xl transition-all duration-300 shadow-2xl hover:shadow-3xl border-4 border-white/30 hover:border-[#fa98d4] overflow-hidden">
            {/* Button glow effect */}
            <div className="absolute inset-0 bg-[#fa98d4] opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-300"></div>
            <div className="relative flex items-center gap-3">
              <div className="bg-white/20 rounded-full p-2">
                <Shield className="w-6 h-6 group-hover:scale-110 transition-transform" />
              </div>
              View Collection
            </div>
          </button>
        </div>

        {/* Enhanced Trust Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div className="group relative bg-white/5 backdrop-blur-md rounded-3xl p-8 border-2 border-white/20 hover:border-[#fa98d4]/50 transition-all duration-300 transform hover:scale-105 hover:-translate-y-2">
            <div className="text-4xl font-black text-white mb-2 group-hover:text-[#fa98d4] transition-colors">2.5K+</div>
            <div className="text-white/80 font-bold text-lg">Cards Pulled Live</div>
            <div className="text-white/60 text-sm mt-2">Every single card documented</div>
          </div>
          
          <div className="group relative bg-white/5 backdrop-blur-md rounded-3xl p-8 border-2 border-white/20 hover:border-[#fa98d4]/50 transition-all duration-300 transform hover:scale-105 hover:-translate-y-2">
            <div className="text-4xl font-black text-white mb-2 group-hover:text-[#fa98d4] transition-colors">15K+</div>
            <div className="text-white/80 font-bold text-lg">YouTube Subscribers</div>
            <div className="text-white/60 text-sm mt-2">Growing community of collectors</div>
          </div>
          
          <div className="group relative bg-white/5 backdrop-blur-md rounded-3xl p-8 border-2 border-white/20 hover:border-[#fa98d4]/50 transition-all duration-300 transform hover:scale-105 hover:-translate-y-2">
            <div className="text-4xl font-black text-white mb-2 group-hover:text-[#fa98d4] transition-colors">98%</div>
            <div className="text-white/80 font-bold text-lg">Positive Reviews</div>
            <div className="text-white/60 text-sm mt-2">Trusted by collectors worldwide</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;