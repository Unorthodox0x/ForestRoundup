import { useEffect, createContext, useContext, type ReactElement, type ReactNode } from 'react';
// import handleStart from '@/lib/handleStart';
import { GameContext } from '@/context/Game';
import type { BoardLocation, IControllerContext } from '@/types';
import { playerDown, playerLeft, playerRight, playerUp } from '@/constants/input';
import { gameOver, mount, paused, startGame } from '@/constants/game';
import Controller from '@/lib/input/Controller';

export const ControllerContext = createContext<IControllerContext>({} as IControllerContext);
export const ControllerProvider = ({ children }: { children: ReactNode }): ReactElement | null => {

	/** Whereever the board is updated, must update boardRef.current */
	const { 
		gameState,
		setGameState,
		gameFrame,
		playerCanvas,
		terrainCanvas,
		treasureCanvas,
		enemyCanvas,
		boardRef,
		playerRef,
		eventHandler,
	} = useContext(GameContext);

	/**
	 * 	[GameState] ==> GameStart, Running, Paused, null
	 * 	
	 * 	- When GameStart, gameFrame === 0
	 * 
	 * 
	 * 
	 * When GameStart, gameScreen Canvas elements not in dom.
	 * so are not present at intial game board creation, 
	 * 	the current design of the game board requires access to these canvas elements to draw sprites
	 * 	  so a transitional stage is required from gameStart => mount => running
	 * 
	 * 	here, a setTimeout is used to allow time for canvas to appear in dom after state switch
	 */
	function loadCanvas(){
		setTimeout(()=>{
			if(
				!playerCanvas?.current||
				!terrainCanvas?.current||
				!enemyCanvas?.current||
				!treasureCanvas?.current
			) return;
			eventHandler.current?.handleStart(
				playerCanvas?.current,
				terrainCanvas?.current,
				enemyCanvas?.current,
				treasureCanvas?.current,
			);
		}, 100)
	}


	function handleKeyDown(e:KeyboardEvent){

		/// 1st input, start game
		/// becasue the player && enemy && other canvass are not present, there must be a switch from startGame to null, then back 
			/// this step is required to upate useRef hook to hide gameOverScree && repopulate other canvas elements in dom
			/// this switching of game state must be accompanied by an update to react state to for rerender
		if(gameState.current === gameOver || gameState.current === startGame){
			setGameState(mount); 
			loadCanvas();
		}

		if(gameState && e.code === 'Space'){
			
			// console.log('~~~ PAUSE EVENT ~~~', gameState);
			eventHandler.current?.handlePause(gameState.current);

		} else if(
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