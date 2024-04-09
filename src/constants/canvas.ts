import { gameSquare } from "./sprites";

/// render game every x ticks
export const terrainStaggerFrames = 200 as const;
// export const playerStaggerFrames = 500 as const;
export const snailStaggerFrames = 400 as const;
/// all Sprites except rocks have 2 animation frames
export const renderStateOne = 0 as const;
export const renderStateTwo = 1 as const;

/**
 * @notice all pixel art use for game is designed 
 * 	on 32 by 32 pixel squares
 */
export const verticleTiles = 16 as const; // chunkHeigh * num verticle chunks
export const horizontalTiles = 36 as const; // chunkWidth * num horizontal chunks

export const terrainCanvasId = "Terrian Canvas" as const;
export const rockCanvasId = "Rock Canvas" as const;
export const playerCanvasId = "Player Canvas" as const;
export const treeCanvasId = "Tree Canvas" as const;
export const treasureCanvasId = "Treasure Canvas" as const;
export const enemyCanvasId = "Enemy Canvas" as const;

export const gameOverCanvas = 'GameOverScreen' as const; // this has its own canvas
export const gameStartCanvas = 'StartGameScreen' as const; /// this uses terrain canvas


export const mobileCanvasHeight = (gameSquare * verticleTiles*2)/2; 
export const mobileCanvasWidth = (gameSquare * horizontalTiles*2)/2;

export const desktopCanvasHeight = gameSquare * verticleTiles*2; 
export const desktopCanvasWidth = gameSquare * horizontalTiles*2;