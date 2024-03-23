import { useEffect, useRef, createContext, type ReactElement, type ReactNode, useState } from 'react';
import type { GameStates, IGameContext } from "@/types";
import Board from '@/lib/map/Board';
import Player from "@/lib/chars/Player"; 
import RenderEngine from '@/lib/render/RenderEngine';
import { gameOver, running, startGame } from '@/constants/game';
import { canvasHeight, canvasWidth, gameOverCanvas, gameStartCanvas, snailStaggerFrames, terrainStaggerFrames } from '@/constants/canvas';
import EventHandler from '@/lib/events/EventHandler';
import { spriteAnimationFrames } from '@/constants/sprites';

export const GameContext = createContext<IGameContext>({} as IGameContext);
export const GameProvider = ({ children }: { children: ReactNode }): ReactElement | null => {
  
  const [score, setScore] = useState(0);
  const initialFrame = 0;

  const [, forceRerender] = useState<number>(0);
  const gameState = useRef<GameStates>(startGame); 
  const gameFrame = useRef(initialFrame); 
  
  const gameOverScreen = useRef<HTMLCanvasElement|null>(null); /// game over canvas
  const gameStartScreen = useRef<HTMLCanvasElement|null>(null); /// game over canvas

  const terrainCanvas = useRef<HTMLCanvasElement|null>(null); /// trees && terrain
  const enemyCanvas = useRef<HTMLCanvasElement|null>(null);
  const treasureCanvas = useRef<HTMLCanvasElement|null>(null);
  const objectCanvas = useRef<HTMLCanvasElement|null>(null); /// rocks
  const playerCanvas = useRef<HTMLCanvasElement|null>(null); // treasure drawn to this canvas
  const treeCanvas = useRef<HTMLCanvasElement|null>(null); // treasure drawn to this canvas

  const boardRef = useRef<Board|null>(null);
  const playerRef = useRef<Player|null>(null);


  /// *** Setter functions to update ref values from lower contexts ***
  const setGameState = (ref: GameStates) => { 
    gameState.current = ref;
    forceRerender(Math.random()); /// this is only present to force a rerender to propagate useRef updates to lower components in tree
  }
  const resetGameFrames = () => { gameFrame.current = initialFrame; }  
  const setBoardRef = (ref:Board|null) => { boardRef.current = ref; };
  const setPlayerRef = (ref:Player|null) => { playerRef.current = ref; };

  const eventHandler = useRef<EventHandler>(
    new EventHandler(setBoardRef, setScore, setGameState, setPlayerRef, resetGameFrames)
  ); 

  /**
   * Launch Render engine for Canvas
   */
  useEffect(() => {
        
    let animationId:number;
    const renderer = () => {
        /// calling return within this scope of loop breaks the game loop
      /// instead the gameState is used to prevent triggering of updates
        /// without exiting this loop

      /// on each render loop increment current game frame by 1 
      /// to keep count of the total number of frames drawn
      // if(!boardRef.current?.chunks || !playerRef.current) return; /// drops
      if(gameState.current === running){
        gameFrame.current++; 
      }

      /** 
       * Rocks are static - drawn only once
       *  Player && Treasure at first,  then on movement event
       */
      if(gameFrame.current === 1){
        /// *** Draw Rocks Only once on map generation  *** ///
        const objectContext = objectCanvas.current?.getContext('2d')
        RenderEngine.drawRocks(
          boardRef.current, 
          objectContext, 
          gameFrame.current,
        );
      }

      if(gameState.current === running && 
        (gameFrame.current === 1 || gameFrame.current % snailStaggerFrames === 0)
      ){
        boardRef.current?.moveEnemies()
      }

      if(gameState.current === running && 
        (gameFrame.current === 1 || gameFrame.current % terrainStaggerFrames === 0)
      ){
        const terrainContext = terrainCanvas.current?.getContext('2d')

        /// *** ~~ Draw Background Terrain ~~  *** ///        
        RenderEngine.drawTerrain(
          boardRef.current, 
          terrainContext, 
          gameFrame.current,
        );

        /// *** Draw Trees 'Boundary && Obstacles'  *** ///
        const treeContext = treeCanvas.current?.getContext('2d');
        RenderEngine.drawTrees(
          boardRef.current, 
          treeContext, 
          gameFrame.current,
        );
      }


      /// {/* START GAME */}
      if(gameState.current === startGame){ 
        /// TODO: Render Screen animation
        const context = gameStartScreen.current?.getContext('2d')
        const image = new Image();
        image.src = spriteAnimationFrames[gameStartCanvas][0]!.src; 
        image.onload= (() => {
          context?.drawImage(image, 0, 0, canvasWidth, canvasHeight);
        })
      }

      /// {/* GAME OVER */}
      if(gameOverScreen.current && gameState.current === gameOver){
        /// TODO: Render Screen animation
        const context = gameOverScreen.current.getContext('2d')
        const image = new Image();
        image.src = spriteAnimationFrames[gameOverCanvas][0]!.src; 
        const halfWidth = gameOverScreen.current.width/2
        const halfHeight = gameOverScreen.current.height/2
        image.onload= (() => {
          context?.drawImage(image, halfWidth/2, halfHeight/2, halfWidth, halfHeight)
        })
      }
      
      /// call self to proceed to next stage of loop
      animationId = window.requestAnimationFrame(renderer);
    }

    /// start render loop
    renderer()

    return () => window.cancelAnimationFrame(animationId)
  },[])

  return (
    <GameContext.Provider 
      value={{
        gameFrame,

        score,
        setScore,

        gameState,
        setGameState,

        gameStartScreen,
        gameOverScreen,
        terrainCanvas, /// for draw/render
        enemyCanvas,
        treasureCanvas,
        objectCanvas,
        playerCanvas,
        treeCanvas,
        // setCanvasRef,

        boardRef, /// for tracking/updating map state
        setBoardRef,

        playerRef,
        setPlayerRef,

        eventHandler
      }}
    >
    {children}
    </GameContext.Provider>
  );
}