'use client'
import { useContext, type ReactNode } from "react";
import { GameContext } from "@/context/Game";
import { gameOver, paused, startGame } from "@/constants/game";
import { GameOverScreen, GameScreen, GameStartScreen, PauseScreen } from "@/components";


/**
 * The canvas itself represents a psuedo space. 
 * The items on that canvas or described entirely by the current state
 *  -- The canvas must access the current game state when deciding how to draw/render content
 */
export type GameScreenProps = {
  canvasHeight:number,
  canvasWidth:number
}
export default function Canvas({ children }:{ children: ReactNode }) {
  
  const { gameState } = useContext(GameContext);

  /**
   * a "canvas" div wraps canvas to hide sections of map play is not currently on
   */
  return(
    <div className="flex h-screen items-center self-center">
      { gameState.current === startGame ? (
        <GameStartScreen >
          {children} {/* Pass down server components - buttons containing internal server actions */}
        </GameStartScreen>
      ): gameState.current === gameOver ? (
        <GameOverScreen />
      ): gameState.current === paused ? (
        <PauseScreen /> 
      ): 
        <GameScreen />
      }
    </div>
  );
}