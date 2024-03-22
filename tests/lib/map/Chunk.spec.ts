import { describe, test, expect, expectTypeOf } from 'vitest';
import Chunk from "@/lib/map/Chunk";
import { bottomChunkBoundary, bottomMapBoundary, chunkLength, chunkWidth, lastChunkIndex, lastTileIndex, rightChunkBoundary, rightMapBoundary } from '@/constants/board';
import { terrainTypes } from '@/constants/sprites';
import { TerrainSpriteName, TileObjects } from '@/types';


describe('initializes chunk class with correct coordinates', () => {
	test('first chunk', () => {
		const chunk = new Chunk(0);
		expect(chunk.coords).toStrictEqual({ x: 0, y:0 })
		expect(chunk.tiles).toHaveLength(0);
		expect(terrainTypes.some((value)=> value === chunk.terrain)).toBeTruthy();
	});
	test('last chunk', () => {
		const chunk = new Chunk(lastChunkIndex);
		expect(chunk.coords).toStrictEqual({ x: rightMapBoundary, y:bottomMapBoundary })
		expect(chunk.tiles).toHaveLength(0);
		expect(terrainTypes.some((value)=> value === chunk.terrain)).toBeTruthy();
	});
})

describe('getTile', ()=> {
	const chunk = new Chunk(0);
	test('chunk length === chunkLength', async() => {
		await chunk.initialize();

		const tile = chunk.getTile(lastTileIndex);
		expect(tile).toBeDefined();
	})
})

describe('initialize', ()=> {
	
	describe('chunk tiles initialize', () => { 
		
		test('initialize first chunk', async() => {
			let chunk = new Chunk(0);
			chunk = await chunk.initialize();

			expect(chunk.tiles).toHaveLength(chunkLength)
			
			/// tiles initialized correctly
			chunk.tiles.map((tile) => {
				/// tile given correct coords of parent
				expect(tile.chunk).toStrictEqual(chunk.coords)

				tile.state.map((state,index)=>{
					if(index===0){
						expectTypeOf<TerrainSpriteName>(state)
					}else{
						expectTypeOf<TileObjects>(state)
					}
				})
				
			})
		})

		test('sets coordinates of chunk tiles', async() => {
			let chunk = new Chunk(0);
			chunk = await chunk.initialize();

			/// top left
			expect(chunk.tiles[0]?.coords).toStrictEqual({ x: 0, y:0 })
			/// top right
			expect(chunk.tiles[rightChunkBoundary]?.coords).toStrictEqual({ 
				x: rightChunkBoundary, 
				y:0 
			})
			/// bottom left
			expect(chunk.tiles[chunkLength-chunkWidth]?.coords).toStrictEqual({ 
				x: 0, 
				y:bottomChunkBoundary 
			})
			/// bottom right
			expect(chunk.tiles[lastTileIndex]?.coords).toStrictEqual({ 
				x: rightChunkBoundary, 
				y: bottomChunkBoundary 
			})
		});

		test('initialize last chunk', async() => {
			let chunk = new Chunk(lastChunkIndex);
			chunk = await chunk.initialize();

			expect(chunk.tiles).toHaveLength(chunkLength)
				chunk.tiles.map((tile) => {
				expect(tile.chunk).toStrictEqual(chunk.coords)
			})
		})
	})
})



test('indexToCoords', () => {
	/// if Chunk width === 6 && Chunk height === 4
	/// origin Chunk
	expect(Chunk.indexToCoords(15)).toStrictEqual({ x: 3, y: 2 });


	/// row 1
	expect(Chunk.indexToCoords(0)).toStrictEqual({ x: 0, y: 0 });
	expect(Chunk.indexToCoords(1)).toStrictEqual({ x: 1, y: 0 });
	expect(Chunk.indexToCoords(2)).toStrictEqual({ x: 2, y: 0 });
	expect(Chunk.indexToCoords(3)).toStrictEqual({ x: 3, y: 0 });
	expect(Chunk.indexToCoords(4)).toStrictEqual({ x: 4, y: 0 });
	expect(Chunk.indexToCoords(5)).toStrictEqual({ x: 5, y: 0 });

	/// row 2
	expect(Chunk.indexToCoords(6)).toStrictEqual({ x: 0, y: 1 });
	expect(Chunk.indexToCoords(7)).toStrictEqual({ x: 1, y: 1 });
	expect(Chunk.indexToCoords(8)).toStrictEqual({ x: 2, y: 1 });
	expect(Chunk.indexToCoords(9)).toStrictEqual({ x: 3, y: 1 });
	expect(Chunk.indexToCoords(10)).toStrictEqual({ x: 4, y: 1 });
	expect(Chunk.indexToCoords(11)).toStrictEqual({ x: 5, y: 1 });

	/// row 3
	expect(Chunk.indexToCoords(12)).toStrictEqual({ x: 0, y: 2 })
	expect(Chunk.indexToCoords(13)).toStrictEqual({ x: 1, y: 2 })
	expect(Chunk.indexToCoords(14)).toStrictEqual({ x: 2, y: 2 })
	expect(Chunk.indexToCoords(16)).toStrictEqual({ x: 4, y: 2 })
	expect(Chunk.indexToCoords(17)).toStrictEqual({ x: 5, y: 2 })
	
	/// row 4
	expect(Chunk.indexToCoords(18)).toStrictEqual({ x: 0, y: 3 })
	expect(Chunk.indexToCoords(19)).toStrictEqual({ x: 1, y: 3 })
	expect(Chunk.indexToCoords(20)).toStrictEqual({ x: 2, y: 3 })
	expect(Chunk.indexToCoords(21)).toStrictEqual({ x: 3, y: 3 });
	expect(Chunk.indexToCoords(22)).toStrictEqual({ x: 4, y: 3 });
	expect(Chunk.indexToCoords(23)).toStrictEqual({ x: 5, y: 3 });
});



