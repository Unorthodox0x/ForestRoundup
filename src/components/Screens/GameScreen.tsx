import { canvasHeight, canvasWidth, treeCanvasId, terrainCanvasId, playerCanvasId, treasureCanvasId, enemyCanvasId, objectCanvasId } from '@/constants/canvas';
import { useContext } from "react";
import { GameContext } from "@/context/Game";

export default function GameScreen() {

	const { 
    score,
    objectCanvas,
    playerCanvas,
    enemyCanvas,
    treasureCanvas,
    terrainCanvas,
    treeCanvas,
	} = useContext(GameContext);

	return(
		<div className="inline-flex h-full w-full justify-center bg-green-200 bg-opacity-95 p-4">
      {/* PLAYER SCORE */}
      <div className='flex absolute left-0 top-0 -translate-y-10 text-white'>
        Score:{score}
      </div>
        
      <canvas
        className="bg-transparent h-cameraHeight w-cameraWidth absolute z-10"
        ref={objectCanvas} 
        id={objectCanvasId}
        height={canvasHeight} 
        width={canvasWidth}
      />
      <canvas
        className="bg-transparent h-cameraHeight w-cameraWidth absolute z-20"
        ref={enemyCanvas} 
        id={enemyCanvasId}
        height={canvasHeight} 
        width={canvasWidth}
      />
      <canvas
        className="bg-transparent h-cameraHeight w-cameraWidth absolute z-20"
        ref={treasureCanvas} 
        id={treasureCanvasId}
        height={canvasHeight} 
        width={canvasWidth}
      />
      <canvas
        className="bg-transparent h-cameraHeight w-cameraWidth absolute z-20"
        ref={playerCanvas} 
        id={playerCanvasId}
        height={canvasHeight} 
        width={canvasWidth}
      />
      <canvas
        className="bg-black h-cameraHeight w-cameraWidth absolute"
        ref={terrainCanvas} 
        id={terrainCanvasId}
        height={canvasHeight} 
        width={canvasWidth}
      />
      <canvas
        className="bg-transparent h-cameraHeight w-cameraWidth absolute z-20"
        ref={treeCanvas} 
        id={treeCanvasId}
        height={canvasHeight} 
        width={canvasWidth}
      />
    </div>
	);
}