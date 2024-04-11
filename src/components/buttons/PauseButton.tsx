'use client';
import { useContext } from "react";
import { GameContext } from "@/context";
import { paused } from "@/constants/game";


/**
 * This COMPONENT REQUIRES.. EVENT LISTENER, THAT IS MOUNTED WHEN THE COMPONENT IS MOUNTED AND REMOVED UPON DISMOUNT
 **/
export default function PauseButton(){

	const { gameState, eventHandler } = useContext(GameContext);

	/**
	 * TODO:: There is an issue with the pause screen, 	
	 * 	on mobile, it does not rerender the player sometimes
	 * 	
	 * the main game board leaves the canvas and reenters, 
	 * 	this means the board needs to be redrawn, 
	 * 	
	 * currently on mobile, the method for rendering the board is sluggish
	 */
	function handlePress(){
		eventHandler.current?.handlePause(gameState.current);
	}

	return(
		<button 
			className='flex justify-center items-center h-12 w-12 text-sm p-2 text-black rounded-full absolute right-10 top-5 bg-opacity-30 border-white border-2 bg-gray-100 z-50'
			onClick={handlePress}
		>
		{ gameState.current === paused ? 'play' : 'pause' } 
		</button>
	);
}