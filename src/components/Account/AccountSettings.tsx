import { useContext } from 'react';
import { SessionContext } from "@/context";

/**
 * Component displayed in Navbar when user is signed in.
 * 	:: displays the current wallet address, 
 * 	:: includes disconnect && signout actions
 */
export default function AccountSettings(){
	
	const { handleDisconnect, walletAddress } = useContext(SessionContext);

	return (
		<div className="flex relative left-0 top-0 w-96">
			<h2 className="flex flex-col w-full">
				<b>Connected wallet:</b> 
				<span>{walletAddress}</span>
			</h2>
			<button 
				className="flex absolute -translate-y-2 h-6 right-0 px-1 items-center m-1 text-sm rounded-lg bg-green-800 hover:translate-x-1 hover:-translate-y-3"
				onClick={() => { handleDisconnect() }}
			>
				disconnect
			</button>
		</div>
	);
}	