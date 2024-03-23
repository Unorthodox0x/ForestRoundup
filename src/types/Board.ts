import { EnemyDirection, PlayerDirection, RockSprites, TerrainSpriteName, TreasureSprites, TreeSprites } from "./Sprite";

export type PlayerLocation = BoardLocation;
export type TreasureLocation = BoardLocation;
export type BoardLocation = {
		chunk: number, /// chunkIndex,
		tile: number, /// tileIndex
}

export type TileState = TileObjects|TerrainSpriteName;

export type TileObjects = 
	TreeSprites |
	RockSprites |
	TreasureSprites |
	PlayerDirection |
	EnemyDirection

export type Coordinates = {
	x: number,
	y:number,
}