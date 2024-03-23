import { useContext } from "react";
import { GameContext } from "@/context/Game";
import { canvasHeight, canvasWidth, gameStartCanvas } from '@/constants/canvas';

export default function GameStartScreen() {
	const { gameStartScreen } =  useContext(GameContext);

    return(
      <div className="inline-flex justify-center h-cameraHeight w-cameraWidth bg-black bg-opacity-95 p-4">
        
        <div className='flex flex-col justify-between text-white absolute z-10 h-full py-10'>
          <h1 className='text-6xl font-Milonga font-bold'>
            Forest Roundup
          </h1>
          <button
            className="flex w-44 self-center justify-center p-2 border-2 border-white hover:text-gray-100 hover:border-gray-100"
            onClick={() => {}}
          >
            Press any button
          </button>
        </div>

        <canvas 
          className="bg-transparent h-cameraHeight w-cameraWidth absolute"
          ref={gameStartScreen}
          id={gameStartCanvas}
          height={canvasHeight} 
          width={canvasWidth}
        />
      </div>
    )
}
