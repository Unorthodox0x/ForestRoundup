"use client";

import { useEffect, useState, type ReactElement, type ReactNode } from 'react';

import { WagmiProvider } from "wagmi";
import config from "@/lib/providers/wagmiConfig";
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

export const WalletContext = ({ children }: { children: ReactNode }): ReactElement | null => {

  const queryClient = new QueryClient();

    /// hook to fix wagmi wallet hydration
  const [hasMounted, setHasMounted] = useState<boolean>(false);
  /// fix wagmi hydration error
  useEffect(() => { setHasMounted(true); }, []) /// requires double render
  if (!hasMounted) return (<></>); // 'null component'  

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={darkTheme()}>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}