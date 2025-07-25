import React, { useState, useEffect } from 'react';

interface PageTransitionProps {
  isTransitioning: boolean;
  onTransitionComplete?: () => void;
}

const PageTransition: React.FC<PageTransitionProps> = ({ isTransitioning, onTransitionComplete }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [slideProgress, setSlideProgress] = useState(0);

  useEffect(() => {
    if (isTransitioning) {
      setIsVisible(true);
      setSlideProgress(0);
      
      // Start slide-in animation
      setTimeout(() => setSlideProgress(1), 50);
      
      // Hold briefly, then slide out
      setTimeout(() => {
        setSlideProgress(2);
        // Complete transition after slide-out
        setTimeout(() => {
          setIsVisible(false);
          setSlideProgress(0);
          onTransitionComplete?.();
        }, 400);
      }, 600);
    }
  }, [isTransitioning, onTransitionComplete]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none overflow-hidden">
      {/* Main sliding panel */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-[#3a4bcc] via-[#2a3ba0] to-[#1a2b80] transition-transform duration-500 ease-in-out"
        style={{
          transform: slideProgress === 0 ? 'translateX(-100%)' : 
                    slideProgress === 1 ? 'translateX(0%)' : 
                    'translateX(100%)'
        }}
      >
        {/* Animated geometric pattern */}
        <div className="absolute inset-0 opacity-10">
          <div 
            className="w-full h-full transition-transform duration-700 ease-out"
            style={{
              backgroundImage: `
                linear-gradient(45deg, rgba(255, 255, 255, 0.1) 25%, transparent 25%),
                linear-gradient(-45deg, rgba(255, 255, 255, 0.1) 25%, transparent 25%),
                linear-gradient(45deg, transparent 75%, rgba(255, 255, 255, 0.1) 75%),
                linear-gradient(-45deg, transparent 75%, rgba(255, 255, 255, 0.1) 75%)
              `,
              backgroundSize: '30px 30px',
              backgroundPosition: '0 0, 0 15px, 15px -15px, -15px 0px',
              transform: `translateX(${slideProgress * 50}px) rotate(${slideProgress * 2}deg)`
            }}
          />
        </div>

        {/* Center logo with modern animation */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div 
            className="transition-all duration-500 ease-out"
            style={{
              transform: `scale(${0.8 + slideProgress * 0.2}) translateY(${(1 - slideProgress) * 20}px)`,
              opacity: slideProgress === 2 ? 0 : 0.9
            }}
          >
            <img 
              src="/Lucky Egg Logo.png" 
              alt="The Lucky Egg .Co" 
              className="h-20 w-auto drop-shadow-2xl"
            />
          </div>
        </div>

        {/* Modern accent lines */}
        <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/30 to-transparent transform -translate-y-1/2">
          <div 
            className="h-full bg-gradient-to-r from-[#fa98d4] to-[#ff6b9d] transition-all duration-700 ease-out"
            style={{
              width: `${slideProgress === 1 ? 100 : 0}%`,
              opacity: slideProgress === 2 ? 0 : 1
            }}
          />
        </div>
        
        {/* Bottom accent line */}
        <div className="absolute bottom-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent">
          <div 
            className="h-full bg-gradient-to-r from-[#ff6b9d] to-[#fa98d4] transition-all duration-700 ease-out delay-100"
            style={{
              width: `${slideProgress === 1 ? 80 : 0}%`,
              opacity: slideProgress === 2 ? 0 : 1
            }}
          />
        </div>
      </div>

      {/* Secondary sliding panel for depth */}
      <div 
        className="absolute inset-0 bg-gradient-to-r from-[#fa98d4]/20 to-[#ff6b9d]/20 backdrop-blur-sm transition-transform duration-600 ease-in-out"
        style={{
          transform: slideProgress === 0 ? 'translateX(-120%)' : 
                    slideProgress === 1 ? 'translateX(0%)' : 
                    'translateX(120%)',
          transitionDelay: '100ms'
        }}
      />
    </div>
  );
};

export default PageTransition;