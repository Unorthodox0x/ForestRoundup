import { useContext } from "react";
import { GameContext } from "@/context/Game";
import { gameOverCanvas, canvasHeight, canvasWidth } from '@/constants/canvas';

const GameOverScreen = () => {

	const { gameOverScreen, score } =  useContext(GameContext);

    return(
      <div className="inline-flex justify-center h-cameraHeight w-cameraWidth bg-green-200 bg-opacity-95 p-4">
        
        <div className='flex absolute right-0 top-0 -translate-y-10 text-white'>
          Score:{score}
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
export default GameOverScreen;
