import { useContext, type ReactNode } from "react";
import { GameContext, SessionContext } from "@/context";
import { gameStartCanvas } from '@/constants/canvas';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import useCanvasSize from '@/lib/render/useCanvasSize';
import {StartButton} from '@/components';

export default function GameStartScreen({ children }:{ children: ReactNode[]}) {

  const { canvasHeight, canvasWidth, isMobile } = useCanvasSize();

	const { gameStartScreen } =  useContext(GameContext);
  const { walletAddress, isSubscribed } = useContext(SessionContext);


  return(
    <div className={  
        isMobile 
          ? "inline-flex h-screen w-screen justify-center bg-transparent bg-opacity-95" 
          : "inline-flex h-cameraHeight w-cameraWidth justify-center bg-transparent bg-opacity-95 p-4"
    }> 
      
      <div className='flex flex-col justify-between items-center text-white'>
        <h1 className='text-6xl mt-8 font-Milonga font-bold'>
          Forest Roundup
        </h1>

        { /// user is connected, and subscription detected
          !!walletAddress && isSubscribed ? (
            <StartButton />
          ): /// user is connected, and not subscribed
          !!walletAddress && (!isSubscribed || isSubscribed === null) ? (
            <div className='flex h-20 w-80 py-2 px-4 text-sm justify-between items-center bg-opacity-90 border-black border-2 bg-white rounded-lg'>
              {children}
            </div>
          ):
            <div className='flex h-20 w-60 justify-center items-center rounded-lg text-xl'>
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
