import type { ObjectSpriteSources, TerrainSpriteSources } from "@/types";

/// each terrain sprite sheet is 320px x 64px, where a single tile is 32px
export const numberTerrainTiles = 10 as const;
export const objectSources: ObjectSpriteSources = {
	/// player movement direction
	playerDown: {
		frames: 2,
		src:  'sprites/playerDown.png',
	},
	playerUp:{ 
		frames: 2,
		src:  'sprites/playerUp.png',
	},
	playerLeft:{ 
		frames: 2,
		src:  'sprites/playerLeft.png'
	},
	playerRight:{ 
		frames: 2,
		src:  'sprites/playerRight.png',
	},

	/// player movement direction
	enemyDown: {
		frames: 2,
		src:  'sprites/enemyDown.png',
	},
	enemyUp:{ 
		frames: 2,
		src: 'sprites/enemyUp.png',
	},
	enemyLeft:{ 
		frames: 2,
		src: 'sprites/enemyLeft.png',
	},
	enemyRight:{ 
		frames: 2,
		src: 'sprites/enemyRight.png',
	},

	BattleAnimation:{
		frames: 6,
		src:  'sprites/BattleAnimation.png',
	},

	StartGameScreen:{
		frames: 1,
		src:  'sprites/StartGameScreen.png',
	},
	GameOverScreen:{
		frames: 1,
		src:  'sprites/GameOverScreen.png',
	},

	/// Map obstacles

	///   t1:[x1, x2] /// two frames
	///   t2:[x1, x2] /// two frames
	TreeOne:{ 
		frames: 2,
		src:  'sprites/TreeOne.png',
	},
	TreeTwo:{ 
		frames: 2,
		src:  'sprites/TreeTwo.png',
	},
	
	///   r1 :[x1] /// one frame
	///   r2 :[x1] /// one frame
	///   r3 :[x1] /// one frame
	RockOne:{ 
		frames: 1,
		src:  'sprites/RockOne.png',
	},
	RockTwo:{ 
		frames: 1,
		src:  'sprites/RockTwo.png',
	},
	RockThree:{ 
		frames: 1,
		src:  'sprites/RockThree.png',
	},

	
	//// Special

	///   t1 :[x1]
	///   t2 :[x1]
	///   t3 :[x1]
	TreasureOne:{
		frames: 1,
		src:  'sprites/TrashOne.png',
	},
	TreasureTwo:{
		frames: 1,
		src:  'sprites/TrashTwo.png',
	},
	TreasureThree:{
		frames: 1,
		src:  'sprites/TrashThree.png',
	},
} as const;

export const terrainSources:TerrainSpriteSources = {
	/// all background terrain types	
	Forest:{ 
		variations: 10,
		frames: 2,
		src:  'sprites/ForestTerrain.png',
	},
	Ground:{ 
		variations: 10,
		frames: 2,
		src:  'sprites/GroundTerrain.png',
	},
	Field:{ 
		variations: 10,
		frames: 2,
		src:  'sprites/FieldTerrain.png',
	},
} as const