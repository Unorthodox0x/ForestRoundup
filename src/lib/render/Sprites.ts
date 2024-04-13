import { gameSquare } from "@/constants/canvas";
import { objectSources, terrainSources } from "@/constants/sprites";
import type {  ObjectSprites, ObjectSpriteNames, TerrainSprites, TerrainNames, AllSprites } from "@/types";

/**
 * This class can only be instantiated in client side code
 * 	because internally it uses HtmlImageElement to load game sprites
 */
export default class Sprites {
	
	spriteAnimationFrames:AllSprites;
	constructor(){
		const objectSprites = this.loadObjectSprites();
		const terrainSprites = this.loadTerrainSprites();
		this.spriteAnimationFrames = {
			...objectSprites, ...terrainSprites,
		};
	}
	
	/**
	 * Contains array of pointers to tiles on sprite sheet for each terrain type
	 * 
	 * @notice intended use is to  filter out the array that will be accessed at time of use, 
	 * 	only used when rendering initial map,
	 */ 
	loadObjectSprites = (): ObjectSprites => {
		/// terrain sprite sheets have dimensions { h: 64 w: 320 }
		/// where { h:[0 - 32]  w:[0 - 32] } is row one column one of sheet 

		const objectSprites = {} as ObjectSprites;	
		Object.entries(objectSources).map(([key, value]) => {
			const spriteKey = key as ObjectSpriteNames;

			/// load all images at time game loads it is not necessary to load
			/// them each time they are requested to be drawn to canvas
			const img = new Image();
			img.src = value.src;
				/// ['TreeOne': { 'TreeOne': { loc: [tilePointer1, tilePointer2] }, ]
				/// ['RockOne': { 'TreeOne': { loc: [tilePointer] }, }	
				objectSprites[spriteKey] = [{
					spriteName: `${spriteKey}`,
					img,
					frames: Array.from({length: value.frames}, (_, index) => { 
						return {
							y: 0, /// Objects are uni-dimensional
							/// terrain sprite sheets have a y dimension
							x: index * gameSquare,
							
						}
					})
				}];
		});

		return objectSprites;
	}	

	loadTerrainSprites = ():TerrainSprites => {
		const terrainSprites = {} as TerrainSprites;	
		Object.entries(terrainSources).map(([key, value]) => {
			const spriteKey = key as TerrainNames;

			/// ['Forest': { 'Forest0': { loc: [{tilePointer1}, {tilePointer2}] } }, { 'Forest1':{ loc: [{},..] } }, ... ]
			/// ['Ground': { 'Ground0': { loc: [{tilePointer1}, {tilePointer2}] } }, { 'Ground1':{ loc: [{},..] } }, ... ]
			/// ['Field': { 'Field0': { loc: [{tilePointer1}, {tilePointer2}] } }, { 'Field1':{ loc: [{},..] } }, ... ]
			const terrain = terrainSources[spriteKey];
			const img = new Image();
			img.src = value.src;
				terrainSprites[spriteKey] = Array.from({ length : terrain.variations }, 
					(_, variationIndex) => {	
						return {
							spriteName: `${spriteKey}${variationIndex}`, /// `${Forest}{0}`
							img,

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
}