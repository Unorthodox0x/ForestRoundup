import type { enemyType, playerType } from "@/constants/game";
import type { EnemyDirection, PlayerDirection, RockSprites, TerrainSpriteName, TreasureSprites, TreeSprites } from "./Sprite";


export type PlayerLocation = BoardLocation;
export type TreasureLocation = BoardLocation;

export type Player = typeof playerType;
export type Enemy = typeof enemyType;

export type CharacterState = `${PlayerDirection}${number}`|`${EnemyDirection}${number}`
export type TileState = TileObjects|CharacterState|TerrainSpriteName;
export type TileObjects = TreeSprites | RockSprites | TreasureSprites

/// these dimensions are dynamic based on height/width of device
/// for unhandled devices, the default of a single tile is 32x32  
export type TileDimensions = { 
	height:number, 
	width:number,
};
export type CanvasCoordinates = {
	chunk:Coordinates['x'|'y'], 
	tile:Coordinates['x'|'y']
}

export type Coordinates = {
	x: number,
	y:number,
}

export type BoardLocation = {
		chunk: number, /// chunkIndex,
		tile: number, /// tileIndex
}