import { ObjectSpriteSources, ObjectSprites, ObjectSpriteNames, TerrainSpriteSources,   TerrainSprites, TerrainNames } from "@/types";

/// dimensions of all sprites on sprite sheets
export const gameSquare = 32 as const; /// 32px x 32px

export const field = 'Field' as const;
export const forest = 'Forest' as const;
export const ground = 'Ground' as const;
export const terrainTypes = [forest, field, ground];

export const treeOne = 'TreeOne' as const;
export const treeTwo = 'TreeTwo' as const

export const rockOne = 'RockOne' as const;
export const rockTwo = 'RockTwo' as const;
export const rockThree = 'RockThree' as const;

export const treasureOne = 'TreasureOne' as const;
export const treasureTwo = 'TreasureTwo' as const;
export const treasureThree = 'TreasureThree' as const;

/// each terrain sprite sheet is 320px x 64px, where a single tile is 32px
export const numberTerrainTiles = 10;

export const objectSources: ObjectSpriteSources = {
	/// player movement direction
	playerDown: {
		frames: 2,
		src: `src/assets/sprites/playerDown.png`,
	},
	playerUp:{ 
		frames: 2,
		src:`src/assets/sprites/playerUp.png`,
	},
	playerLeft:{ 
		frames: 2,
		src:`src/assets/sprites/playerLeft.png`,
	},
	playerRight:{ 
		frames: 2,
		src:`src/assets/sprites/playerRight.png`,
	},

	/// player movement direction
	enemyDown: {
		frames: 2,
		src: `src/assets/sprites/enemyDown.png`,
	},
	enemyUp:{ 
		frames: 2,
		src:`src/assets/sprites/enemyUp.png`,
	},
	enemyLeft:{ 
		frames: 2,
		src:`src/assets/sprites/enemyLeft.png`,
	},
	enemyRight:{ 
		frames: 2,
		src:`src/assets/sprites/enemyRight.png`,
	},

	BattleAnimation:{
		frames: 6,
		src:`src/assets/sprites/BattleAnimation.png`,
	},

	StartGameScreen:{
		frames: 1,
		src:`src/assets/sprites/StartGameScreen.png`,
	},
	GameOverScreen:{
		frames: 1,
		src:`src/assets/sprites/GameOverScreen.png`,
	},

	/// Map obstacles

	///   t1:[x1, x2] /// two frames
	///   t2:[x1, x2] /// two frames
	TreeOne:{ 
		frames: 2,
		src:`src/assets/sprites/TreeOne.png`,
	},
	TreeTwo:{ 
		frames: 2,
		src:`src/assets/sprites/TreeTwo.png`,
	},
	
	///   r1 :[x1] /// one frame
	///   r2 :[x1] /// one frame
	///   r3 :[x1] /// one frame
	RockOne:{ 
		frames: 1,
		src:`src/assets/sprites/RockOne.png`,
	},
	RockTwo:{ 
		frames: 1,
		src:`src/assets/sprites/RockTwo.png`,
	},
	RockThree:{ 
		frames: 1,
		src:`src/assets/sprites/RockThree.png`,
	},

	
	//// Special

	///   t1 :[x1]
	///   t2 :[x1]
	///   t3 :[x1]
	TreasureOne:{
		frames: 1,
		src:`src/assets/sprites/TrashOne.png`,
	},
	TreasureTwo:{
		frames: 1,
		src:`src/assets/sprites/TrashTwo.png`,
	},
	TreasureThree:{
		frames: 1,
		src:`src/assets/sprites/TrashThree.png`,
	},
} as const;

export const terrainSources:TerrainSpriteSources = {
	/// all background terrain types	
	Forest:{ 
		variations: 10,
		frames: 2,
		src:`src/assets/sprites/ForestTerrain.png`,
	},
	Ground:{ 
		variations: 10,
		frames: 2,
		src:`src/assets/sprites/GroundTerrain.png`,
	},
	Field:{ 
		variations: 10,
		frames: 2,
		src:`src/assets/sprites/FieldTerrain.png`,
	},
} as const

/**
 * Contains array of pointers to tiles on sprite sheet for each terrain type
 * 
 * @notice intended use is to  filter out the array that will be accessed at time of use, 
 * 	only used when rendering initial map,
 */ 
export const loadObjectSprites = (): ObjectSprites => {

	/// terrain sprite sheets have dimensions { h: 64 w: 320 }
	/// where { h:[0 - 32]  w:[0 - 32] } is row one column one of sheet 

	const objectSprites = {} as ObjectSprites;	
	Object.entries(objectSources).map(([key, value]) => {
		const spriteKey = key as ObjectSpriteNames;

		/// ['TreeOne': { 'TreeOne': { loc: [tilePointer1, tilePointer2] }, ]
		/// ['RockOne': { 'TreeOne': { loc: [tilePointer] }, }	
		objectSprites[spriteKey] = [{
			spriteName: `${spriteKey}`,
			src: value.src,
			frames: Array.from({length: value.frames}, (_, index) => { 
				return {
					y: 0, /// Objects are uni-dimensional
					/// terrain sprite sheets have a y dimension
					x: index * gameSquare,
					
				}
			})
		}]
	});

	return objectSprites;
}

export const loadTerrainSprites = ():TerrainSprites => {

	const terrainSprites = {} as TerrainSprites;	
	Object.entries(terrainSources).map(([key, value]) => {
		const spriteKey = key as TerrainNames;

		/// ['Forest': { 'Forest0': { loc: [{tilePointer1}, {tilePointer2}] } }, { 'Forest1':{ loc: [{},..] } }, ... ]
		/// ['Ground': { 'Ground0': { loc: [{tilePointer1}, {tilePointer2}] } }, { 'Ground1':{ loc: [{},..] } }, ... ]
		/// ['Field': { 'Field0': { loc: [{tilePointer1}, {tilePointer2}] } }, { 'Field1':{ loc: [{},..] } }, ... ]
		const terrain = terrainSources[spriteKey];
		terrainSprites[spriteKey] = Array.from({ length : terrain.variations }, 
			(_, variationIndex) => {	
				return {
					spriteName: `${spriteKey}${variationIndex}`,
					src: value.src,

					/// frame calculation is incorrect for terrain

					frames: Array.from({length: value.frames}, (_, frameIndex) => { 
						return {
							/// this error should be fine..? 
							y: frameIndex * gameSquare,
							/// terrain sprite sheets have a y dimension
							x: variationIndex * gameSquare,
						}
					})
				}
			});
	});

	return terrainSprites;
};

export const spriteAnimationFrames = {
	...loadObjectSprites(),
	...loadTerrainSprites()
};
