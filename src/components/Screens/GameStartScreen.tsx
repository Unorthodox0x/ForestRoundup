'use client';

import { useState, useContext, type ReactNode } from "react";
import { GameContext, SessionContext } from "@/context";
import { gameStartCanvas } from '@/constants/canvas';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import useCanvasSize from '@/lib/render/useCanvasSize';
import { StartButton, OptionButton, AccountSettings } from '@/components';

export default function GameStartScreen({ children }:{ children: ReactNode[]}) {

  const { canvasHeight, canvasWidth, isMobile } = useCanvasSize();
	const { gameStartScreen } =  useContext(GameContext);
  const { networkSupported, walletAddress, isSubscribed } = useContext(SessionContext);

  const [open, setOpen] = useState<boolean>(false);


  return(
    <div className={  
        isMobile 
          ? "inline-flex h-screen w-screen justify-center bg-transparent bg-opacity-95" 
          : "inline-flex h-cameraHeight w-cameraWidth justify-center bg-transparent bg-opacity-95 p-4"
    }> 
      
      <div className='flex flex-col justify-between items-center text-white'>
        <h1 className='text-6xl text-center mt-8 font-Milonga font-bold'>
          Forest Roundup
        </h1>

        {/* Display wallet info button - only when wallet is connected so user can disconnect if necessary */}
        { walletAddress && <OptionButton open={open} setOpen={setOpen} /> }
        { open && walletAddress && (
            <div className={
               isMobile 
                ? "inline-flex absolute h-screen w-screen justify-center bg-black bg-opacity-95" 
                : "inline-flex absolute h-cameraHeight w-cameraWidth justify-center bg-black bg-opacity-95"
            }>
              <AccountSettings /> 
            </div>
        ) }

        { /// user is connected, and subscription detected
          networkSupported && walletAddress && isSubscribed ? (
            <StartButton />
          ): /// user is connected, and not subscribed
          
          networkSupported && walletAddress && (!isSubscribed || isSubscribed === null) ? (
            <div className='flex h-20 w-80 py-2 px-4 text-sm justify-between items-center bg-opacity-90 border-black border-2 bg-white rounded-lg'>
              {children}
            </div>
          ):
            <div className='flex h-20 w-60 justify-center items-center rounded-lg text-xl'>
              {/* Not connected, or connected to unsupported network */}
              <ConnectButton />
            </div>
        }
      </div>

      <canvas 
        className={
          isMobile ? "bg-transparent h-mobileCameraHeight w-mobileCameraWidth absolute -z-10" 
          : "bg-transparent h-cameraHeight w-cameraWidth absolute -z-10"
        }
        ref={gameStartScreen}
        id={gameStartCanvas}
        height={canvasHeight} 
        width={canvasWidth}
      />
    </div>
  )
}
