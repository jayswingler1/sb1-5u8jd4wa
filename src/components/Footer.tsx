import React from 'react';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="relative z-10 bg-black/20 backdrop-blur-md border-t border-white/20 mt-2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-white">
              The Lucky Egg <span className="text-[#ffcc00]">.Co</span>
            </h3>
            <p className="text-white/70">
              Watch me pull cards live on YouTube, then buy them directly from me. Every card comes with guaranteed authenticity and condition transparency.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-white/70 hover:text-[#fa98d4] transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-white/70 hover:text-[#fa98d4] transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-white/70 hover:text-[#fa98d4] transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-white/70 hover:text-[#fa98d4] transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-white/70 hover:text-[#fa98d4] transition-colors">Latest Pulls</a></li>
              <li><a href="#" className="text-white/70 hover:text-[#fa98d4] transition-colors">All Cards</a></li>
              <li><a href="#" className="text-white/70 hover:text-[#fa98d4] transition-colors">YouTube Channel</a></li>
              <li><a href="#" className="text-white/70 hover:text-[#fa98d4] transition-colors">Live Streams</a></li>
              <li><a href="#" className="text-white/70 hover:text-[#fa98d4] transition-colors">Card Conditions</a></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Customer Service</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-white/70 hover:text-[#fa98d4] transition-colors">Contact Us</a></li>
              <li><a href="#" className="text-white/70 hover:text-[#fa98d4] transition-colors">Shipping Info</a></li>
              <li><a href="#" className="text-white/70 hover:text-[#fa98d4] transition-colors">Returns</a></li>
              <li><a href="#" className="text-white/70 hover:text-[#fa98d4] transition-colors">Authenticity</a></li>
              <li><a href="#" className="text-white/70 hover:text-[#fa98d4] transition-colors">Card Grading</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Contact Info</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-[#fa98d4]" />
                <span className="text-white/70">hello@luckyegg.co</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-[#fa98d4]" />
                <span className="text-white/70">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-[#fa98d4]" />
                <span className="text-white/70">123 Pokémon Street, Card City</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-white/60 text-sm">
              © 2024 The Lucky Egg .Co. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-white/60 hover:text-[#fa98d4] text-sm transition-colors">Privacy Policy</a>
              <a href="#" className="text-white/60 hover:text-[#fa98d4] text-sm transition-colors">Terms of Service</a>
              <a href="#" className="text-white/60 hover:text-[#fa98d4] text-sm transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};


export default Footer