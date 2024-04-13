import type { battleAnimation, rockSquares, treasureSquares, treeSquares } from "@/constants/board";
import type { gameOverCanvas, gameStartCanvas } from "@/constants/canvas";
import type { enemyDirection, playerDirection } from "@/constants/zod/input";
import type { terrainTypes } from "@/constants/board";
import type { Coordinates } from "./Board";
import type { Prettify } from "@/types";

export type EnemyDirection = typeof enemyDirection[number];
export type PlayerDirection = typeof playerDirection[number];
export type RockSprites = typeof rockSquares[number];
export type TreeSprites = typeof treeSquares[number];
export type TreasureSprites = typeof treasureSquares[number];
export type TerrainNames = typeof terrainTypes[number];

export type BattleSprite = typeof battleAnimation;
export type TerrainSpriteName = `${TerrainNames}${number}`; 
export type ObjectSpriteNames = Exclude<SpriteNames, TerrainSpriteName>;
export type StartGameScreen = typeof gameStartCanvas;
export type GameOverScreen = typeof gameOverCanvas
export type ScreenSprites = GameOverScreen|StartGameScreen;
export type SpriteNames = 
	ScreenSprites |
	BattleSprite |
	EnemyDirection |
	PlayerDirection |
	RockSprites |
	TreeSprites |
	TreasureSprites |
	TerrainSpriteName;

export type ObjectSpriteSources = {
  [key in ObjectSpriteNames]: ObjectSpriteSource;
};
// export type ObjectSprites = Sprites<ObjectTypes> 
export type TerrainSpriteSources = {
  [key in TerrainNames]: TerrainSpriteSource;
};
export type SpriteSources<TSprite extends SpriteNames> =
	TSprite extends ObjectSpriteNames ? Record<TSprite, ObjectSpriteSource>
	: TSprite extends TerrainNames ? Record<TSprite, TerrainSpriteSource>
	: never;


export type ObjectSpriteSource = Omit<TerrainSpriteSource, 'variations'>
export type TerrainSpriteSource = {
	variations:number, /// 
	src: string,
	frames:number
}

/// Forest1, Rock1, Ground9 
export type SpriteData = TerrainSpriteData|ObjectSpriteData;
export type TerrainSpriteData = Prettify<Omit<ObjectSpriteData, 'spriteName'> & {
	spriteName: TerrainSpriteName,
}>

export type AllSprites = TerrainSprites & ObjectSprites;
export type TerrainSprites = {
  [key in TerrainNames]: TerrainSpriteData[];
};
export type ObjectSprites = {
  [key in ObjectSpriteNames]: ObjectSpriteData[];
};
export type Sprites<TSprite extends SpriteNames> = 
	TSprite extends ObjectSpriteNames ? Record<TSprite, ObjectSpriteData[]>
	: TSprite extends TerrainNames ? Record<TSprite, TerrainSpriteData[]>
	: never;
export type ObjectSpriteData = { 
	spriteName: ObjectSpriteNames, 	
	img: HTMLImageElement, 
	frames: Coordinates[] 
}