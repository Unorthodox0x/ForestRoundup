import { useEffect, createContext, useContext, type ReactElement, type ReactNode } from 'react';
// import handleStart from '@/lib/handleStart';
import { GameContext } from '@/context/Game';
import type { BoardLocation, IControllerContext } from '@/types';
import { playerDown, playerLeft, playerRight, playerUp } from '@/constants/input';
import { paused } from '@/constants/game';
import Controller from '@/lib/input/Controller';

export const ControllerContext = createContext<IControllerContext>({} as IControllerContext);
export const ControllerProvider = ({ children }: { children: ReactNode }): ReactElement | null => {

	/** Whereever the board is updated, must update boardRef.current */
	const { 
		gameState,
		gameFrame,
		playerCanvas,
		terrainCanvas,
		treasureCanvas,
		enemyCanvas,
		boardRef,
		playerRef,
		setPlayerRef,
		eventHandler,
	} = useContext(GameContext);

	/** 
	 * during the first pass through this context, when the game is initially 
	 * 	rendering, the initial canvasRef is null.
	 * 
	 * This value will not be populated until <canvas /> at deepest part of html tree is rendered 
	 */

	function handleKeyDown(e:KeyboardEvent){

		/// 1st input, start game
		if(gameFrame.current === 0 && playerCanvas && enemyCanvas && terrainCanvas && treasureCanvas) {
			
			// console.log('~~~ ``` initialize board ``` ~~~')
			eventHandler.current?.handleStart(
				playerCanvas.current,
				terrainCanvas.current,
				enemyCanvas.current,
				treasureCanvas.current,
				eventHandler.current,
				setPlayerRef,
			);

		} else if(gameState && e.code === 'Space'){
			
			// console.log('~~~ PAUSE EVENT ~~~', gameState);
			eventHandler.current?.handlePause(gameState.current);

		} else if(
			gameState &&
			gameState.current !== paused &&  
			gameFrame?.current && 
			boardRef.current?.chunks && 
			boardRef.current.chunks.length > 0 &&
			playerRef.current
		) {
			
			// console.log('~~~ PLAYER INPUT EVENT ~~~', gameState);
			let nextTileLoc: BoardLocation;
			switch(e.code){
				case "KeyS":
				case "ArrowDown":
					nextTileLoc = Controller.getNextTile(playerRef.current, playerDown)!
					eventHandler.current?.handleMove(boardRef.current, nextTileLoc, playerRef.current, playerDown);
					break;
				case "KeyW":
				case "ArrowUp":
					nextTileLoc = Controller.getNextTile(playerRef.current, playerUp)!
					eventHandler.current?.handleMove(boardRef.current, nextTileLoc, playerRef.current, playerUp);
					break;
				case "KeyA":
				case "ArrowLeft":
					nextTileLoc = Controller.getNextTile(playerRef.current, playerLeft)!
					eventHandler.current?.handleMove(boardRef.current, nextTileLoc, playerRef.current, playerLeft);
					break;
				case "KeyD":
				case "ArrowRight":
					nextTileLoc = Controller.getNextTile(playerRef.current, playerRight)!
					eventHandler.current?.handleMove(boardRef.current, nextTileLoc, playerRef.current, playerRight);
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
	},[])

	return (
		<ControllerContext.Provider value={{}}>
		{children}
		</ControllerContext.Provider>
	);
}