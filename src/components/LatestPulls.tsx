import React from 'react';
import { Play, Calendar, Eye, TrendingUp } from 'lucide-react';

const LatestPulls: React.FC = () => {
  const latestPulls = [
    {
      id: 1,
      title: "INSANE Charizard Pull! 🔥",
      thumbnail: "https://images.pexels.com/photos/9072316/pexels-photo-9072316.jpeg?auto=compress&cs=tinysrgb&w=600",
      videoDate: "2 days ago",
      views: "45.2K",
      cardsAvailable: 12,
      topCard: "Charizard VMAX Rainbow",
      price: "$299.99"
    },
    {
      id: 2,
      title: "Opening 36 Packs - CRAZY LUCK! ⚡",
      thumbnail: "https://images.pexels.com/photos/9072319/pexels-photo-9072319.jpeg?auto=compress&cs=tinysrgb&w=600",
      videoDate: "5 days ago", 
      views: "32.8K",
      cardsAvailable: 8,
      topCard: "Pikachu Gold Card",
      price: "$149.99"
    },
    {
      id: 3,
      title: "Lost Origin Box Opening 📦",
      thumbnail: "https://images.pexels.com/photos/9072322/pexels-photo-9072322.jpeg?auto=compress&cs=tinysrgb&w=600",
      videoDate: "1 week ago",
      views: "28.1K", 
      cardsAvailable: 15,
      topCard: "Giratina VSTAR",
      price: "$89.99"
    }
  ];

  return (
    <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-3 bg-red-600/90 backdrop-blur-sm border-3 border-white/30 rounded-full px-6 py-3 mb-6 shadow-lg">
            <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
            <span className="text-white font-black text-sm tracking-wide">FRESH FROM YOUTUBE</span>
          </div>
          
          <h2 className="text-5xl md:text-6xl font-black text-white mb-6 tracking-tight">
            Latest <span className="text-transparent bg-gradient-to-r from-[#fa98d4] to-[#ff6b9d] bg-clip-text">Pulls</span>
          </h2>
          
          <p className="text-xl text-white/90 max-w-3xl mx-auto font-medium leading-relaxed">
            Watch the pulls happen live, then buy the exact cards you saw me pull. 
            Every card comes with <span className="text-[#fa98d4] font-bold">video proof</span> and guaranteed condition.
          </p>
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {latestPulls.map((video, index) => (
            <div key={video.id} className="group relative">
              {/* Video Card */}
              <div className="bg-white/95 backdrop-blur-md rounded-3xl overflow-hidden border-4 border-black hover:border-[#fa98d4] transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 shadow-xl hover:shadow-2xl">
                {/* Thumbnail */}
                <div className="relative overflow-hidden">
                  <img 
                    src={video.thumbnail} 
                    alt={video.title}
                    className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  
                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-red-600 rounded-full p-4 transform scale-75 group-hover:scale-100 transition-transform duration-300 shadow-lg">
                      <Play className="w-8 h-8 text-white fill-current" />
                    </div>
                  </div>
                  
                  {/* Video Stats */}
                  <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-2">
                    <Eye className="w-4 h-4 text-white" />
                    <span className="text-white text-sm font-bold">{video.views}</span>
                  </div>
                  
                  <div className="absolute top-3 right-3 bg-red-600/90 backdrop-blur-sm rounded-full px-3 py-1">
                    <span className="text-white text-sm font-bold">{video.cardsAvailable} cards</span>
                  </div>
                  
                  {/* Date Badge */}
                  <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-2 border-2 border-black">
                    <Calendar className="w-4 h-4 text-black" />
                    <span className="text-black text-sm font-bold">{video.videoDate}</span>
                  </div>
                </div>
                
                {/* Card Content */}
                <div className="p-6 space-y-4">
                  <h3 className="text-xl font-black text-black line-clamp-2 group-hover:text-[#ff6b9d] transition-colors">
                    {video.title}
                  </h3>
                  
                  {/* Featured Card */}
                  <div className="bg-gradient-to-r from-[#fa98d4]/20 to-[#ff6b9d]/20 rounded-2xl p-4 border-2 border-[#fa98d4]/30">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-black/70 text-sm font-bold mb-1">TOP PULL:</p>
                        <p className="text-black font-black text-lg">{video.topCard}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[#ff6b9d] font-black text-2xl">{video.price}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button className="flex-1 bg-red-600 hover:bg-red-700 text-white font-black py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl border-2 border-black">
                      <Play className="w-4 h-4" />
                      Watch
                    </button>
                    <button className="flex-1 bg-[#fa98d4] hover:bg-[#ff6b9d] text-white font-black py-3 px-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105">
                      Shop Cards
                    </button>
                  </div>
                </div>
                </div>
                
              {/* Floating Number Badge */}
              <div className="absolute -top-4 -left-4 bg-gradient-to-r from-[#fa98d4] to-[#ff6b9d] rounded-full w-12 h-12 flex items-center justify-center border-4 border-black shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                <span className="text-white font-black text-lg">#{index + 1}</span>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-red-600/90 to-red-700/90 backdrop-blur-md rounded-3xl p-8 border-4 border-white/20 shadow-2xl max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="bg-white rounded-full p-3">
                <TrendingUp className="w-8 h-8 text-red-600" />
              </div>
              <div className="text-left">
                <h3 className="text-2xl font-black text-white">Never Miss a Pull!</h3>
                <p className="text-white/90 font-medium">Subscribe for live notifications</p>
              </div>
            </div>
            
            <button className="bg-white hover:bg-gray-100 text-red-600 font-black py-4 px-8 rounded-2xl text-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 border-3 border-red-800">
              🔔 Subscribe to Channel
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LatestPulls