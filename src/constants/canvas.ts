import { boardHeight, boardWidth, chunkHeight, chunkWidth } from "./board";

/// dimensions of all sprites on sprite sheets
export const gameSquare = 32 as const; /// 32px x 32px

/// render game every x ticks
export const terrainStaggerFrames = 200 as const;
// export const playerStaggerFrames = 500 as const;
export const snailStaggerFrames = 400 as const;
/// all Sprites except rocks have 2 animation frames
export const renderStateOne = 0 as const;
export const renderStateTwo = 1 as const;


export const gameOverCanvas = 'GameOverScreen' as const; // this has its own canvas
export const gameStartCanvas = 'StartGameScreen' as const; /// this uses terrain canvas

export const terrainCanvasId = "Terrian Canvas" as const;
export const rockCanvasId = "Rock Canvas" as const;
export const playerCanvasId = "Player Canvas" as const;
export const treeCanvasId = "Tree Canvas" as const;
export const treasureCanvasId = "Treasure Canvas" as const;
export const enemyCanvasId = "Enemy Canvas" as const;


/**
 * @notice all pixel art use for game is designed 
 * 	on 32 by 32 pixel squares
 */
export const verticleTiles = chunkHeight * boardHeight; 
export const horizontalTiles = chunkWidth * boardWidth;

export const chunkCanvasWidth = chunkWidth * gameSquare;
export const chunkCanvasHeight = chunkHeight * gameSquare;
export const desktopCanvasHeight = chunkCanvasHeight * boardHeight; 
export const desktopCanvasWidth = chunkCanvasWidth * boardWidth;