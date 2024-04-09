import { useContext } from "react";
import { GameContext } from "@/context/Game";
import { gameOverCanvas } from '@/constants/canvas';
import useCanvasSize from '@/lib/render/useCanvasSize';
import {StartButton} from "@/components";


export default function GameOverScreen() {
	const { gameOverScreen, score } =  useContext(GameContext);
  const { canvasHeight, canvasWidth, isMobile } = useCanvasSize();

  return(
    <div className={
      isMobile 
        ? "inline-flex flex-col justify-between items-center h-screen w-screen bg-transparent bg-opacity-95" 
        : "inline-flex flex-col justify-between items-center h-cameraHeight w-cameraWidth bg-black bg-opacity-95"
    }>

        <h1 className={
          isMobile 
            ? 'text-3xl mt-4 Milonga text-white'
            : 'text-6xl mt-4 Milonga text-white'
        }>
          Score:{score}
        </h1>
        
        <StartButton />

      <canvas 
        className={
          isMobile ? "bg-transparent h-mobileCameraHeight w-mobileCameraWidth absolute z-10" 
          : "bg-transparent h-cameraHeight w-cameraWidth absolute z-10"
        }
        ref={gameOverScreen}
        id={gameOverCanvas}
        height={canvasHeight} 
        width={canvasWidth}
      />
    </div>
  )
}