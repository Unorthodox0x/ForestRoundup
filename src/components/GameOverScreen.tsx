import { useContext } from "react";
import { GameContext } from "@/context/Game";
import { gameOverCanvas, canvasHeight, canvasWidth } from '@/constants/canvas';

export default function GameOverScreen() {
	const { gameOverScreen, score } =  useContext(GameContext);

    return(
      <div className="inline-flex justify-center h-cameraHeight w-cameraWidth bg-black bg-opacity-95 p-4">
        
        <div className='flex flex-col justify-between text-white'>
          <h1 className='text-6xl Milonga'>
            Score:{score}
          </h1>
          <button
            className="flex justify-center p-2 border-2 border-white hover:text-gray-100 hover:border-gray-100"
            onClick={() => {}}
          >
            Try Again
          </button>
        </div>

        <canvas 
          className="bg-transparent h-cameraHeight w-cameraWidth absolute z-10"
          ref={gameOverScreen}
          id={gameOverCanvas}
          height={canvasHeight} 
          width={canvasWidth}
        />
      </div>
    )
}