'use client';
import { useContext } from "react";
import { GameContext } from "@/context";
import { paused } from "@/constants/game";


/**
 * This COMPONENT REQUIRES.. EVENT LISTENER, THAT IS MOUNTED WHEN THE COMPONENT IS MOUNTED AND REMOVED UPON DISMOUNT
 **/
export default function PauseButton(){

	const { gameState, eventHandler } = useContext(GameContext);

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