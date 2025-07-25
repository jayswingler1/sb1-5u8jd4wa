import { useState, useCallback } from 'react';

export const usePageTransition = () => {
  const [isTransitioning, setIsTransitioning] = useState(false);

  const startTransition = useCallback((callback?: () => void) => {
    setIsTransitioning(true);
    
    // Execute the callback after a short delay to ensure transition starts
    if (callback) {
      setTimeout(callback, 100);
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