import { treeCanvasId, terrainCanvasId, playerCanvasId, treasureCanvasId, enemyCanvasId, rockCanvasId } from '@/constants/canvas';
import { useContext } from "react";
import { GameContext } from "@/context/Game";
import useCanvasSize from '@/lib/render/useCanvasSize';

export default function GameScreen() {

  const { canvasHeight, canvasWidth } = useCanvasSize();
	const { 
    score,
    rockCanvas,
    playerCanvas,
    enemyCanvas,
    treasureCanvas,
    terrainCanvas,
    treeCanvas,
	} = useContext(GameContext);

	return(
		<div className="inline-flex h-full w-full justify-center bg-green-200 bg-opacity-95 p-4">

      {/* PLAYER SCORE */}
      <div className='flex w-full justify-center pl-20 -translate-y-14 text-lg text-white'>
        Score:{score}
      </div>
        
      <canvas
        className="bg-transparent h-cameraHeight w-cameraWidth absolute z-30"
        ref={enemyCanvas} 
        id={enemyCanvasId}
        height={canvasHeight} 
        width={canvasWidth}
      />
      <canvas
        className="bg-transparent h-cameraHeight w-cameraWidth absolute z-30"
        ref={playerCanvas} 
        id={playerCanvasId}
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
        className="bg-transparent h-cameraHeight w-cameraWidth absolute z-10"
        ref={rockCanvas} 
        id={rockCanvasId}
        height={canvasHeight} 
        width={canvasWidth}
      />
      <canvas
        className="bg-transparent h-cameraHeight w-cameraWidth absolute z-10"
        ref={treeCanvas} 
        id={treeCanvasId}
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
    </div>
	);
}