import { treasureSquares, treeSquares, rockSquares, battleAnimation } from '@/constants/board';
import { enemyDirection, playerDirection } from '@/constants/input';
import { terrainTypes } from '@/constants/sprites';
import { gameStates } from '@/constants/game';
import Chunk from '@/lib/map/Chunk';
import Tile from '@/lib/map/Tile';

export type SetStateType<TType> = React.Dispatch<React.SetStateAction<TType>>


export type GameStates = typeof gameStates[number] | null

/**
 * Board: {
 * 		{ GameChunk }, { GameChunk }, { GameChunk },
 * 		{ GameChunk }, { GameChunk }, { GameChunk },
 * 		{ GameChunk }, { GameChunk }, { GameChunk },  }
 * 
 */
export type BoardData = {
	chunks: Chunk[]
	treasure: TreasureLocation
}
export type PlayerLocation = BoardLocation;
export type TreasureLocation = BoardLocation;
export type BoardLocation = {
		chunk: number, /// chunkIndex,
		tile: number, /// tileIndex
}
/**
 * Chunk: { { GameTile }, { GameTile }, { GameTile }, 
 * 	   		{ GameTile }, { GameTile }, { GameTile }, 
 * 	   		{ GameTile }, { GameTile }, { GameTile }, }
 */
export type ChunkData = {
	terrain: TerrainNames
	coords: Coordinates
	tiles: Tile[] /// this is the floor plan of the cunk
}

/**
 * Tile: 
 */
export type TileData = {
	chunk: Coordinates, /// which chunk does this belong to ?? 'metadata'
	state:  TileState[]; /// forest1 + p + t + ..
	coords: Coordinates,
}

export type TileObjects = 
	TreeSprites |
	RockSprites |
	TreasureSprites|
	PlayerDirection |
	EnemyDirection
	// typeof fireSq;

export type TileState = TileObjects|TerrainSpriteName;

export type ChunkName = ChunkNames[number]
export type ChunkNames = TerrainNames;

export type EnemyDirection = typeof enemyDirection[number];
export type PlayerDirection = typeof playerDirection[number];
export type RockSprites = typeof rockSquares[number];
export type TreeSprites = typeof treeSquares[number];
export type TreasureSprites = typeof treasureSquares[number];
export type TerrainNames = typeof terrainTypes[number];

export type BattleSprite = typeof battleAnimation;
export type TerrainSpriteName = `${TerrainNames}${number}`; 
export type ObjectSpriteNames = Exclude<SpriteNames, TerrainSpriteName>;
export type SpriteNames = BattleSprite|EnemyDirection|PlayerDirection|RockSprites|TreeSprites|TreasureSprites|TerrainSpriteName;

/// url pointers
// export type ObjectSpriteSources = SpriteSources<ObjectTypes> 
// export type TerrainSpriteSources = SpriteSources<TerrainTypes>;
// export type TerrainSprites = Sprites<TerrainTypes> 
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

export type SpriteUrl = `src/assets/${string}.png`;
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

export type Coordinates = {
	x: number,
	y:number,
}