import { useContext } from 'react';
import { SessionContext } from "@/context";
import useCanvasSize from '@/lib/render/useCanvasSize';

/**
 * Component displayed in Navbar when user is signed in.
 * 	:: displays the current wallet address, 
 * 	:: includes disconnect && signout actions
 */
export default function AccountSettings(){
	
  	const { isMobile } = useCanvasSize();
	const { handleDisconnect, walletAddress } = useContext(SessionContext);

	return (
		<div className={
			isMobile 
			? "flex pb-2 flex-col-reverse w-full h-44 self-center justify-center items-center" 
			: "flex py-6 self-center justify-center w-accountWidth" 
		}>
	
			<div className={
				isMobile 
				? "flex flex-col p-2 justify-center" 
				: "flex flex-col justify-between"
			}>
				<div className='flex pb-2 w-full justify-between'>
					<h2 className='font-bold'>Connected wallet:</h2>
					<button 
						className={
							isMobile
							? "flex h-6 p-2 self-end items-center text-sm rounded-full bg-green-800"
							: "flex h-6 p-2 items-center text-sm rounded-full bg-green-800 hover:translate-x-1 hover:-translate-y-1"
						}
						onClick={() => { handleDisconnect() }}
					>
						disconnect
					</button> 
				</div>
				<span>{walletAddress}</span>
			</div>

		</div>
	);
}	