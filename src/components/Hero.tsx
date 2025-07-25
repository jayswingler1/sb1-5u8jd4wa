import React from 'react';
import { Play, Star, Shield, Clock, Zap, Trophy, Sparkles } from 'lucide-react';

const Hero: React.FC = () => {

  const handleNavigation = (hash: string) => {
    window.location.hash = hash;
    window.location.reload();
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden pt-4">
      {/* Hero Content */}
      <div className="relative z-10 text-center max-w-6xl mx-auto -mt-24">
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
        <div className="relative mb-8 mt-16">
          <p className="text-2xl md:text-3xl text-white/90 max-w-4xl mx-auto font-medium leading-relaxed">
            Watch me pull cards live on YouTube, then buy them directly from me. 
            Every card comes with <span className="text-white font-bold">guaranteed authenticity</span> and condition transparency.
          </p>
        </div>

        {/* Enhanced CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
          <button className="group relative bg-white hover:bg-gray-50 text-black font-black py-6 px-12 rounded-2xl text-xl transition-all duration-300 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 overflow-hidden">
            {/* Button glow effect */}
            <div className="absolute inset-0 bg-[#fa98d4] opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-300"></div>
            Watch Latest Pull
          </button>
          
          <button className="group relative bg-white hover:bg-gray-50 text-black font-black py-6 px-12 rounded-2xl text-xl transition-all duration-300 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 overflow-hidden">
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

      </div>
    </section>
  );
};

export default Hero;