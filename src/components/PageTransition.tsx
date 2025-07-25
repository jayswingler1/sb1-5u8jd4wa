import React, { useState, useEffect } from 'react';

interface PageTransitionProps {
  isTransitioning: boolean;
  onTransitionComplete?: () => void;
}

const PageTransition: React.FC<PageTransitionProps> = ({ isTransitioning, onTransitionComplete }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isTransitioning) {
      setIsVisible(true);
      
      // Complete transition after brief overlay
      setTimeout(() => {
        setIsVisible(false);
        onTransitionComplete?.();
      }, 300);
    }
  }, [isTransitioning, onTransitionComplete]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none">
      {/* Simple overlay */}
      <div className="absolute inset-0 bg-white animate-pulse" />
      
      {/* Optional subtle logo */}
      <div className="absolute inset-0 flex items-center justify-center opacity-60">
        <img 
          src="/Lucky Egg Logo.png" 
          alt="The Lucky Egg .Co" 
          className="h-16 w-auto"
        />
      </div>
    </div>
  );
};

export default PageTransition;