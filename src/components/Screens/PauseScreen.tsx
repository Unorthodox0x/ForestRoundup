'use client'

import { useContext } from 'react';
import { GameContext, SessionContext } from '@/context';
import { PauseButton, AccountSettings } from '@/components';
import useCanvasSize from '@/lib/render/useCanvasSize';

export default function PauseScreen(){

  	const { isMobile } = useCanvasSize();

	const { walletAddress } = useContext(SessionContext);
	const { score } =  useContext(GameContext);


	/// TODO::: MOVE Wallet connection infor
		/// game score, 
			/// play
	
	/// single solid black background


	return(
		<div className={
			isMobile 
		        ? "inline-flex flex-col absolute h-screen w-screen justify-center bg-black bg-opacity-95 z-50" 
		        : "inline-flex flex-col absolute h-cameraHeight w-cameraWidth justify-center bg-black bg-opacity-95 z-50"
	    }>

			<h1 className='flex h-full w-full items-end mt-6 justify-center text-6xl Milonga text-white'>
				Paused 
			</h1>

			{/* PLAYER SCORE */}
			<h1 className='flex h-full w-full items-end mb-10 justify-center text-3xl Milonga text-white'>
			  Score:{score}
			</h1>

			{ isMobile && ( <PauseButton /> ) }
		
			{ walletAddress && ( <AccountSettings /> ) }
		</div>
	);
}