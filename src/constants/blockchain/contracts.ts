import type { NetworkInfo, SupportedChain, Address } from "@/types";
import { sepolia, foundry } from "viem/chains";


/**
 * Design descision::
 * 	publishing contracts cost money, and businesses will only subscribe to a contract on a single network
 * ** When requesting to verify if the user's address is subscribed, just use their wallet address
 * 	and always check arbitrum network 
 */
const subscriptionLedgerContracts:NetworkInfo[] = [{
	chainId: foundry.id,
	address: process.env.FOUNDRY_SUBSCRIPTION_LEDGER as Address
},{
	chainId: sepolia.id,
	address: process.env.SEPOLIA_SUBSCRIPTION_LEDGER as Address
}]


export const getSubLedger = (chainId: SupportedChain) => {
	const contract = subscriptionLedgerContracts.find((c)=> c.chainId === chainId);
	if(!contract) throw new Error('unsupported network');
	return contract.address;
}