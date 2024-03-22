import { useEffect, useRef, createContext, type ReactElement, type ReactNode, useState } from 'react';
import type { GameStates, IGameContext } from "@/types";
import Board from '@/lib/map/Board';
import Player from "@/lib/chars/Player"; 
import RenderEngine from '@/lib/render/RenderEngine';
import { gameOver, running } from '@/constants/game';
import { snailStaggerFrames, terrainStaggerFrames } from '@/constants/canvas';
import EventHandler from '@/lib/events/EventHandler';

export const GameContext = createContext<IGameContext>({} as IGameContext);
export const GameProvider = ({ children }: { children: ReactNode }): ReactElement | null => {
  
  const [score, setScore] = useState(0);
  const initialFrame = 0;

  const [gameState, setGameState] = useState<GameStates>(null);
  // const gameState = useRef<GameStates>(null);  /// paused || running?
  const gameFrame = useRef(initialFrame) /// current game state
  
  const gameOverScreen = useRef<HTMLCanvasElement|null>(null); /// game over 

  const terrainCanvas = useRef<HTMLCanvasElement|null>(null); /// trees && terrain
  const enemyCanvas = useRef<HTMLCanvasElement|null>(null);
  const treasureCanvas = useRef<HTMLCanvasElement|null>(null);
  const objectCanvas = useRef<HTMLCanvasElement|null>(null); /// rocks
  const playerCanvas = useRef<HTMLCanvasElement|null>(null); // treasure drawn to this canvas
  const treeCanvas = useRef<HTMLCanvasElement|null>(null); // treasure drawn to this canvas

  const boardRef = useRef<Board|null>(null);
  const playerRef = useRef<Player|null>(null);

  // Setter functions to update ref values from lower contexts
  const setBoardRef = (ref:Board|null) => { boardRef.current = ref; };
  const setPlayerRef = (ref:Player|null) => { playerRef.current = ref; };
  // const setGameState = (ref: GameStates) => { gameState.current = ref; }

  const eventHandler = useRef<EventHandler>(
    new EventHandler(setBoardRef, setScore, setGameState)
  ); 

  console.log('<GameProvider /> - gameState.current')

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

      const terrainContext = terrainCanvas.current?.getContext('2d')
      if(gameState.current === running && 
        (gameFrame.current === 1 || gameFrame.current % terrainStaggerFrames === 0)
      ){
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

      if(gameOverScreen && gameState === gameOver){
        /// TODO: Render Screen animation
        // context?.drawImage(, 0, 0, canvas.width, canvas.height)
        // const context = gameOverScreen.current.getContext('2d');
        // RenderEngine.drawSprite(
        //   context!, 
        //   spriteAnimationFrames[enemyDown][0]!, 
        //   renderStateOne, 
        //   { x: 0, y:0 }
        // );
      }
      
      /// call self to proceed to next stage of loop
      animationId = window.requestAnimationFrame(renderer);
    }

    /// start render loop
    renderer()

    return () => window.cancelAnimationFrame(animationId)
  },[gameState])

  return (
    <GameContext.Provider 
      value={{
        gameFrame,

        score,
        setScore,

        gameState,
        setGameState,

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