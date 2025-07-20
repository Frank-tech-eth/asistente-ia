import { useState, useEffect } from 'react';

interface DeviceInfo {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isTouch: boolean;
  isIOS: boolean;
  isAndroid: boolean;
  isStandalone: boolean;
  screenSize: {
    width: number;
    height: number;
  };
}

export const useDevice = (): DeviceInfo => {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    isTouch: false,
    isIOS: false,
    isAndroid: false,
    isStandalone: false,
    screenSize: {
      width: window.innerWidth,
      height: window.innerHeight
    }
  });

  useEffect(() => {
    const detectDevice = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      // Detección de dispositivo móvil
      const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent) || width <= 768;
      const isTablet = /ipad|android(?=.*\b(?!.*mobile))/i.test(userAgent) || (width > 768 && width <= 1024);
      const isDesktop = !isMobile && !isTablet;
      
      // Detección de características táctiles
      const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      
      // Detección de sistema operativo
      const isIOS = /iphone|ipad|ipod/i.test(userAgent);
      const isAndroid = /android/i.test(userAgent);
      
      // Detección de PWA standalone
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                          (window.navigator as any).standalone === true;
      
      setDeviceInfo({
        isMobile,
        isTablet,
        isDesktop,
        isTouch,
        isIOS,
        isAndroid,
        isStandalone,
        screenSize: {
          width,
          height
        }
      });
    };

    // Detección inicial
    detectDevice();

    // Evento de cambio de tamaño
    const handleResize = () => {
      detectDevice();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return deviceInfo;
}; 