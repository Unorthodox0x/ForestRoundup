'use client'
import { useContext, type ReactNode } from "react";
import { GameContext } from "@/context/Game";
import { gameOver, startGame } from "@/constants/game";
import { AccountSettings, GameOverScreen, GameScreen, GameStartScreen } from "@/components";
import { SessionContext } from '@/context';

/**
 * The canvas itself represents a psuedo space. 
 * The items on that canvas or described entirely by the current state
 *  -- The canvas must access the current game state when deciding how to draw/render content
 */
export default function Canvas({children}:{children: ReactNode[]}) {

  const { walletAddress } = useContext(SessionContext);
  const { gameState } = useContext(GameContext);

  /**
   * a "canvas" div wraps canvas to hide sections of map play is not currently on
   */
  return(
    <>
      { walletAddress ? (
        <AccountSettings />
      ): null }
      { gameState.current === startGame ? (
        <GameStartScreen >
          {children} {/* Pass down server components */}
        </GameStartScreen>
      ): gameState.current === gameOver ? (
        <GameOverScreen />
      ):
        <GameScreen />
      }
    </>
  );
}