'use client';
import { useState, useEffect } from 'react';
import { 
  desktopCanvasHeight, desktopCanvasWidth, 
  mobileCanvasHeight, mobileCanvasWidth 
} from '@/constants/canvas';

/**
 * This hook detects the device connecting to app
 *  to inform game of which canvas && which controls to load/use, (mobile or desktop)
 */
function useCanvasSize() {
  const [canvasHeight, setCanvasHeight] = useState(0);
  const [canvasWidth, setCanvasWidth] = useState(0);

  useEffect(() => {

    function detectMobileDevice() {
      const userAgent = window.navigator.userAgent.toLowerCase();

      const isMobile =/android|webos|iphone|ipad|ipod|blackberry|windows phone/.test(userAgent);

      if(isMobile){

        setCanvasHeight(mobileCanvasHeight)
        setCanvasWidth(mobileCanvasWidth)

      }else{

        setCanvasHeight(desktopCanvasHeight)
        setCanvasWidth(desktopCanvasWidth)
      
      }
    }

    detectMobileDevice();
  }, []); // Run only once on component mount

  return { 
    canvasHeight, 
    canvasWidth 
  }
}

export default useCanvasSize;