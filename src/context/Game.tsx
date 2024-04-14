"use client";

import { useEffect, useRef, createContext, type ReactElement, type ReactNode, useState } from 'react';
import type { AllSprites, GameStates, IGameContext } from "@/types";
import type Board from '@/lib/map/Board';
import type Character from '@/lib/chars/Character';
import { gameOver, running, startGame } from '@/constants/game';
import { gameOverCanvas, gameStartCanvas, snailStaggerFrames } from '@/constants/canvas';
import EventHandler from '@/lib/events/EventHandler';
import useCanvasSize from '@/lib/render/useCanvasSize';
import RenderEngine from '@/lib/render/RenderEngine';
import Sprites from "@/lib/render/Sprites";

export const GameContext = createContext<IGameContext>({} as IGameContext);
export const GameProvider = ({ children }: { children: ReactNode }): ReactElement | null => {
  
  const { canvasHeight, canvasWidth, tileHeight, tileWidth } = useCanvasSize();
  const sprites = useRef<AllSprites>(new Sprites().spriteAnimationFrames);
  const [score, setScore] = useState(0);
  const initialFrame = 0;

  const [, forceRerender] = useState<number>(0); /// useRef does not cause rerender of react, this forces a rerender to propagate useRef updates to lower components in tree
  const gameState = useRef<GameStates>(startGame); 
  const gameFrame = useRef(initialFrame); 
  
  const gameOverScreen = useRef<HTMLCanvasElement|null>(null); /// game over canvas
  const gameStartScreen = useRef<HTMLCanvasElement|null>(null); /// game over canvas

  /** 
   * 
   *  canvases are populated when a canvas element with the 
   *    corresponding ref enters the DOM in screen component
   * 
   * [ GLOBAL CANVAS CONTEXTS ] 
   *  
   * singleton context instances are created for each canvas.
   * 
   * a single context is used to render each layer of game:
   * 
   *  --- player [context created in Controller]
   *  --- enemies [context created in Controller]
   *  
   *  -- treasure [context created in RenderLoop]
   *  -- rocks [context created in RenderLoop]
   *  -- trees [context created in RenderLoop]
   *  - terrain [context created in RenderLoop]
   */
  const enemyCanvas = useRef<HTMLCanvasElement|null>(null);
  const playerCanvas = useRef<HTMLCanvasElement|null>(null); // treasure drawn to this canvas
  const terrainCanvas = useRef<HTMLCanvasElement|null>(null); /// trees && terrain
  const treasureCanvas = useRef<HTMLCanvasElement|null>(null);
  const rockCanvas = useRef<HTMLCanvasElement|null>(null); /// rocks
  const treeCanvas = useRef<HTMLCanvasElement|null>(null); // treasure drawn to this canvas

  const boardRef = useRef<Board|null>(null);
  const playerRef = useRef<Character|null>(null);

  /// *** Setter functions to update ref values from lower contexts ***
  const setGameState = (ref: GameStates) => { 
    gameState.current = ref;
    forceRerender(Math.random()); 
  }

  const resetGameFrames = () => { gameFrame.current = initialFrame; }  
  const setBoardRef = (ref:Board|null) => { boardRef.current = ref; };
  const setPlayerRef = (ref:Character|null) => { playerRef.current = ref; };

  const eventHandler = new EventHandler(setBoardRef,setScore,setGameState,setPlayerRef)

  /**
   * Launch Render engine for Canvas
   */
  useEffect(() => {
    // calling return within this scope of loop breaks the game loop
    // instead the gameState is used to prevent triggering of updates
    // without exiting this loop
    let animationId:number;

    if(!canvasHeight ||!canvasWidth||!tileHeight||!tileWidth)return;
    const gameLoop = () => {

      /// on each render loop increment current game frame by 1 
        /// to keep count of the total number of frames drawn      
      if(gameState.current === running){
        gameFrame.current++; 
      }

      /** [== Render Game Board ==] **/ 
      RenderEngine.renderBoard(
        boardRef.current,
        gameFrame.current,
        { height:tileHeight, width:tileWidth },
        terrainCanvas.current, /// possible that relic is left over after game ends, 
        treasureCanvas.current,
        treeCanvas.current,
        rockCanvas.current,
        sprites.current,
      )

      if(gameState.current === running && gameFrame.current % snailStaggerFrames === 0){
        boardRef.current?.moveEnemies(enemyCanvas.current);        
      }

      /// {/* RENDER [== START GAME ==] SCREEN */}
      if(gameState.current === startGame){ 
        // console.log('canvasWidth.current', canvasWidth.current)
        // console.log('canvasHeight.current', canvasHeight.current)
        const context = gameStartScreen.current?.getContext('2d') 
          context?.drawImage(sprites?.current[gameStartCanvas][0]!.img, 
            0, 0, canvasWidth, canvasHeight
          );
      }

      /// {/* RENDER [== GAME OVER ==] SCREEN */}
      if(gameOverScreen.current && gameState.current === gameOver){        
        const context = gameOverScreen.current.getContext('2d')
        const halfWidth = gameOverScreen.current.width/2;
        const halfHeight = gameOverScreen.current.height/2;
        context?.drawImage(sprites?.current[gameOverCanvas][0]!.img, 
          halfWidth/2, halfHeight/2, halfWidth, halfHeight)
      }
      
      /// call self to proceed to next stage of loop
      animationId = window.requestAnimationFrame(gameLoop);
    }

    /// start render loop
    gameLoop()
    
    return () => window.cancelAnimationFrame(animationId)
  })

  return (
    <GameContext.Provider 
      value={{
        eventHandler,

        boardRef, /// for tracking/updating map state
        setBoardRef,

        playerRef,
        setPlayerRef,
        sprites,
        resetGameFrames, 

        score,
        setScore,

        gameFrame,
        gameState,
        setGameState,

        gameStartScreen,
        gameOverScreen,

        terrainCanvas, /// for draw/render
        playerCanvas,
        enemyCanvas,
        treasureCanvas,
        rockCanvas,
        treeCanvas,
      }}
    >
    {children}
    </GameContext.Provider>
  );
}