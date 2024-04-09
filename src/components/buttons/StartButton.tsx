'use client';
import { useContext } from "react";
import { GameContext } from "@/context";
import useCanvasSize from '@/lib/render/useCanvasSize';
import { mount } from "@/constants/game";


export default function StartButton(){

  	const { isMobile } = useCanvasSize();
	const {
		eventHandler,
		playerCanvas,
		enemyCanvas,
		treasureCanvas,
		setGameState,
		resetGameFrames,
		setScore,
	} = useContext(GameContext);

	function handleStart(){
	console.log('<StartButton />  ~~~~~~~~ handleStart')

		/// load canvas elements into dom
		setScore(0)
    	resetGameFrames();
		setGameState(mount); 

		/// add slight delay to allow elements to mount
		setTimeout(()=>{
			if(!playerCanvas?.current ||
				!enemyCanvas?.current ||
				!treasureCanvas?.current
			) return;
			
			eventHandler.current?.handleStart(
				playerCanvas?.current,
				enemyCanvas?.current,
				treasureCanvas?.current
			);
		}, 50);
	}

	console.log('<StartButton /> ~~~~~~~~')

	return(
		<button
          className="flex w-44 self-center justify-center font-bold p-2 mb-4 border-2 border-white hover:text-gray-100 hover:border-gray-100 z-50"
          onClick={handleStart}
        >
        	{ isMobile 
        		? 'press to start'
        		: 'press any button'
	     	}
        </button>
	);
}