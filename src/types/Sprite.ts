import { battleAnimation, rockSquares, treasureSquares, treeSquares } from "@/constants/board";
import { gameOverCanvas, gameStartCanvas } from "@/constants/canvas";
import { enemyDirection, playerDirection } from "@/constants/input";
import { terrainTypes } from "@/constants/sprites";
import { Coordinates } from "./Board";

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


export type SpriteUrl = string;
// export type SpriteUrl = `src/assets/${string}.png`;
export type ObjectSpriteSource = Omit<TerrainSpriteSource, 'variations'>
export type TerrainSpriteSource = {
	variations:number, /// 
	src: SpriteUrl,
	frames:number
}

/// Forest1, Rock1, Ground9 
export type SpriteData = TerrainSpriteData|ObjectSpriteData;
export type TerrainSpriteData = Omit<ObjectSpriteData, 'spriteName'> & {
	spriteName: TerrainSpriteName,
}

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
	src: SpriteUrl, 
	frames: Coordinates[] 
}