import React, { useState, useEffect } from 'react';

interface PageTransitionProps {
  isTransitioning: boolean;
  onTransitionComplete?: () => void;
}

const PageTransition: React.FC<PageTransitionProps> = ({ isTransitioning, onTransitionComplete }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    if (isTransitioning) {
      setIsVisible(true);
      // Fade in quickly
      setTimeout(() => setOpacity(1), 50);
      
      // Hold the fade for a moment, then fade out
      setTimeout(() => {
        setOpacity(0);
        // Hide completely after fade out
        setTimeout(() => {
          setIsVisible(false);
          onTransitionComplete?.();
        }, 300);
      }, 400);
    }
  }, [isTransitioning, onTransitionComplete]);

  if (!isVisible) return null;

  return (
    <div 
      className="fixed inset-0 z-[9999] pointer-events-none transition-opacity duration-300 ease-in-out"
      style={{ opacity }}
    >
      {/* Smooth gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#3a4bcc] via-[#2a3ba0] to-[#1a2b80]" />
      
      {/* Subtle animated background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div 
          className="w-full h-full transition-transform duration-700 ease-out"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
            transform: `translateX(${opacity * 30}px) translateY(${opacity * 20}px)`
          }}
        />
      </div>

      {/* Optional: Subtle logo in center */}
      <div className="absolute inset-0 flex items-center justify-center">
        <img 
          src="/Lucky Egg Logo.png" 
          alt="The Lucky Egg .Co" 
          className="h-16 w-auto opacity-30 transition-all duration-500 ease-out"
          style={{ 
            transform: `scale(${0.8 + opacity * 0.2})`,
            opacity: opacity * 0.3
          }}
        />
      </div>
    </div>
  );
};

export default PageTransition;