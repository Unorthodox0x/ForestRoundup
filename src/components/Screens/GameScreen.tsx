import { treeCanvasId, terrainCanvasId, playerCanvasId, treasureCanvasId, enemyCanvasId, rockCanvasId } from '@/constants/canvas';
import { useContext } from "react";
import { GameContext } from "@/context/Game";
import useCanvasSize from '@/lib/render/useCanvasSize';
import { PauseButton } from '@/components';

export default function GameScreen() {

  const { canvasHeight, canvasWidth, isMobile } = useCanvasSize();
	const { 
    rockCanvas,
    playerCanvas,
    enemyCanvas,
    treasureCanvas,
    terrainCanvas,
    treeCanvas,
	} = useContext(GameContext);

	return(
		<div className={
      isMobile 
        ? "inline-flex h-screen w-screen justify-center bg-transparent bg-opacity-95" 
        : "inline-flex h-cameraHeight w-cameraWidth justify-center bg-opacity-95"
    }>

      { isMobile && (
        <PauseButton />
      ) }
        
      <canvas
        className={
          isMobile ? "bg-transparent h-mobileCameraHeight w-mobileCameraWidth absolute z-30"          
          : "bg-transparent h-cameraHeight w-cameraWidth absolute z-30"
        }
        ref={enemyCanvas} 
        id={enemyCanvasId}
        height={canvasHeight} 
        width={canvasWidth}
      />
      <canvas
        className={
          isMobile ? "bg-transparent h-mobileCameraHeight w-mobileCameraWidth absolute z-30"          
          : "bg-transparent h-cameraHeight w-cameraWidth absolute z-30"
        }
        ref={playerCanvas} 
        id={playerCanvasId}
        height={canvasHeight} 
        width={canvasWidth}
      />
      
      <canvas
        className={
          isMobile ? "bg-transparent h-mobileCameraHeight w-mobileCameraWidth absolute z-20"
          : "bg-transparent h-cameraHeight w-cameraWidth absolute z-20"
        }
        ref={treasureCanvas} 
        id={treasureCanvasId}
        height={canvasHeight} 
        width={canvasWidth}
      />

      <canvas
        className={
          isMobile ? "bg-transparent h-mobileCameraHeight w-mobileCameraWidth absolute z-10"
          : "bg-transparent h-cameraHeight w-cameraWidth absolute z-10"
        }
        ref={rockCanvas} 
        id={rockCanvasId}
        height={canvasHeight} 
        width={canvasWidth}
      />
      <canvas
        className={
          isMobile ? "bg-transparent h-mobileCameraHeight w-mobileCameraWidth absolute z-10"
          : "bg-transparent h-cameraHeight w-cameraWidth absolute z-10"
        }
        ref={treeCanvas} 
        id={treeCanvasId}
        height={canvasHeight} 
        width={canvasWidth}
      />
      <canvas
        className={
          isMobile ? "bg-black h-mobileCameraHeight w-mobileCameraWidth absolute"
          : "bg-transparent h-cameraHeight w-cameraWidth absolute"
        }
        ref={terrainCanvas} 
        id={terrainCanvasId}
        height={canvasHeight} 
        width={canvasWidth}
      />
    </div>
	);
}