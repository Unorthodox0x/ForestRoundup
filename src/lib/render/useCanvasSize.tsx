'use client';
import { useState, useEffect } from 'react';
import { 
  desktopCanvasHeight, desktopCanvasWidth,
  horizontalTiles,
  verticleTiles, 
} from '@/constants/canvas';
import { gameSquare } from '@/constants/canvas';

/**
 * This hook detects the device connecting to app
 *  to inform game of which canvas && which controls to load/use, (mobile or desktop)
 */
function useCanvasSize() {
  
  const isMobile = detectMobileDevice();
  const [canvasHeight, setCanvasHeight] = useState<number>(0);
  const [canvasWidth, setCanvasWidth] = useState<number>(0);
  const [tileHeight, setTileHeight] = useState<number>(0);
  const [tileWidth, setTileWidth] = useState<number>(0);

  function detectMobileDevice() {
    const userAgent = window.navigator.userAgent.toLowerCase();
    return /webos|iphone|ipad|ipod|blackberry|windows phone|android|windows|kindle|samsung|surface|nexus|pixel/.test(userAgent);
  }

  /**
   * THERE IS AN ISSUE WITH RENDING THE GAME SCREEN
   *  ON LOAD, THIS INITIAL VALUES OF CANVASHEIGHT&&WIDTH ARE 0, 
   *  THIS IS NEVER RESET IN CANVAS COMPONENTS DESPITE THE REF
   */

  // Calculate the width and height of each tile
  function calculateScreenDimensions(isMobile:boolean){
    if(isMobile){
      setCanvasHeight(window.innerHeight);
      setCanvasWidth(window.innerWidth);
      /// Math.floor removes horizontal && verticle gaps between tiles
      // setTileWidth(
      //   Number((window.innerWidth / horizontalTiles).toPrecision(4))
      // );
      // setTileHeight(
      //   Number((window.innerHeight / verticleTiles).toPrecision(4))
      //   );

      setTileWidth(Math.floor(window.innerWidth / horizontalTiles+.3));
      setTileHeight(Math.floor(window.innerHeight / verticleTiles+.3));

      // tileHeight.current = Math.floor(canvasHeight.current / verticleTiles);
    } else {
      setCanvasHeight(desktopCanvasHeight);
      setCanvasWidth(desktopCanvasWidth);
      setTileWidth(gameSquare);
      setTileHeight(gameSquare);
    }
  }
  
  useEffect(()=>{
    calculateScreenDimensions(isMobile); /// calculate once on app mount
  })

  return {
    isMobile,
    calculateScreenDimensions,
    tileHeight, 
    tileWidth,
    canvasHeight, 
    canvasWidth,
  }
}

export default useCanvasSize;