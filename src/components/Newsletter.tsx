import React from 'react';
import { useState } from 'react';
import { Mail, Gift } from 'lucide-react';
import { supabase } from '../lib/supabase';

const Newsletter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setMessage('Please enter your email address');
      return;
    }

    if (!supabase) {
      setMessage('Newsletter signup is not available at the moment');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const { error } = await supabase
        .from('email_subscribers')
        .insert([{
          email: email,
          first_name: firstName,
          subscription_source: 'website_newsletter'
        }]);

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          setMessage('You\'re already subscribed! 🎉');
        } else {
          throw error;
        }
      } else {
        setMessage('Successfully subscribed! Welcome to the Lucky Egg family! 🎉');
        setEmail('');
        setFirstName('');
      }
    } catch (error) {
      console.error('Newsletter signup error:', error);
      setMessage('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative z-10 py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/95 backdrop-blur-md rounded-3xl p-8 md:p-12 border-4 border-black shadow-2xl">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-gradient-to-r from-[#fa98d4] to-[#ff6b9d] rounded-full p-4 border-4 border-black shadow-lg">
                <Gift className="h-8 w-8 text-white" />
              </div>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-black text-black mb-4 tracking-tight">
              Never Miss a <span className="text-transparent bg-gradient-to-r from-[#fa98d4] to-[#ff6b9d] bg-clip-text">Pull</span>!
            </h2>
            
            <p className="text-xl text-black/80 mb-8 max-w-2xl mx-auto font-bold leading-relaxed">
              Get notified the moment I pull something amazing! Exclusive first access to rare cards, 
              subscriber discounts, and live stream alerts.
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto mb-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="First name (optional)"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full pl-4 pr-4 py-4 bg-white/90 backdrop-blur-sm border-4 border-black rounded-2xl text-black placeholder-black/60 focus:outline-none focus:border-[#fa98d4] transition-colors font-bold text-lg"
                  />
                </div>
              </div>
              <div className="flex-1 relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black/60 h-5 w-5" />
                <input
                  type="email"
                  required
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-4 bg-white/90 backdrop-blur-sm border-4 border-black rounded-2xl text-black placeholder-black/60 focus:outline-none focus:border-[#fa98d4] transition-colors font-bold text-lg"
                />
              </div>
              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-[#fa98d4] hover:bg-[#ff6b9d] disabled:bg-gray-400 text-white font-black py-4 px-8 rounded-2xl transition-all border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 disabled:transform-none disabled:shadow-none text-lg"
              >
                {loading ? 'Subscribing...' : 'Get Alerts'}
              </button>
            </form>
            
            {message && (
              <div className={`text-center mb-4 p-3 rounded-lg font-bold ${
                message.includes('Successfully') || message.includes('already subscribed') 
                  ? 'bg-green-100 text-green-800 border-2 border-green-300' 
                  : 'bg-red-100 text-red-800 border-2 border-red-300'
              }`}>
                {message}
              </div>
            )}
            
            <p className="text-black/70 text-sm font-bold">
              🎁 Subscribers get 15% off their first purchase + early access to rare pulls!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;