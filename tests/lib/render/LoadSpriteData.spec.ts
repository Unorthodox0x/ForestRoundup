import {describe, test, expect, expectTypeOf} from 'vitest'
import { loadObjectSprites, loadTerrainSprites, objectSources, terrainSources } from "@/constants/sprites"
import { ObjectSpriteData, ObjectSpriteNames, TerrainNames, TerrainSpriteData } from '@/types'

describe('loadObjectSprites', ()=> { 
	const objectSprites = loadObjectSprites()
	console.log('objectSprites', objectSprites)
	Object.keys(objectSources).map((k)=>{
		const key = k as ObjectSpriteNames;

		// console.log('objectSprites - key', key)
		const sprite = objectSprites[key];
	
		test('typed correctly', () => {
			expectTypeOf<ObjectSpriteNames>(key);
			expectTypeOf<ObjectSpriteData[]>(sprite);

			/// for objects 
			expect(sprite).toHaveLength(1);
			sprite.map(data => {
				expect(data.spriteName).toEqual(key);
				expect(data.src).toEqual(objectSources[key].src);
			})
		});

		sprite.map(data => {
			test('sprites have correct number of frames', () => {
				if(data.spriteName.includes('Treasure')){
					expect(data.frames).toHaveLength(1)
				}
				if(data.spriteName.includes('Rock')){
					expect(data.frames).toHaveLength(1)
				}
				if(data.spriteName.includes('Tree')){
					expect(data.frames).toHaveLength(2)
				}
				if(data.spriteName.includes('Move')){
					expect(data.frames).toHaveLength(2)
				}
			})
		})
	});
})

describe('loadTerrainSprites', ()=> { 
	const terrainSprites = loadTerrainSprites()
	// console.log('terrainSprites', terrainSprites)
	Object.keys(terrainSources).map((k)=>{
		const key = k as TerrainNames

		/// [Ex. 'Forest0', 'Forest1', 'Forest2', .. ]
		const sprite = terrainSprites[key];
		test('typed correctly', () => {			
			expectTypeOf<TerrainNames>(key);
			expectTypeOf<TerrainSpriteData[]>(sprite);
			expect(sprite).toHaveLength(10); /// 10 different tiles per terrain
		});

		sprite.map((variation, variationIndex)=>{
			test('frames generated for terrain variation', () =>{
				/// variation === [Ex. 'Forest0': [ Frame1, Frame2], ]
				// console.log('terrain variation', variation);
				expectTypeOf<TerrainSpriteData>(variation);
				expect(variation.spriteName).toEqual(`${key}${variationIndex}`);
				expect(variation.src).toEqual(terrainSources[key].src);
			})

			/**
			 * Forest
			 *  	[
			 * 			   F0 	 	   F1     	F2 ... 
			 * 			{ 0, 0 },  { 32, 0 },  { 32, 0 },
			 *  		{ 0, 32 }, { 32, 32 }, { 64, 32 },
			 * 		]
			 */
			variation.frames.map((frame, frameIndex)=>{
				test('frames coordinates are calulated correctly', ()=>{
					if(variationIndex === 0 && frameIndex === 0){
						expect(frame.x).toEqual(0)
						expect(frame.y).toEqual(0)
					}
					if(variationIndex === 10 && frameIndex === 10){
						expect(frame.x).toEqual(320)
						expect(frame.y).toEqual(32)
					}
				})
			})
		});
	});
});