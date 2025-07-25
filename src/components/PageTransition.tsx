import React, { useState, useEffect } from 'react';

interface PageTransitionProps {
  isTransitioning: boolean;
  onTransitionComplete?: () => void;
}

const PageTransition: React.FC<PageTransitionProps> = ({ isTransitioning, onTransitionComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isTransitioning) {
      setIsVisible(true);
      setProgress(0);
      
      // Simulate loading progress
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            // Keep the transition visible for a moment before hiding
            setTimeout(() => {
              setIsVisible(false);
              onTransitionComplete?.();
            }, 200);
            return 100;
          }
          // Smooth progress with some randomness to feel natural
          const increment = Math.random() * 15 + 5;
          return Math.min(prev + increment, 100);
        });
      }, 50);

      return () => clearInterval(progressInterval);
    }
  }, [isTransitioning, onTransitionComplete]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none">
      {/* Overlay with gradient */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-[#3a4bcc] via-[#2a3ba0] to-[#1a2b80] transition-opacity duration-300"
        style={{ opacity: isTransitioning ? 0.95 : 0 }}
      />
      
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div 
          className="w-full h-full animate-pulse"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
            transform: `translateX(${progress * 2}px)`
          }}
        />
      </div>

      {/* Main content */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          {/* Logo */}
          <div className="mb-8">
            <img 
              src="/Lucky Egg Logo.png" 
              alt="The Lucky Egg .Co" 
              className="h-20 w-auto mx-auto animate-pulse"
            />
          </div>

          {/* Loading text */}
          <div className="mb-8">
            <h3 className="text-2xl font-black text-white mb-2">
              Loading Amazing Cards...
            </h3>
            <p className="text-white/80 font-medium">
              Preparing your collection experience
            </p>
          </div>

          {/* Progress bar container */}
          <div className="relative w-full max-w-sm mx-auto">
            {/* Background bar */}
            <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden border-2 border-white/30">
              {/* Progress bar */}
              <div 
                className="h-full bg-gradient-to-r from-[#fa98d4] to-[#ff6b9d] rounded-full transition-all duration-100 ease-out relative overflow-hidden"
                style={{ width: `${progress}%` }}
              >
                {/* Shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
              </div>
            </div>
            
            {/* Progress percentage */}
            <div className="mt-3 text-center">
              <span className="text-white/90 font-bold text-sm">
                {Math.round(progress)}%
              </span>
            </div>
          </div>

          {/* Floating cards animation */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute w-8 h-12 bg-gradient-to-br from-[#fa98d4]/30 to-[#ff6b9d]/30 rounded-lg border border-white/20 animate-float"
                style={{
                  left: `${10 + i * 15}%`,
                  top: `${20 + (i % 2) * 40}%`,
                  animationDelay: `${i * 0.5}s`,
                  animationDuration: `${3 + i * 0.5}s`
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageTransition;