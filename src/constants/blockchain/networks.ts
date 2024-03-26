import { mainnet, polygon, optimism, arbitrum, aurora, foundry, avalanche } from 'viem/chains';
import type { ActiveChain } from '@/types';

export const supportedNetworkIds = [foundry.id, mainnet.id, optimism.id, polygon.id, avalanche.id, arbitrum.id, aurora.id] as const;

///  A treasury address must exist on that network for it to be supported
export const enabledNetworks: ActiveChain[] = [{
	chainId: mainnet.id,
	name: 'Ethereum',
	src: 'src/assets/networks/Ethereum.png',
	chain: mainnet, /// ethersscan has limits
}, {
	chainId: optimism.id,
	name: 'Optimism',
	src: 'src/assets/networks/Optimism.png',
	chain: optimism,
},
{
	chainId: polygon.id,
	name: 'Polygon',
	src: 'src/assets/networks/Matic.webp',
	chain: polygon
}, {
	chainId: arbitrum.id,
	name: 'Arbitrum',
	src: 'src/assets/networks/Arbitrum.png',
	chain: arbitrum
},
{
	chainId: aurora.id,
	name: 'Aurora',
	src: 'src/assets/networks/Aurora.png',
	chain: aurora
},
{
	chainId: foundry.id,
	name: 'Foundry',
	src: 'src/assets/networks/Ethereum.png',
	chain: foundry
},
{
	chainId: avalanche.id,
	name: 'Avalanche',
	src: 'src/assets/networks/Avalanche.png',
	chain: avalanche,
},
];