'use client';

import { http } from "viem";
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import {
  // polygon,
  // optimism,
  // arbitrum,
  // base,
  // aurora,
  // avalanche,
  sepolia,
} from 'wagmi/chains';

const config = getDefaultConfig({
  appName: process.env.NEXT_PUBLIC_APP_NAME!,
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID!,
  appIcon: '/favicon.ico',
  chains: [sepolia],
  transports:{
    [sepolia.id]: http(),
    // [base.id]: http(),
    // [avalanche.id]: http(),
    // [arbitrum.id]: http(),
    // [aurora.id]: http(),
    // [optimism.id]: http(),
    // [polygon.id]: http(),
  },
  ssr: true, // If your dApp uses server side rendering (SSR)
});

export default config;