import React, { useState } from 'react';
import { Shield, User, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

const AdminSetup: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted!');
    
    if (!email.trim()) {
      console.log('No email provided');
      setMessage({ type: 'error', text: 'Please enter an email address' });
      return;
    }
    
    console.log('Starting admin creation for:', email);
    setLoading(true);
    setMessage(null);

    try {
      console.log('Checking for existing profile...');
      
      // Check if user exists in profiles table
      console.log('About to query profiles table...');
      const profileQuery = supabase
        .from('profiles')
        .select('*')
        .eq('email', email.trim());
      
      console.log('Profile query created:', profileQuery);
      
      console.log('Executing query...');
      const { data: existingProfile, error: profileError } = await profileQuery;

      console.log('Profile query result:', { 
        existingProfile, 
        profileError,
        errorCode: profileError?.code,
        errorMessage: profileError?.message 
      });

      if (profileError) {
        console.log('Profile error detected:', profileError.code);
        if (profileError.code === 'PGRST116' || profileError.message?.includes('No rows found')) {
          // User not found
          throw new Error('No user found with this email address. The user must sign up first before being made an admin.');
        } else {
          console.log('Other profile error:', profileError);
          throw profileError;
        }
      }

      if (!existingProfile) {
        throw new Error('No user found with this email address.');
      }

      console.log('Found user, updating to admin...');
      
      // Update user role to admin
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ role: 'admin' })
        .eq('email', email.trim());

      console.log('Update result:', { updateError });

      if (updateError) {
        throw updateError;
      }

      console.log('Admin creation successful!');
      setMessage({ 
        type: 'success', 
        text: `Admin profile created successfully for ${email}! They can now access the admin panel.` 
      });
      setEmail('');
      
    } catch (error: any) {
      console.error('Error creating admin:', error);
      setMessage({ 
        type: 'error', 
        text: error.message || 'Failed to create admin profile. Please try again.' 
      });
    } finally {
      console.log('Setting loading to false');
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-3xl p-8 border-4 border-black shadow-xl max-w-md mx-auto">
      <div className="text-center mb-6">
        <div className="bg-gradient-to-r from-[#fa98d4] to-[#ff6b9d] rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 border-4 border-black">
          <Shield className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-black text-black mb-2">Admin Setup</h2>
        <p className="text-black/70 font-medium">
          Create an admin profile for a user who has already signed up
        </p>
      </div>

      <form onSubmit={handleCreateAdmin} className="space-y-4">
        <div>
          <label className="block text-sm font-bold text-black mb-2">
            User Email Address
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black/60 h-4 w-4" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => {
                console.log('Email changed to:', e.target.value);
                setEmail(e.target.value);
              }}
              className="w-full pl-10 pr-4 py-3 bg-white border-2 border-black rounded-xl text-black placeholder-black/60 focus:outline-none focus:border-[#fa98d4] transition-colors font-medium"
              placeholder="admin@luckyegg.store"
              disabled={loading}
            />
          </div>
          <p className="text-xs text-black/60 mt-1">
            The user must have already signed up with this email address
          </p>
        </div>

        {message && (
          <div className={`p-3 rounded-lg font-bold text-sm flex items-center gap-2 ${
            message.type === 'success' 
              ? 'bg-green-100 text-green-800 border-2 border-green-300' 
              : 'bg-red-100 text-red-800 border-2 border-red-300'
          }`}>
            {message.type === 'success' ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              <AlertCircle className="w-4 h-4" />
            )}
            {message.text}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !email.trim()}
          className="w-full bg-[#fa98d4] hover:bg-[#ff6b9d] disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-black py-4 px-6 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 disabled:transform-none disabled:shadow-none"
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Creating Admin...
            </div>
          ) : (
            'Create Admin Profile'
          )}
        </button>
      </form>

      <div className="mt-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
        <h3 className="font-bold text-blue-800 text-sm mb-2">Instructions:</h3>
        <ol className="text-blue-700 text-xs space-y-1">
          <li>1. The user must sign up first using the regular signup form</li>
          <li>2. Enter their email address above</li>
          <li>3. Click "Create Admin Profile" to grant admin access</li>
          <li>4. They can now access the admin panel at /#admin</li>
        </ol>
      </div>
    </div>
  );
};

export default AdminSetup;