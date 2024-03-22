import { gameSquare } from "./sprites";

/// render game every x ticks
export const terrainStaggerFrames = 200 as const;
export const playerStaggerFrames = 500 as const;
export const snailStaggerFrames = 500 as const;
/// all Sprites except rocks have 2 animation frames
export const renderStateOne = 0 as const;
export const renderStateTwo = 1 as const;

/**
 * @notice all pixel art use for game is designed 
 * 	on 32 by 32 pixel squares
 */
export const verticleTiles = 16 as const; // chunkHeigh * num verticle chunks
export const horizontalTiles = 36 as const; // chunkWidth * num horizontal chunks

export const canvasId = "raccoon-roundup" as const;
export const gameOverCanvas = 'GameOverScreen' as const;


/// view-port
export const canvasHeight = gameSquare * verticleTiles*2; 
export const canvasWidth = gameSquare * horizontalTiles*2;


/// map-size
// export const canvasHeight = cameraHeight * 3;
// export const canvasWidth = cameraWidth * 3;