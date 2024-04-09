import { useContext, type ReactNode } from "react";
import { GameContext } from "@/context";
import { gameStartCanvas } from '@/constants/canvas';
import { SessionContext } from "@/context";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { GameScreenProps } from "../Canvas";
import useCanvasSize from '@/lib/render/useCanvasSize';

export default function GameStartScreen({ children }:{ children: ReactNode[]}) {

  const { canvasHeight, canvasWidth } = useCanvasSize();

	const { gameStartScreen } =  useContext(GameContext);
  const { walletAddress, isSubscribed } = useContext(SessionContext);
  
  return(
    <div className="inline-flex h-full w-full justify-center bg-transparent bg-opacity-95 p-4">
      
      <div className='flex flex-col justify-between items-center text-white'>
        <h1 className='text-6xl mt-8 font-Milonga font-bold'>
          Forest Roundup
        </h1>

        { /// user is connected, and subscription detected
          !!walletAddress && isSubscribed ? (
            <button
              className="flex w-44 self-center justify-center p-2 border-2 border-white hover:text-gray-100 hover:border-gray-100"
              disabled
            >
              Press any button
            </button>
          ): /// user is connected, and not subscribed
          !!walletAddress && (!isSubscribed || isSubscribed === null) ? (
            <div
              className='flex h-20 w-80 py-2 px-4 text-sm justify-between items-center bg-opacity-90 border-black border-2 bg-white rounded-lg'
            >
            {children}
            </div>
          ):
            <div className='flex h-20 w-60 justify-center items-center rounded-lg text-xl'>
              <ConnectButton />
            </div>
        }
      </div>

      <canvas 
        className="bg-transparent h-cameraHeight w-cameraWidth absolute -z-10"
        ref={gameStartScreen}
        id={gameStartCanvas}
        height={canvasHeight} 
        width={canvasWidth}
      />
    </div>
  )
}
