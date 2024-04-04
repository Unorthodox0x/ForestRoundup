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
	address: '0xA51c1fc2f0D1a1b8494Ed1FE312d7C3a78Ed91C0' as Address
},{
	chainId: sepolia.id,
	address: '0x1181B3fF8eD68ca13820c7c8861De6ad77457E48' as Address
}]

export const getSubLedger = (chainId: SupportedChain) => {
	const contract = subscriptionLedgerContracts.find((c)=> 
		c.chainId === chainId
	);
	if(!contract) throw new Error('unsupported network');
	return contract.address;
}