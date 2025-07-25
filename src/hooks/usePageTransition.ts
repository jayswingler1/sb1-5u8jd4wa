import { useState, useCallback } from 'react';

export const usePageTransition = () => {
  const [isTransitioning, setIsTransitioning] = useState(false);

  const startTransition = useCallback((callback?: () => void) => {
    setIsTransitioning(true);
    
    // Execute the callback during the fade-in
    if (callback) {
      setTimeout(callback, 200);
    }
  }, []);

  const completeTransition = useCallback(() => {
    setIsTransitioning(false);
  }, []);

  return {
    isTransitioning,
    startTransition,
    completeTransition
  };
};