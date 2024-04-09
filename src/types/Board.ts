import type { enemyType, playerType } from "@/constants/game";
import type { EnemyDirection, PlayerDirection, RockSprites, TerrainSpriteName, TreasureSprites, TreeSprites } from "./Sprite";

export type PlayerLocation = BoardLocation;
export type TreasureLocation = BoardLocation;
export type BoardLocation = {
		chunk: number, /// chunkIndex,
		tile: number, /// tileIndex
}

export type Player = typeof playerType;
export type Enemy = typeof enemyType;

export type CharacterState = `${PlayerDirection}${number}`|`${EnemyDirection}${number}`
export type TileState = TileObjects|CharacterState|TerrainSpriteName;
export type TileObjects = TreeSprites | RockSprites | TreasureSprites

export type Coordinates = {
	x: number,
	y:number,
}