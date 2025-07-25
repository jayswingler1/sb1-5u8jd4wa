import React, { useState } from 'react';
import { X, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'login' | 'signup';
  onModeChange: (mode: 'login' | 'signup') => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, mode, onModeChange }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setFirstName('');
    setLastName('');
    setMessage(null);
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleModeChange = (newMode: 'login' | 'signup') => {
    resetForm();
    onModeChange(newMode);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      if (mode === 'signup') {
        if (password !== confirmPassword) {
          setMessage({ type: 'error', text: 'Passwords do not match' });
          return;
        }

        if (password.length < 6) {
          setMessage({ type: 'error', text: 'Password must be at least 6 characters long' });
          return;
        }

        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: undefined, // Disable email confirmation
            data: {
              first_name: firstName,
              last_name: lastName,
            }
          }
        });

        if (error) throw error;

        if (data.user) {
          setMessage({ type: 'success', text: 'Account created successfully! You are now logged in.' });
          
          // Check if this is the first user and make them admin
          const { data: profilesCount } = await supabase
            .from('profiles')
            .select('id', { count: 'exact' });
          
          if (profilesCount && profilesCount.length === 0) {
            // This is the first user, make them admin
            await supabase
              .from('profiles')
              .update({ role: 'admin' })
              .eq('id', data.user.id);
          }
          
          setTimeout(() => {
            handleClose();
            window.location.reload();
          }, 1500);
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        if (data.user) {
          setMessage({ type: 'success', text: 'Logged in successfully!' });
          setTimeout(() => {
            handleClose();
            window.location.reload();
          }, 1500);
        }
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      setMessage({ 
        type: 'error', 
        text: error.message || `Failed to ${mode === 'login' ? 'log in' : 'create account'}` 
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose} />
      
      {/* Modal */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="bg-white/95 backdrop-blur-md rounded-3xl p-8 border-4 border-black shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-black text-black">
              {mode === 'login' ? 'Welcome Back!' : 'Create Account'}
            </h2>
            <button
              onClick={handleClose}
              className="rounded-full p-2 hover:bg-gray-100 transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-black mb-2">
                    First Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black/60 h-4 w-4" />
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-white border-2 border-black rounded-xl text-black placeholder-black/60 focus:outline-none focus:border-[#fa98d4] transition-colors font-medium"
                      placeholder="First name"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-black mb-2">
                    Last Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black/60 h-4 w-4" />
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-white border-2 border-black rounded-xl text-black placeholder-black/60 focus:outline-none focus:border-[#fa98d4] transition-colors font-medium"
                      placeholder="Last name"
                    />
                  </div>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-black mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black/60 h-4 w-4" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white border-2 border-black rounded-xl text-black placeholder-black/60 focus:outline-none focus:border-[#fa98d4] transition-colors font-medium"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-black mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black/60 h-4 w-4" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 bg-white border-2 border-black rounded-xl text-black placeholder-black/60 focus:outline-none focus:border-[#fa98d4] transition-colors font-medium"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-black/60 hover:text-black transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {mode === 'signup' && (
              <div>
                <label className="block text-sm font-bold text-black mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black/60 h-4 w-4" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 bg-white border-2 border-black rounded-xl text-black placeholder-black/60 focus:outline-none focus:border-[#fa98d4] transition-colors font-medium"
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-black/60 hover:text-black transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            )}

            {/* Message */}
            {message && (
              <div className={`p-3 rounded-lg font-bold text-sm ${
                message.type === 'success' 
                  ? 'bg-green-100 text-green-800 border-2 border-green-300' 
                  : 'bg-red-100 text-red-800 border-2 border-red-300'
              }`}>
                {message.text}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#fa98d4] hover:bg-[#ff6b9d] disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-black py-4 px-6 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 disabled:transform-none disabled:shadow-none"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {mode === 'login' ? 'Logging in...' : 'Creating account...'}
                </div>
              ) : (
                mode === 'login' ? 'Log In' : 'Create Account'
              )}
            </button>
          </form>

          {/* Mode Switch */}
          <div className="mt-6 text-center">
            <p className="text-black/70 text-sm">
              {mode === 'login' ? "Don't have an account?" : "Already have an account?"}
              <button
                onClick={() => handleModeChange(mode === 'login' ? 'signup' : 'login')}
                className="ml-2 text-[#fa98d4] hover:text-[#ff6b9d] font-bold transition-colors"
              >
                {mode === 'login' ? 'Sign up' : 'Log in'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;