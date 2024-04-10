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
			? "flex flex-col-reverse w-full h-44 self-center justify-center items-center" 
			: "flex py-6 self-center justify-center w-accountWidth" 
		}>
			<h2 className={
				isMobile 
				? "flex flex-col p-2 justify-center" 
				: "flex flex-col justify-between"
			}>
				<b>Connected wallet:</b> 
				<span>{walletAddress}</span>
			</h2>
			<button 
				className={
					isMobile
					? "flex h-6 px-1 mr-14 self-end items-center text-sm rounded-lg bg-green-800"
					: "flex h-6 px-1 items-center text-sm rounded-lg bg-green-800 hover:translate-x-1 hover:-translate-y-3"
				}
				onClick={() => { handleDisconnect() }}
			>
				disconnect
			</button>
		</div>
	);
}	