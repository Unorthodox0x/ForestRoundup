'use client';

import '@rainbow-me/rainbowkit/styles.css';
import '@/styles/global.css'

import { Inter } from "next/font/google";
import { 
  WalletContext, 
  SessionProvider, 
  ControllerProvider, 
  GameProvider, 
} from '@/context';
import Head from 'next/head';
//// session persistence?
// import { headers } from 'next/headers'
// import { cookieToInitialState } from 'wagmi'

const inter = Inter({ subsets: ["latin"] });
// import type { Metadata } from "next";
// export const metadata: Metadata = {
//   title: "Forest Roundup",
//   description: "Join Randal in cleaning up the forest",
// };

/**
 * A Game is a Module wrapping a canvas
 *  the module contains all code to execute game logic and render game
 * 
 * Children of client components can be server components, so all context providers
 *  should be imported here.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">

    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </Head>

      <body className={inter.className}>
        <WalletContext>
          <SessionProvider>
            <GameProvider>
              <ControllerProvider>
                {children}
              </ControllerProvider>
            </GameProvider>
          </SessionProvider>          
        </WalletContext>
      </body>
    </html>
  );
}
