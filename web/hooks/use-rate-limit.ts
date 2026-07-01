import { useState, useCallback } from 'react';

interface RateLimitOptions {
  maxRequests?: number;
  windowMs?: number;
}

export function useRateLimit({ maxRequests = 5, windowMs = 60000 }: RateLimitOptions = {}) {
  const [timestamps, setTimestamps] = useState<number[]>([]);

  const checkLimit = useCallback(() => {
    const now = Date.now();
    // Filter out timestamps older than the window
    const validTimestamps = timestamps.filter(t => now - t < windowMs);
    
    if (validTimestamps.length >= maxRequests) {
      setTimestamps(validTimestamps); // Clean up old timestamps
      return false;
    }

    setTimestamps([...validTimestamps, now]);
    return true;
  }, [timestamps, maxRequests, windowMs]);

  const remaining = Math.max(0, maxRequests - timestamps.length);

  return { checkLimit, remaining };
}
