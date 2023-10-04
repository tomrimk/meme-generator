import { useState, useEffect } from 'react';

export default function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
    deviceType: window.innerWidth < 1241 ? 'mobile' : 'desktop',
  });

  const updateWindowSize = () => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
      deviceType: window.innerWidth < 1241 ? 'mobile' : 'desktop',
    });
  };

  useEffect(() => {
    window.addEventListener('resize', updateWindowSize);

    return () => {
      window.removeEventListener('resize', updateWindowSize);
    };
  }, []);

  return windowSize;
}
