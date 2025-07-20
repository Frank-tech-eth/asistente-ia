import { useState, useEffect } from 'react';

interface OrientationInfo {
  isPortrait: boolean;
  isLandscape: boolean;
  angle: number;
  type: string;
}

export const useOrientation = (): OrientationInfo => {
  const [orientation, setOrientation] = useState<OrientationInfo>({
    isPortrait: window.innerHeight > window.innerWidth,
    isLandscape: window.innerWidth > window.innerHeight,
    angle: 0,
    type: window.innerHeight > window.innerWidth ? 'portrait' : 'landscape'
  });

  useEffect(() => {
    const handleOrientationChange = () => {
      const isPortrait = window.innerHeight > window.innerWidth;
      const isLandscape = window.innerWidth > window.innerHeight;
      
      setOrientation({
        isPortrait,
        isLandscape,
        angle: window.orientation || 0,
        type: isPortrait ? 'portrait' : 'landscape'
      });
    };

    const handleResize = () => {
      handleOrientationChange();
    };

    // Eventos para dispositivos móviles
    window.addEventListener('orientationchange', handleOrientationChange);
    window.addEventListener('resize', handleResize);

    // Detección inicial
    handleOrientationChange();

    return () => {
      window.removeEventListener('orientationchange', handleOrientationChange);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return orientation;
}; 