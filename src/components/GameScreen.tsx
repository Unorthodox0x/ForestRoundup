import { canvasId, canvasHeight, canvasWidth } from '@/constants/canvas';
import { useContext } from "react";
import { GameContext } from "@/context/Game";


export const GameScreen = () => {

	const { 
		objectCanvas,
		playerCanvas,
		enemyCanvas,
		treasureCanvas,
		terrainCanvas,
		treeCanvas,
		score,
	} = useContext(GameContext);

	// if(!terrainCanvas) return null;

	return(
		<div className="inline-flex justify-center h-cameraHeight w-cameraWidth bg-green-200 bg-opacity-95 p-4">
      {/* PLAYER SCORE */}
      <div className='flex absolute right-0 top-0 -translate-y-10 text-white'>
        Score:{score}
      </div>
      <canvas
        className="bg-transparent h-cameraHeight w-cameraWidth absolute z-10"
        ref={objectCanvas} 
        id={canvasId}
        height={canvasHeight} 
        width={canvasWidth}
      />
      <canvas
        className="bg-transparent h-cameraHeight w-cameraWidth absolute z-20"
        ref={enemyCanvas} 
        id={canvasId}
        height={canvasHeight} 
        width={canvasWidth}
      />
      <canvas
        className="bg-transparent h-cameraHeight w-cameraWidth absolute z-20"
        ref={treasureCanvas} 
        id={canvasId}
        height={canvasHeight} 
        width={canvasWidth}
      />
      <canvas
        className="bg-transparent h-cameraHeight w-cameraWidth absolute z-20"
        ref={playerCanvas} 
        id={canvasId}
        height={canvasHeight} 
        width={canvasWidth}
      />
      <canvas
        className="bg-white h-cameraHeight w-cameraWidth absolute"
        ref={terrainCanvas} 
        id={canvasId}
        height={canvasHeight} 
        width={canvasWidth}
      />
      <canvas
        className="bg-transparent h-cameraHeight w-cameraWidth absolute z-20"
        ref={treeCanvas} 
        id={canvasId}
        height={canvasHeight} 
        width={canvasWidth}
      />
    </div>
	);
}

export default GameScreen