"use client";

import { useEffect, createContext, useContext, type ReactElement, type ReactNode } from 'react';
// import handleStart from '@/lib/handleStart';
import { GameContext } from '@/context/Game';
import type { IControllerContext } from '@/types';
import { playerDown, playerLeft, playerRight, playerUp } from '@/constants/zod/input';
import { gameOver, mount, paused, startGame } from '@/constants/game';
import { SessionContext } from "@/context";
import useCanvasSize from '@/lib/render/useCanvasSize';


export const ControllerContext = createContext<IControllerContext>({} as IControllerContext);
export const ControllerProvider = ({ children }: { children: ReactNode }): ReactElement | null => {

	/** Wherever the board is updated, must update boardRef.current */
	const { walletAddress,isSubscribed } = useContext(SessionContext);
  	const { canvasHeight, canvasWidth } = useCanvasSize();
	const { 
		gameState,
		setGameState,
		gameFrame,
		resetGameFrames,
		boardRef,
		playerRef,
		setScore,
		playerCanvas,
		enemyCanvas,
		treasureCanvas,
		terrainCanvas,
		treeCanvas,
		rockCanvas,
		eventHandler,
	} = useContext(GameContext);

	/**
	 * 	[GameState] ==> GameStart, Running, Paused, null
	 * 	
	 * 	- When GameStart, gameFrame === 0
	 * 
	 * When GameStart, gameScreen Canvas elements not in dom.
	 * so are not present at intial game board creation, 
	 * 	the current design of the game board requires access to these canvas elements to draw sprites
	 * 	  so a transitional stage is required from gameStart => mount => running
	 * 
	 * 	here, a setTimeout is used to allow time for canvas to Enter DOM after gameState switch
	 */
	function loadCanvas(){
		setTimeout(()=>{

			if(!playerCanvas?.current || !enemyCanvas?.current || 
				!treasureCanvas?.current || !terrainCanvas?.current ||
				!treeCanvas?.current|| !rockCanvas?.current
			) return;

			//// RESET ALL CANVAS CONTEXT BEFORE START NEW
	        const enemyContext = enemyCanvas.current?.getContext('2d')
	        enemyContext?.clearRect(0, 0, canvasWidth, canvasHeight);
	        const playerContext = playerCanvas.current?.getContext('2d')
	        playerContext?.clearRect(0, 0, canvasWidth, canvasHeight);
	        const terrainContext = terrainCanvas.current?.getContext('2d')
	        terrainContext?.clearRect(0, 0, canvasWidth, canvasHeight);
	        const treasureContext = treasureCanvas.current?.getContext('2d')
	        treasureContext?.clearRect(0, 0, canvasWidth, canvasHeight);
	        const treeContext = treeCanvas.current?.getContext('2d')
	        treeContext?.clearRect(0, 0, canvasWidth, canvasHeight);
	        const rockContext = rockCanvas.current?.getContext('2d')
	        rockContext?.clearRect(0, 0, canvasWidth, canvasHeight);


			console.log('loaded::: initialize game')
			eventHandler.current?.handleStart(
				playerCanvas.current, ///1st player context is unique because of being located in this function scope...?
				enemyCanvas.current, /// this is global enemy context, shared by all enemies
				treasureCanvas.current,
			);

		}, 50)
	}


	function handleKeyDown(e:KeyboardEvent){

		/// 1st input, start game
		/// becasue the player && enemy && other canvas are not present, there must be a switch from startGame to null, then back 
			/// this step is required to update useRef hook to hide gameOverScree && repopulate other canvas elements in dom
			/// this switching of game state must be accompanied by an update to react state to for rerender
		if(
			walletAddress && isSubscribed && 
			(gameState.current === gameOver || gameState.current === startGame)
		){
			setScore(0)
    		resetGameFrames();
			setGameState(mount);
			loadCanvas();
		}

		else if(
			gameFrame?.current &&
			boardRef.current?.chunks &&
			boardRef.current?.chunks.length > 0 &&
			playerCanvas?.current &&
			playerRef.current
		) {
			
			const playerContext = playerCanvas.current.getContext('2d');
			if(!playerContext) return;
			
			// console.log('~~~ PLAYER EVENT FROM INPUT ~~~');
			switch(e.code){
				case 'Space':
					// console.log('~~~ PAUSE EVENT ~~~', gameState);
					eventHandler.current?.handlePause(gameState.current);
					break;
				case "KeyW":
				case "ArrowUp":
					if(gameState.current === paused) return;
					eventHandler.current?.handleMove(boardRef.current, playerRef.current, playerUp, playerCanvas.current);
					break;
				case "KeyS":
				case "ArrowDown":
					if(gameState.current === paused) return;
					eventHandler.current?.handleMove(boardRef.current, playerRef.current, playerDown, playerCanvas.current);
					break;
				case "KeyA":
				case "ArrowLeft":
					if(gameState.current === paused) return;
					eventHandler.current?.handleMove(boardRef.current, playerRef.current, playerLeft, playerCanvas.current);
					break;
				case "KeyD":
				case "ArrowRight":
					if(gameState.current === paused) return;
					eventHandler.current?.handleMove(boardRef.current, playerRef.current, playerRight, playerCanvas.current);
					break
				default:
					/// unhandled input
					break;
			}
		}
	}

    /** initialize input detector */
	useEffect(()=>{
		window.addEventListener('keydown', handleKeyDown);
		/** Cleanup - to prevent multiple listeners */
		return () => window.removeEventListener('keydown', handleKeyDown);
	})

	return (
		<ControllerContext.Provider value={{}}>
		{children}
		</ControllerContext.Provider>
	);
}