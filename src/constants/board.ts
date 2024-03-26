import { playerDown } from "@/constants/zod/input";
import { rockOne, rockThree, rockTwo, treasureOne, treasureThree, treasureTwo, treeOne, treeTwo } from "./sprites";

export const defaultPlayerSq = playerDown;
export const defaultCoords = { x: 0, y: 0 }; /// initialzer value for many objects


export const fireSq = 'f' as const;
export const enemySquare = 'enemy' as const;
export const battleAnimation = 'BattleAnimation' as const;
export const obstacleSquares = [treeOne, treeTwo, rockOne, rockTwo, rockThree];
// export const obstacleSet = new Set([obstacleSquares])

export const treeSquares = [treeOne, treeTwo];
export const rockSquares = [rockOne, rockTwo, rockThree];
export const treasureSquares = [treasureOne,treasureTwo,treasureThree];


/// each chunk will have 4 rows and 6 columns of tiles
export const chunkHeight = 4 as const; /// tiles
export const chunkWidth = 6 as const; /// tiles
export const chunkLength = chunkHeight * chunkWidth;
export const lastTileIndex = chunkLength - 1;
export const bottomChunkBoundary = chunkHeight - 1; // 0 --> chunkWidth
export const rightChunkBoundary = chunkWidth - 1; // 0 --> chunkWidth


export const boardHeight = 4 as const; /// chunks
export const boardWidth = 6 as const; /// chunks
export const boardLength = boardHeight * boardWidth;
export const lastChunkIndex = boardLength - 1;

/// if board width === 6, column index === [0 ~ 5], 5th index is boundary
export const rightMapBoundary = boardWidth - 1;
/// if board height === 4, row index === [0 ~ 3], 3rd index is boundary
export const bottomMapBoundary = boardHeight - 1;

export const topBoundary = 0 as const;
export const leftBoundary = 0 as const;


/**
 * Player Spawn Location
 */
/// chunk in center of map
export const originChunk = 15; /// 24/2 = 12. subtract to get index[0 -> 11]
/// indicator of which chunk player wil spaw at start of game
export const originSquare = 15;