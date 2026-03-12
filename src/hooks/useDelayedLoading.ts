import { useState, useEffect } from 'react';

/**
 * useDelayedLoading
 * @param loading - The actual loading state from the data fetcher
 * @param delay - How long to wait before showing the skeleton (default 200ms)
 * @returns boolean - Whether the skeleton should be visible
 */
export function useDelayedLoading(loading: boolean, delay: number = 200): boolean {
  const [showSkeleton, setShowSkeleton] = useState(false);

  useEffect(() => {
    let timer: any;

    if (loading) {
      // If loading starts, wait for 'delay' ms before showing skeleton
      timer = setTimeout(() => {
        setShowSkeleton(true);
      }, delay);
    } else {
      // If loading stops, hide skeleton immediately
      setShowSkeleton(false);
      if (timer) clearTimeout(timer);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [loading, delay]);

  return showSkeleton;
}
