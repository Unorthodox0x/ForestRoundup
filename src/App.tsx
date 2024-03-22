import '@/styles/global.css'
import Canvas from "@/components/Canvas";
import { ControllerProvider } from './context/Controller';
import { GameProvider } from './context/Game';

/**
 * A Game is a Module wrapping a canvas
 *  the module contains all code to execute game logic and render game
 */


/**
 * Within the game, there is always a counter running,
 *  that tracks the current game render loop
 * 
 * for animations there will have to be a trigger event 
 *  that activates them, they will have their own starting frame
 *   and a staggerFrame value used to slow down the animation speed
 *  
 *  similar to RS - "ticks"??
 */
function App() {

  return (
    <GameProvider>
     <ControllerProvider>
      <Canvas />
     </ControllerProvider>
    </GameProvider>
  )
}

export default App;