import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

export default function useWalletMinimizer() {
  const [isMinimized, setIsMinimized] = useState(false);
  const location = useLocation();
  const previousPathnameRef = useRef<string | null>(null);

  useEffect(() => {
    if (previousPathnameRef.current !== null && previousPathnameRef.current !== location.pathname) {
      console.log('Pathname changed, minimizing wallet.');
      setIsMinimized(true);
    }   
    previousPathnameRef.current = location.pathname;
  }, [location.pathname]);

  const toggleMinimize = () => {
    setIsMinimized(prev => !prev);
  };

  return { isMinimized, toggleMinimize };
} 