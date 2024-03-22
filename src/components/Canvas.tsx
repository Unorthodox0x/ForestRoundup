import { useContext } from "react";
import { GameContext } from "@/context/Game";
import GameScreen from '@/components/GameScreen'
import GameOverScreen from '@/components/GameOverScreen'
import { gameOver } from "@/constants/game";

/**
 * The canvas itself represents a psuedo space. 
 * The items on that canvas or described entirely by the current state
 *  -- The canvas must access the current game state when deciding how to draw/render content
 */
const Canvas = () => {

  const { 
    gameState,
  } = useContext(GameContext);

  console.log('Canvas', gameState.current)

  /**
   * a "canvas" div wraps canvas to hide sections of map play is not currently on
   */

  if(gameState.current === gameOver) {
    return(
      <GameOverScreen />
    );
  }

  // if(gameState.current === paused){
    /// straight black screen with opacity 
    /// `PAUSED` 
    /// PRESS SPACE TO CONTINUE ||
  // }
  /// return ( <PauseScreen /> ); 

  return (
    <GameScreen />    
  );
}

export default Canvas;