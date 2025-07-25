import React from 'react';
import { ArrowLeft, Youtube, Play, Star, Trophy, Heart, Zap, Shield, Clock } from 'lucide-react';
import StarField from './StarField';

interface AboutPageProps {
  onClose: () => void;
}

const AboutPage: React.FC<AboutPageProps> = ({ onClose }) => {
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
                src="/Logo 2.png" 
                alt="The Lucky Egg .Co" 
                className="h-12 w-auto drop-shadow-lg"
              />
            </div>
            
            <div className="w-24"></div> {/* Spacer for centering */}
          </div>
        </div>
      </header>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          {/* Video-style Header Image */}
          <div className="relative mb-8">
            <div className="relative mx-auto max-w-4xl">
              <img
                src="/Sequence 02.00_00_22_38.Still003.png"
                alt="Jay - The Lucky Egg .Co Owner"
                className="w-full aspect-video object-cover rounded-2xl border-4 border-black shadow-2xl"
              />
              
              {/* Video Overlay Elements */}
              <div className="absolute top-4 left-4 bg-red-600/90 backdrop-blur-sm rounded-full px-4 py-2 flex items-center gap-2 border-2 border-white shadow-lg">
                <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                <span className="text-white font-bold text-sm">LIVE</span>
              </div>
              
              <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-sm rounded-lg px-4 py-2 border-2 border-white/20">
                <span className="text-white font-bold text-lg">Hey, I'm Jay! 👋</span>
              </div>
              
              <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1 border-2 border-black">
                <span className="text-black font-bold text-sm">The Lucky Egg .Co</span>
              </div>
              
              {/* Play button overlay for video feel */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 bg-black/20 rounded-2xl">
                <div className="bg-white/90 backdrop-blur-sm rounded-full p-6 border-4 border-black shadow-xl">
                  <Play className="w-12 h-12 text-black fill-current" />
                </div>
              </div>
            </div>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-black text-white mb-6 tracking-tight">
            About <span className="text-transparent bg-gradient-to-r from-[#fa98d4] to-[#ff6b9d] bg-clip-text">The Lucky Egg</span>
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto font-medium leading-relaxed">
            Your trusted source for authentic Pokémon cards, pulled live and sold with complete transparency.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Story Section */}
          <div className="bg-white/95 backdrop-blur-md rounded-3xl p-8 border-4 border-black shadow-xl order-2 lg:order-1">
            <div className="flex items-center gap-3 mb-6">
              <Heart className="w-8 h-8 text-[#fa98d4]" />
              <h2 className="text-3xl font-black text-black">My Story</h2>
            </div>
            
            <div className="space-y-4 text-black/80 font-medium leading-relaxed">
              <p>
                Hey there! I'm Jay, the person behind The Lucky Egg .Co. What started as a passion for Pokémon cards 
                has grown into something amazing - a community of collectors who value transparency and authenticity.
              </p>
              
              <p>
                I began streaming pack openings on YouTube because I wanted to share the excitement of pulling rare cards. 
                But I noticed something - people wanted to buy the cards they watched me pull! That's when The Lucky Egg was born.
              </p>
              
              <p>
                Every single card in my shop has been pulled live on stream. No mystery about condition, no questions about 
                authenticity. You see it pulled, you know exactly what you're getting.
              </p>
            </div>
          </div>

          {/* Personal Image Section */}
          <div className="bg-white/95 backdrop-blur-md rounded-3xl p-8 border-4 border-black shadow-xl order-1 lg:order-2">
            <div className="text-center">
              <h3 className="text-2xl font-black text-black mb-4">Content Creator & Pokémon Card Enthusiast</h3>
              
              <div className="bg-gradient-to-r from-[#fa98d4]/20 to-[#ff6b9d]/20 rounded-2xl p-6 border-2 border-[#fa98d4]/30">
                <p className="text-black font-bold text-lg mb-4">
                  🎥 Watch me pull cards live on YouTube<br/>
                  📦 Buy the exact cards you see me pull<br/>
                  ✅ 100% authentic with video proof
                </p>
                
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="bg-white/50 rounded-xl p-3 border border-[#fa98d4]/50">
                    <div className="text-2xl font-black text-[#fa98d4]">15K+</div>
                    <div className="text-black/70 font-bold text-sm">Subscribers</div>
                  </div>
                  <div className="bg-white/50 rounded-xl p-3 border border-[#fa98d4]/50">
                    <div className="text-2xl font-black text-[#fa98d4]">2.5K+</div>
                    <div className="text-black/70 font-bold text-sm">Cards Pulled</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* YouTube Stats */}
          <div className="bg-white/95 backdrop-blur-md rounded-3xl p-8 border-4 border-black shadow-xl order-3 lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <Youtube className="w-8 h-8 text-red-600" />
              <h2 className="text-3xl font-black text-black">YouTube Channel</h2>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-red-50 rounded-2xl p-4 border-2 border-red-200">
                  <div className="text-2xl font-black text-red-600">15K+</div>
                  <div className="text-red-800 font-bold">Subscribers</div>
                </div>
                <div className="bg-red-50 rounded-2xl p-4 border-2 border-red-200">
                  <div className="text-2xl font-black text-red-600">500+</div>
                  <div className="text-red-800 font-bold">Videos</div>
                </div>
                <div className="bg-red-50 rounded-2xl p-4 border-2 border-red-200">
                  <div className="text-2xl font-black text-red-600">2.5K+</div>
                  <div className="text-red-800 font-bold">Cards Pulled</div>
                </div>
                <div className="bg-red-50 rounded-2xl p-4 border-2 border-red-200">
                  <div className="text-2xl font-black text-red-600">98%</div>
                  <div className="text-red-800 font-bold">Positive Reviews</div>
                </div>
              </div>
              
              <a 
                href="https://www.youtube.com/@jayswingler2" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-4 px-6 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 border-4 border-black flex items-center justify-center gap-3"
              >
                <Play className="w-5 h-5 fill-current" />
                Watch Latest Pulls
              </a>
            </div>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="bg-white/95 backdrop-blur-md rounded-3xl p-8 border-4 border-black shadow-xl mb-16">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-black text-black mb-4">Why Choose The Lucky Egg?</h2>
            <p className="text-black/70 text-lg font-medium">
              We're not just another card shop - we're your trusted collecting partner.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-gradient-to-br from-[#fa98d4]/20 to-[#ff6b9d]/20 rounded-2xl border-2 border-[#fa98d4]/30">
              <Shield className="w-12 h-12 text-[#fa98d4] mx-auto mb-4" />
              <h3 className="font-black text-black text-lg mb-2">100% Authentic</h3>
              <p className="text-black/70 text-sm font-medium">Every card pulled live on stream with video proof</p>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-br from-[#fa98d4]/20 to-[#ff6b9d]/20 rounded-2xl border-2 border-[#fa98d4]/30">
              <Star className="w-12 h-12 text-[#fa98d4] mx-auto mb-4" />
              <h3 className="font-black text-black text-lg mb-2">Condition Guaranteed</h3>
              <p className="text-black/70 text-sm font-medium">Accurate condition descriptions with detailed photos</p>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-br from-[#fa98d4]/20 to-[#ff6b9d]/20 rounded-2xl border-2 border-[#fa98d4]/30">
              <Zap className="w-12 h-12 text-[#fa98d4] mx-auto mb-4" />
              <h3 className="font-black text-black text-lg mb-2">Fast Shipping</h3>
              <p className="text-black/70 text-sm font-medium">Same-day shipping on all orders placed before 3 PM</p>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-br from-[#fa98d4]/20 to-[#ff6b9d]/20 rounded-2xl border-2 border-[#fa98d4]/30">
              <Clock className="w-12 h-12 text-[#fa98d4] mx-auto mb-4" />
              <h3 className="font-black text-black text-lg mb-2">Live Updates</h3>
              <p className="text-black/70 text-sm font-medium">Get notified the moment new cards are pulled</p>
            </div>
          </div>
        </div>

        {/* Community Section */}
        <div className="bg-gradient-to-r from-[#fa98d4]/20 to-[#ff6b9d]/20 backdrop-blur-md rounded-3xl p-8 border-4 border-[#fa98d4]/30 shadow-xl text-center">
          <Trophy className="w-16 h-16 text-[#fa98d4] mx-auto mb-6" />
          <h2 className="text-4xl font-black text-white mb-4">Join Our Community</h2>
          <p className="text-white/90 text-lg font-medium mb-8 max-w-3xl mx-auto">
            Be part of a growing community of collectors who share your passion. Get early access to rare pulls, 
            exclusive discounts, and connect with fellow enthusiasts.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="https://www.youtube.com/@jayswingler2" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-red-600 hover:bg-red-700 text-white font-black py-4 px-8 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 border-4 border-black flex items-center justify-center gap-3"
            >
              <Youtube className="w-5 h-5" />
              Subscribe on YouTube
            </a>
            
            <button
              onClick={onClose}
              className="bg-[#fa98d4] hover:bg-[#ff6b9d] text-white font-black py-4 px-8 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 border-4 border-black"
            >
              Start Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;