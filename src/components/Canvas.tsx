import { useContext } from "react";
import { GameContext } from "@/context/Game";
import { gameOver, startGame } from "@/constants/game";
import GameOverScreen from "./GameOverScreen";
import GameScreen from "./GameScreen";
import GameStartScreen from "./GameStartScreen";

/**
 * The canvas itself represents a psuedo space. 
 * The items on that canvas or described entirely by the current state
 *  -- The canvas must access the current game state when deciding how to draw/render content
 */
export default function Canvas() {

  const { 
    gameState,
  } = useContext(GameContext);

  /**
   * a "canvas" div wraps canvas to hide sections of map play is not currently on
   */

  console.log('<Canvas /> - gameState', gameState.current)

  if(gameState.current === startGame){
    return(
      <GameStartScreen />
    );    
  }

  if(gameState.current === gameOver){
    return <GameOverScreen />
  }

  return(
      <GameScreen />
  );
}