'use client';

import { createPublicClient, http } from 'viem'
import { createContext, useRef, useEffect, useState, type ReactElement, type ReactNode } from 'react';
import type { Address, ISessionContext, SupportedChain } from "@/types";

import { SubscriptionLedgerAbi } from '@/constants/blockchain/abi';

import config from '@/lib/providers/wagmiConfig';
import { useAccountEffect, useDisconnect } from 'wagmi'
import { getSubLedger } from '@/constants/blockchain/contracts';
import { chainById } from '@/constants/blockchain/networks';

export const SessionContext = createContext<ISessionContext>({} as ISessionContext);
export const SessionProvider = ({ children }: { children: ReactNode }): ReactElement | null => {
  
  // const walletAddress = useRef<Address|null>(null);
  // const isSubscribed = useRef<boolean>(false);
  const batch = BigInt(0);
  const serviceId = 1 as const;

  const [connectedUser, setConnectedUser] = useState<Address|null>(null);
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
  const { disconnect } = useDisconnect({ config });

  function handleDisconnect(){
    disconnect();
    setConnectedUser(null);
    setIsSubscribed(false);
  }

  /** 
   * ``` Sign In user Action ```
   * Handle connected wallet account change. 
   */
  useAccountEffect({
    config,
    async onConnect({ address, chainId }) {
      try{

        if(!address) handleDisconnect()
        setConnectedUser(address); /// update ref to deliver value to controls

        const subscriptionLedger = getSubLedger(chainId as SupportedChain);
        const publicClient = createPublicClient({
          transport: http(),
          chain: chainById(chainId),
        });

        // unsupported network
        if(!subscriptionLedger) {
            setIsSubscribed(false);
            return; 
        }

        /// This requires contract to be deployed on the network user is connected to
        const subscribed = await publicClient.readContract({
          address: subscriptionLedger,
          abi: SubscriptionLedgerAbi,
          functionName: 'isSubscribed',
          args: [address, batch, serviceId]
        });

        setIsSubscribed(subscribed);
      } catch(err) {
        setIsSubscribed(false)
        // isSubscribed.current = false;
        console.error(err);
      }
    },
  });

  return (
    <SessionContext.Provider 
      value={{ 
        handleDisconnect,
        walletAddress: connectedUser,
        isSubscribed: isSubscribed
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}