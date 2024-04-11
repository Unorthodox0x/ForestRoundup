'use client';
import { useState, useEffect } from 'react';
import { 
  desktopCanvasHeight, desktopCanvasWidth,
  horizontalTiles,
  verticleTiles, 
} from '@/constants/canvas';
import { gameSquare } from '@/constants/sprites';

/**
 * This hook detects the device connecting to app
 *  to inform game of which canvas && which controls to load/use, (mobile or desktop)
 */
function useCanvasSize() {
 
  const [canvasHeight, setCanvasHeight] = useState<number>(0);
  const [canvasWidth, setCanvasWidth] = useState<number>(0);

  const [canvasTop, setCanvasTop] = useState<number>(0); /// use on a 3rd of the screen to detect touch events
  const [canvasBottom, setCanvasBottom] = useState<number>(0); /// use on a 3rd of the screen to detect touch events
  const [canvasLeft, setCanvasLeft] = useState<number>(0); /// use on a 3rd of the screen to detect touch events
  const [canvasRight, setCanvasRight] = useState<number>(0); /// use on a 3rd of the screen to detect touch events
  
  const [tileHeight, setTileHeight] = useState<number>(0);
  const [tileWidth, setTileWidth] = useState<number>(0);
  
  const canvasSegments = 4; // for touch control configuration. 
  const isMobile = canvasHeight !== desktopCanvasHeight && canvasWidth !== desktopCanvasWidth

  useEffect(() => {

    let canvasVerticleSection: number; 
    let canvasHorizontalSection:number;
    function detectMobileDevice() {
      const userAgent = window.navigator.userAgent.toLowerCase();

      const isMobile =/webos|iphone|ipad|ipod|blackberry|windows phone|android|windows|kindle|samsung|surface|nexus|pixel/.test(userAgent);

      let canvasHeight:number;
      let canvasWidth: number;

      let tileWidth:number;
      let tileHeight: number;

      if(isMobile){

        canvasHeight = window.innerHeight;
        canvasWidth = window.innerWidth;

        /// testing... 
          /// tileWidth = canvasWidth / (boardWidth * chunkWidth);
          /// ^ this causes very fine horizontal gaps between 

        // Calculate the width and height of each tile
        tileHeight = canvasHeight / verticleTiles;
        tileWidth = Math.floor(canvasWidth / horizontalTiles);

        // tileHeight = canvasHeight / (boardHeight * chunkHeight);
        // tileWidth = Math.floor(canvasWidth / (boardWidth * chunkWidth));
        // tileWidth = canvasWidth / (boardWidth * chunkWidth)/2;

      } else {

        canvasHeight = desktopCanvasHeight;
        canvasWidth = desktopCanvasWidth;

        canvasVerticleSection = canvasHeight / canvasSegments
        canvasHorizontalSection = canvasWidth / canvasSegments

        // Calculate the width and height of each tile
        tileWidth = gameSquare;
        tileHeight = gameSquare;
      }
          
      setCanvasHeight(canvasHeight)
      setCanvasWidth(canvasWidth)

      setCanvasTop(canvasVerticleSection)
      setCanvasBottom(canvasHeight - canvasVerticleSection)
      setCanvasLeft(canvasHorizontalSection)
      setCanvasRight(canvasWidth - canvasHorizontalSection)
      
      // setThirdCanvasHeight(canvasHeight/3);
      // setThirdCanvasWidth(canvasWidth/3);
      setTileHeight(tileHeight)
      setTileWidth(tileWidth)
    }

    detectMobileDevice();
  });



  return { 
    canvasTop,
    canvasBottom,
    canvasLeft,
    canvasRight,
    tileHeight, 
    tileWidth,
    canvasHeight, 
    canvasWidth,
    isMobile,
  }
}

export default useCanvasSize;