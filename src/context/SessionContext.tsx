"use client";

import { createContext, useRef, useEffect, useState, type ReactElement, type ReactNode } from 'react';
import type { Address, ISessionContext } from "@/types";

import { SubscriptionLedgerAbi } from '@/constants/blockchain/abi';

import config from '@/lib/providers/wagmiConfig';
import { useAccountEffect, useDisconnect } from 'wagmi'
import { readContract } from '@wagmi/core';
import { arbitrum, sepolia } from 'viem/chains';
import { getSubLedger } from '@/constants/blockchain/contracts';

export const SessionContext = createContext<ISessionContext>({} as ISessionContext);
export const SessionProvider = ({ children }: { children: ReactNode }): ReactElement | null => {
  
  /// this must be a useRef hook, to be accessed within the controls scope
  const walletAddress = useRef<Address|null>(null);
  const isSubscribed = useRef<boolean|null>(null);

  // const { address, isConnected } = useAccount({ config });
  const {disconnect} = useDisconnect({ config });
  // console.log('isConnected', isConnected)
  // console.log('address', address)

  const batch = BigInt(0);
  const serviceId = 0;

  function handleDisconnect(){
    disconnect();
    walletAddress.current = null;
    isSubscribed.current = null;
  }

  /** 
   * ``` Sign In user Action ```
   * Handle connected wallet account change. 
   */
  useAccountEffect({
    config,
    async onConnect({ address }) {
      if(!address) handleDisconnect()
      walletAddress.current = address;

      try{
        /// This requires contract to be deployed on the network user is connected to
        isSubscribed.current = await readContract(config, {
          chainId: sepolia.id,
          address: getSubLedger(sepolia.id),
          abi: SubscriptionLedgerAbi,
          functionName: 'isSubscribed',
          args: [
            /// connecting user
            address,
            batch, 
            serviceId
          ]
        });
      } catch(err) {
        isSubscribed.current = false;
        console.error(err);
      }
    },
  });

  /// hook to fix wagmi wallet hydration
  const [hasMounted, setHasMounted] = useState<boolean>(false);
  /// fix wagmi hydration error
  useEffect(() => { setHasMounted(true); }, []) /// requires double render
  if (!hasMounted) return (<></>); // 'null component'  

  return (
    <SessionContext.Provider 
      value={{ 
        handleDisconnect,
        walletAddress: walletAddress.current,
        isSubscribed: isSubscribed.current
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}