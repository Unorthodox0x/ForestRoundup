import { createPublicClient, http } from 'viem'
import { expect, test } from 'vitest';
import { getSubLedger } from '@/constants/blockchain/contracts';
import { sepolia } from 'viem/chains';
import { SubscriptionLedgerAbi } from '@/constants/blockchain/abi';
import type { Address } from '@/types';

const chainId = sepolia.id;
const subscriptionLedger = getSubLedger(chainId);
const publicClient = createPublicClient({
    transport: http(),
    chain: sepolia,
  });

test('user is subscribed', async () => {

	const user = process.env?.TEST_USER_ADDRESS as Address;

	/// both work
	// const batch = 0; /// uint256 
	const batch = BigInt(0); /// uint256

	const batchIndex = 1; /// uint8
	const isSubscribed = await publicClient.readContract({
		  address: subscriptionLedger,
		  abi: SubscriptionLedgerAbi,
		  functionName: 'isSubscribed',
		  args: [user, batch, batchIndex]
		});

	console.log('isSubscribed', isSubscribed)
	expect(isSubscribed).toBeTruthy();
})