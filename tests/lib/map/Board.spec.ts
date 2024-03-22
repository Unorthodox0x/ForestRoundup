import {describe, test, expect, expectTypeOf } from 'vitest';
import { JSDOM } from 'jsdom';
import { boardLength, chunkLength, boardWidth, originChunk, originSquare, defaultPlayerSq, rightChunkBoundary, rightMapBoundary, bottomMapBoundary, bottomChunkBoundary } from "@/constants/board";
import Board from "@/lib/map/Board";
import Chunk from '@/lib/map/Chunk';
import { terrainTypes, treasureOne, treasureThree, treasureTwo } from '@/constants/sprites';
import { defaultCoords } from './Tile.spec';

// Create a new JSDOM instance with a simple HTML document
const { window } = new JSDOM(`<!DOCTYPE html><html><body><canvas id="playerCanvas"></canvas></body></html>`);
const enemyCanvas = window.document.getElementById('playerCanvas') as HTMLCanvasElement;

test('constructor executes', () => {
	// Create an instance of MyClass
	const board = new Board();
	// Assert that myObject is truthy, indicating that the constructor completed
	expect(board).toBeTruthy();
	expectTypeOf<Board>(board); /// JS Class
	expectTypeOf<Chunk[]>(board.chunks); /// Board instance
	expect(board.chunks).toHaveLength(0);
	expect(board.treasure).toStrictEqual({ chunk: 0, tile:0 })
});

describe('Board - initialize', async() => {

	const board = new Board();
	await board.initialize(enemyCanvas);

	test('creates correct number of rows and columns', () => {
		expect(board.chunks.length).toEqual(boardLength);
		board.chunks.map((chunk, index)=>{
				
			/// valid terrain type
			expect(terrainTypes).toContain(chunk.terrain)

			/// correct coords
			const y = Math.floor(index / boardWidth); // Calculate the row index
			const x = index % boardWidth; // Calculate the column index
			expect(chunk.coords.x).toEqual(x)
			expect(chunk.coords.y).toEqual(y)
			
			/// correct length
			expect(chunk.tiles.length).toEqual(chunkLength);
		} )
	});

	test('only one player set on map', () => {
		let playerCount = 0;
		board.chunks.map((chunk)=>{
			chunk.tiles.map((tile)=>{
				if(tile.state.includes(defaultPlayerSq)){
					playerCount++
				}
			})
		})
		expect(playerCount).toEqual(1)
	});
	test('only one treasure set on map', () => {
		let treasureCount = 0;
		const treasureSquares = new Set([treasureOne, treasureTwo, treasureThree])
		board.chunks.map((chunk)=>{
			chunk.tiles.map((tile)=>{
				const found = tile.state.some(value => treasureSquares.has(value));
				if(found) treasureCount++;
			})
		})
		expect(treasureCount).toEqual(1)
	});
	test('player is in center of map', () => {
		expect(
			board.chunks[originChunk]?.tiles[originSquare]?.state.includes(defaultPlayerSq)	
		).toBeTruthy();
	})
	test('enemy not placed in chunk with player or obstacle', () =>{
		board.chunks.map((chunk)=>{
			chunk.tiles.map((tile)=>{
				if(tile.hasState('enemy')){
					expect(tile.state).toHaveLength(2);
					expect(tile.hasState('Tree')).toBeFalsy();
					expect(tile.hasState('Rock')).toBeFalsy();
					expect(tile.hasState('player')).toBeFalsy();
				}
			})
		})
	});
	test('enemy location matches tile they are placed in', ()=>{
		board.enemies.map((enemy)=>{
			const tile = board.getChunk(enemy.location.chunk)?.getTile(enemy.location.tile);

			console.log('enemy.location', enemy.location)
			console.log('enemy.direction', enemy.direction)
			console.log('enemy tile', tile)
			expect(tile).toBeDefined();
			expect(tile?.hasState('enemy')).toBeTruthy()
			expect(tile?.hasState('Tree')).not.toBeTruthy()
			expect(tile?.hasState('Rock')).not.toBeTruthy()
			expect(tile?.state).toHaveLength(2)
		})
	})
	test.skip('no isolated squares created', ()=> {
		expect(false).toBeTruthy();
	})
});

describe('spawnEnemies', async() => {

	const board = new Board();
	await board.generateChunks();	
	test('enemies added to chunks', ()=>{
		const enemies = board.enemies;
		enemies.map((enemy)=>{
			const tile = board
				.getChunk(enemy.location.chunk)
				?.getTile(enemy.location.tile);

			expect(tile).toBeDefined();
			expect(tile?.hasState('Player')).not.toBeTruthy();
			expect(tile?.hasState('Tree')).not.toBeTruthy();
			expect(tile?.hasState('Rock')).not.toBeTruthy();
			expect(tile?.hasState('enemy')).toBeTruthy();
		})
	})
});

describe('rollEnemyChunk', async() => {
	const board = new Board();
	await board.generateChunks();
	test('adds enemy to tile, facing selected direction', async() => {
		const { direction, location } = await board.rollEnemyChunk();
		const tile = board.getChunk(location.chunk)?.getTile(location.tile);
		expect(tile?.hasState(direction)).toBeTruthy();
	})
})

describe('setPlayerTile', () => { 

	test('sets player at origin during initialization', async() => {
		const board = new Board();
		await board.initialize(enemyCanvas);

		const originTile = board.chunks[originChunk]!.tiles[originSquare];
		console.log('setPlayerTile - tile',  originTile)
		if(!originTile) throw new Error('setup failed');

		expect(originTile.state.some((val) => val === defaultPlayerSq)).toBeTruthy()
	})
});

describe('setTreasure', async() => { 

	const board = new Board();
	await board.generateChunks();

	test('updates board with single treasure tile', () => {

		/// board is initilized with treasure at default coords
		expect(board.treasure).toStrictEqual({ chunk:0, tile:0 });

		/// update treasure position to a new random square
		board.setTreasure();
		expect(board.treasure).not.toStrictEqual(defaultCoords);

		/// ????
		/// if the default coords of treasure are {0, 0}
		/// does this mean that a tile's state contains treasure?



		/// sets single treasure
		let treasureCount = 0;
		board.chunks.map((chunk)=>{
			chunk.tiles.map((tile) => {
				// console.log('Board.spec.setTreasure -- tile.state:::%O', tile.state)
				const found = tile.state.some(value => value.includes('Treasure'));
				if(found) treasureCount++;
			})
		});
		expect(treasureCount).toEqual(1);
	});
})

// describe.skip('set perimeter', async() =>{
// 	const board = new Board();
// 	await board.initialize(enemyCanvas);
// 	// 	const borderState = new Set([treeOne, treeTwo])
	
// 	board.chunks.map((chunk)=>{
// 		chunk.tiles.map((tile)=>{
// 			test('tree set in border tile', () => {
// 				if( 
// 					//// left boundary wall
// 					(chunk.coords.x === 0 && tile.coords.x ===0) ||
// 					//// top boundary wall
// 					(chunk.coords.y === 0 && tile.coords.y === 0) ||
// 					//// righ5 boundary wall
// 					(chunk.coords.x === rightMapBoundary && tile.coords.x === rightChunkBoundary) ||
// 					//// bottom boundary wall
// 					(chunk.coords.y === bottomMapBoundary && tile.coords.y === bottomChunkBoundary)
// 				){
// 					expect(tile.hasState('Tree')).toBeTruthy()
// 					expect(tile.state).toHaveLength(2); /// terrain && tree
// 				}
// 			})
// 		})
// 	});
// });