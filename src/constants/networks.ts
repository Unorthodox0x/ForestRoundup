import { mainnet, polygon, optimism, arbitrum, aurora, foundry } from 'viem/chains';
import type { ActiveChain } from '@/types';

export const supportedNetworkIds = [foundry.id, mainnet.id, optimism.id, polygon.id, arbitrum.id, aurora.id] as const;

///  A treasury address must exist on that network for it to be supported
export const enabledNetworks: ActiveChain[] = [{
	chainId: mainnet.id,
	name: 'Ethereum',
	src: 'src/assets/networks/ethereum.png',
	chain: mainnet, /// ethersscan has limits
}, {
	chainId: optimism.id,
	name: 'Optimism',
	src: 'src/assets/networks/optimism.png',
	chain: optimism,
},
{
	chainId: polygon.id,
	name: 'Polygon',
	src: 'src/assets/networks/polygon.png',
	chain: polygon
}, {
	chainId: arbitrum.id,
	name: 'Arbitrum',
	src: 'src/assets/networks/arbitrum.png',
	chain: arbitrum
},
{
	chainId: aurora.id,
	name: 'Aurora',
	src: 'src/assets/networks/aurora.png',
	chain: aurora
},
{
	chainId: foundry.id,
	name: 'Foundry',
	src: 'src/assets/networks/ethereum.png',
	chain: foundry
}
// {
// 	chainId: 56, /// binance smart chain
// 	chain: bsc
// },
// {
// 	chainId: 43114,
// 	name: 'Avalanche',
// 	logo: images.Avalanche,
// 	chain: avalanche,
// },
];