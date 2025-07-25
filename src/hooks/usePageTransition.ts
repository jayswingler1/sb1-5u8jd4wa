import { useState, useCallback } from 'react';

export const usePageTransition = () => {
  const [isTransitioning, setIsTransitioning] = useState(false);

  const startTransition = useCallback((callback?: () => void) => {
    // Execute callback immediately - no transition delay
    if (callback) {
      callback();
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