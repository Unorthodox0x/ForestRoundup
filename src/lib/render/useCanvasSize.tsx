'use client';
import { useState, useEffect } from 'react';
import { 
  desktopCanvasHeight, desktopCanvasWidth,
  horizontalTiles,
  verticleTiles, 
} from '@/constants/canvas';
import { boardHeight, boardWidth, chunkHeight, chunkWidth } from '@/constants/board';
import { gameSquare } from '@/constants/sprites';

/**
 * This hook detects the device connecting to app
 *  to inform game of which canvas && which controls to load/use, (mobile or desktop)
 */
function useCanvasSize() {
 
  const [canvasHeight, setCanvasHeight] = useState<number>(0);
  const [canvasWidth, setCanvasWidth] = useState<number>(0);
  
  const [tileHeight, setTileHeight] = useState<number>(0);
  const [tileWidth, setTileWidth] = useState<number>(0);

  const isMobile = canvasHeight !== desktopCanvasHeight && canvasWidth !== desktopCanvasWidth

  useEffect(() => {

    function detectMobileDevice() {
      const userAgent = window.navigator.userAgent.toLowerCase();

      const isMobile =/android|webos|iphone|ipad|ipod|blackberry|windows phone/.test(userAgent);

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

      }else{

        canvasHeight = desktopCanvasHeight;
        canvasWidth = desktopCanvasWidth;

        // Calculate the width and height of each tile
        tileWidth = gameSquare;
        tileHeight = gameSquare;

      }

        
      console.log('=================================')
      console.log('canvasHeight',canvasHeight)
      console.log('verticleTiles',verticleTiles)
      console.log('tileHeight',tileHeight)
      console.log('=================================')
      console.log('canvasWidth',canvasWidth)
      console.log('horizontalTiles',horizontalTiles)
      console.log('tileWidth',tileWidth)
    
      setCanvasHeight(canvasHeight)
      setCanvasWidth(canvasWidth)
      setTileHeight(tileHeight)
      setTileWidth(tileWidth)
    }

    detectMobileDevice();
  });



  return { 
    tileHeight, 
    tileWidth,
    canvasHeight, 
    canvasWidth,
    isMobile,
  }
}

export default useCanvasSize;