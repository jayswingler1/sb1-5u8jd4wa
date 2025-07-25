import React, { useEffect, useState } from 'react';
import { CheckCircle, ArrowLeft, Download, Mail } from 'lucide-react';
import StarField from './StarField';

interface SuccessPageProps {
  onClose: () => void;
}

const SuccessPage: React.FC<SuccessPageProps> = ({ onClose }) => {
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    // Extract session_id from URL hash
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.split('?')[1] || '');
    const id = params.get('session_id');
    setSessionId(id);
  }, []);

  const handleClose = () => {
    window.location.hash = '';
    window.location.reload();
  };

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
              onClick={handleClose}
              className="flex items-center gap-3 text-black hover:text-white transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
              <span className="font-black text-lg">Back to Home</span>
            </button>
            
            <div className="flex items-center">
              <img 
                src="/Lucky Egg Logo.png" 
                alt="The Lucky Egg .Co" 
                className="h-12 w-auto drop-shadow-lg"
              />
            </div>
            
            <div className="w-24"></div> {/* Spacer for centering */}
          </div>
        </div>
      </header>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          {/* Success Card */}
          <div className="bg-white/95 backdrop-blur-md rounded-3xl p-12 border-4 border-black shadow-2xl">
            {/* Success Icon */}
            <div className="mb-8">
              <div className="bg-green-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 border-4 border-green-300 shadow-lg">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
              
              <h1 className="text-4xl md:text-5xl font-black text-black mb-4 tracking-tight">
                Payment <span className="text-transparent bg-gradient-to-r from-green-500 to-green-600 bg-clip-text">Successful!</span>
              </h1>
              
              <p className="text-xl text-black/80 font-medium leading-relaxed">
                Thank you for your purchase! Your payment has been processed successfully.
              </p>
            </div>

            {/* Session Info */}
            {sessionId && (
              <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-2xl p-6 border-2 border-green-200 mb-8">
                <h3 className="text-lg font-black text-green-800 mb-2">Order Confirmation</h3>
                <p className="text-green-700 font-medium text-sm">
                  Session ID: <span className="font-mono bg-white px-2 py-1 rounded border">{sessionId}</span>
                </p>
                <p className="text-green-600 text-sm mt-2">
                  📧 A confirmation email has been sent to your registered email address.
                </p>
              </div>
            )}

            {/* Next Steps */}
            <div className="bg-gradient-to-r from-[#fa98d4]/20 to-[#ff6b9d]/20 rounded-2xl p-6 border-2 border-[#fa98d4]/30 mb-8">
              <h3 className="text-lg font-black text-black mb-4">What's Next?</h3>
              <div className="space-y-3 text-left">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-[#fa98d4] flex-shrink-0" />
                  <span className="text-black font-medium">Check your email for order details and receipt</span>
                </div>
                <div className="flex items-center gap-3">
                  <Download className="w-5 h-5 text-[#fa98d4] flex-shrink-0" />
                  <span className="text-black font-medium">Access your purchased content in your account</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-[#fa98d4] flex-shrink-0" />
                  <span className="text-black font-medium">Your purchase is now active and ready to use</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleClose}
                className="bg-[#fa98d4] hover:bg-[#ff6b9d] text-white font-black py-4 px-8 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1"
              >
                Continue Shopping
              </button>
              
              <button
                onClick={() => {
                  window.location.hash = '#products';
                  window.location.reload();
                }}
                className="bg-white hover:bg-gray-50 text-black font-bold py-4 px-8 rounded-2xl border-4 border-black transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
              >
                View Products
              </button>
            </div>

            {/* Support */}
            <div className="mt-8 pt-6 border-t-2 border-gray-200">
              <p className="text-black/60 text-sm font-medium">
                Need help? Contact our support team at{' '}
                <a href="mailto:support@luckyegg.co" className="text-[#fa98d4] hover:text-[#ff6b9d] font-bold transition-colors">
                  support@luckyegg.co
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;