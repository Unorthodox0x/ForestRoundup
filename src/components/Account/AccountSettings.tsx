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
			? "flex justify-center w-full" 
			: "flex py-6 self-center justify-center w-accountWidth" 
		}>
			<h2 className={
				isMobile 
				? "flex flex-col p-2 justify-center w-full" 
				: "flex flex-col justify-between"
			}>
				<b>Connected wallet:</b> 
				<span>{walletAddress}</span>
			</h2>
			<button 
				className={
					isMobile
					? "flex absolute -translate-y-2 h-6 right-10 px-1 items-center m-1 text-sm rounded-lg bg-green-800 hover:translate-x-1 hover:-translate-y-3"
					: "flex h-6 px-1 items-center text-sm rounded-lg bg-green-800 hover:translate-x-1 hover:-translate-y-3"
				}
				onClick={() => { handleDisconnect() }}
			>
				disconnect
			</button>
		</div>
	);
}	