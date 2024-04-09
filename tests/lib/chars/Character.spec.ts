// import {beforeEach, describe, expect, test, vi} from 'vitest'
// // Import JSDOM to create a virtual DOM environment
// import { JSDOM } from 'jsdom';
// import Character from '@/lib/chars/Character';
// import { defaultCoords, originChunk, originSquare } from '@/constants/board';
// import Tile from '@/lib/map/Tile';
// import { collectTreasure, gameOver, movePlayer, playerType } from '@/constants/game';
// import { treasureOne, treeOne } from '@/constants/sprites';
// import { playerUp, playerDown, playerLeft, playerRight, enemyDown } from '@/constants/zod/input';
// import Board from '@/lib/map/Board';
// import { desktopCanvasHeight, desktopCanvasWidth } from '@/constants/canvas';


// // Create a new JSDOM instance with a simple HTML document
// /// # MOCKS
// const { window } = new JSDOM(`<!DOCTYPE html><html><body><canvas id="playerCanvas"></canvas></body></html>`);
// const canvas = window.document.getElementById('playerCanvas') as HTMLCanvasElement;
// canvas.height=desktopCanvasHeight; 
// canvas.width=desktopCanvasWidth;
// canvas.getContext = vi.fn(() => ({
//   clearRect: vi.fn(),
//   fillRect: vi.fn(),
//   // Add other methods as needed for testing
// }));

// const defaultPlayer = () => {
// 	return new Character(
// 		canvas!, 
// 		playerDown, 
// 		{chunk: originChunk, tile: originSquare}, 
// 		playerType
// 	);
// }
// const player = defaultPlayer();

// // constructor
// test('creates new instance', () => {
// 	expect(canvas).not.toBeNull();
// 	const player = defaultPlayer();

// 	expect(player).not.toBeUndefined();
// 	expect(player.location.chunk).toEqual(originChunk)
// 	expect(player.location.tile).toEqual(originSquare)
// 	expect(player.canvasX).toBeDefined();
// 	expect(player.canvasY).toBeDefined();

// });

// describe('validateMove', () => {
// 	const player = defaultPlayer();

// 	test('signal move into tile with enemy', () => {
// 		const tile = new Tile(defaultCoords, originSquare);
// 		tile.addState(enemyDown);
// 		expect(player.move(canvas, player, tile)).toEqual(gameOver)
// 	});
// 	test('signal move into tile with obstacle', () => {
// 		const tile = new Tile(defaultCoords, 0);
// 		tile.addState(treeOne);
// 		expect(player.validateMove(tile)).toEqual(undefined)
// 	});
// 	test('signal move into tile with treasure', () => {
// 		const tile = new Tile(defaultCoords, 0);
// 		tile.addState(treasureOne);
// 		expect(player.validateMove(tile)).toEqual(collectTreasure)
// 	});
// 	test('signal move into empty tile', () => {
// 		const tile = new Tile(defaultCoords, 0);
// 		expect(player.validateMove(tile)).toEqual(movePlayer)
// 	})
// })

// describe('updatePlayerLocation', () => {

// 	let board: Board;
// 	let player: Character;
// 	beforeEach(
// 		async()=>{
// 			board = new Board();
// 			await board.initialize();
// 		});

// 	test('update player when move up', () => {

// 		const player = defaultPlayer();
// 		const nextTileUp = player.getNextTile(playerUp, player);
// 		const nextTile = board
// 			.getChunk(nextTileUp?.chunk)
// 				?.getTile(nextTileUp?.tile);
// 		const updatedBoard = player.updatePlayerLocation(
// 			board, nextTile!, nextTileUp!, playerUp
// 		)!;

// 		/// player was removed from origin chunk
// 		const updatedPrev = updatedBoard.getChunk(15)?.getTile(15);			
// 		const updatedNext = updatedBoard
// 		.getChunk(nextTileUp?.chunk)
// 			?.getTile(nextTileUp?.tile);
		

// 		expect(updatedPrev?.state).not.toContainEqual(playerUp)
// 		expect(updatedNext?.state).toContainEqual(playerUp)
// 		expect(player.location).toStrictEqual({ 
// 			chunk: 15, 
// 			tile: 9 
// 		});
// 	});
// 	test('update player when move down', () => {
// 		const player = defaultPlayer();
// 		const nextTileDown = player.getNextTile(playerDown, player);
// 		const nextTile = board
// 			.getChunk(nextTileDown?.chunk)
// 				?.getTile(nextTileDown?.tile);
// 		const updatedBoard = player.updatePlayerLocation(
// 			board, nextTile!, nextTileDown!, playerDown
// 		)!;

// 		/// player was removed from origin chunk
// 		const updatedPrev = updatedBoard.getChunk(15)?.getTile(15);			
// 		const updatedNext = updatedBoard
// 		.getChunk(nextTileDown?.chunk)
// 			?.getTile(nextTileDown?.tile);
		
// 		expect(updatedPrev?.state).not.toContainEqual(playerDown)
// 		expect(updatedNext?.state).toContainEqual(playerDown)
// 		expect(player.location).toStrictEqual({ 
// 			chunk: 15, 
// 			tile: 21
// 		});
// 	})
// 	test('update player when move left', () => {
// 		const nextTileleft = player.getNextTile(playerLeft, player);
// 		const nextTile = board
// 			.getChunk(nextTileleft?.chunk)
// 				?.getTile(nextTileleft?.tile);
// 		const updatedBoard = player.updatePlayerLocation(
// 			board, nextTile!, nextTileleft!, playerLeft
// 		)!;

// 		/// player was removed from origin chunk
// 		const updatedPrev = updatedBoard.getChunk(15)?.getTile(15);			
// 		const updatedNext = updatedBoard
// 		.getChunk(nextTileleft?.chunk)
// 			?.getTile(nextTileleft?.tile);

// 		expect(updatedPrev?.state).not.toContainEqual(playerLeft)
// 		expect(updatedNext?.state).toContainEqual(playerLeft)
// 		expect(player.location).toStrictEqual({ 
// 			chunk: 15, 
// 			tile: 14
// 		});
// 	})
// 	test('update player when move right', () => {
// 		const nextTileUp = player.getNextTile(playerRight, player);
// 		const nextTile = board
// 			.getChunk(nextTileUp?.chunk)
// 				?.getTile(nextTileUp?.tile);
// 		const updatedBoard = player.updatePlayerLocation(
// 			board, nextTile!, nextTileUp!, playerRight
// 		)!;

// 		/// player was removed from origin chunk
// 		const updatedPrev = updatedBoard.getChunk(15)?.getTile(15);			
// 		const updatedNext = updatedBoard
// 		.getChunk(nextTileUp?.chunk)
// 			?.getTile(nextTileUp?.tile);

// 		expect(updatedPrev?.state).not.toContainEqual(playerRight)
// 		expect(updatedNext?.state).toContainEqual(playerRight)
// 		expect(player.location).toStrictEqual({ 
// 			chunk: 15, 
// 			tile: 16
// 		});
// 	})
// })

// describe('Get Next Tile', () => {
// 	/// origin chunk { chunk: 15, tile: 15 }
// 	// const originTile = new Tile({x: 3, y: 2 }, originSquare)
// 	test.concurrent('Get next tile up', () => {
// 		const player = defaultPlayer();
// 		const nextTileUp = player.getNextTile(playerUp, player);
// 		expect(nextTileUp).toStrictEqual({ chunk: 15, tile: 9 })
// 	});
// 	test.concurrent('Get next tile down', () => {
// 		const player = defaultPlayer();
// 		const nextTileDown = player.getNextTile(playerDown, player);
// 		expect(nextTileDown).toStrictEqual({ chunk: 15, tile: 21 })
// 	});
// 	test.concurrent('Get next tile left', () => {
// 		const player = defaultPlayer();
// 		const nextTileLeft = player.getNextTile(playerLeft, player);
// 		expect(nextTileLeft).toStrictEqual({ chunk: 15, tile: 14 })
// 	});
// 	test.concurrent('Get next tile right', () => {
// 		const player = defaultPlayer();
// 		const nextTileRight = player.getNextTile(playerRight, player);
// 		expect(nextTileRight).toStrictEqual({ chunk: 15, tile: 16 })
// 	});

// 	/// origin chunk { chunk: 15, tile: 15 }
// 	describe('getTile in next chunk up', () => {
// 		test('column 0', () => {
// 			const player = defaultPlayer();
// 			player.location = { chunk:15, tile:0 };
// 			const nextTileUp = player.getNextTile(playerUp, player);
// 			expect(nextTileUp).toStrictEqual({ chunk: 9, tile: 18 })
// 		});
// 		test('column 1', () => {
// 			const player = defaultPlayer();
// 			player.location = { chunk:15, tile:1 };
// 			const nextTileUp = player.getNextTile(playerUp, player);
// 			expect(nextTileUp).toStrictEqual({ chunk: 9, tile: 19 })
// 		});
// 		test('column 2', () => {
// 			const player = defaultPlayer();
// 			player.location = { chunk:15, tile:2 };
// 			const nextTileUp = player.getNextTile(playerUp, player);
// 			expect(nextTileUp).toStrictEqual({ chunk: 9, tile: 20 })
// 		});
// 		test('column 3', () => {
// 			const player = defaultPlayer();
// 			player.location = { chunk:15, tile:3 };
// 			const nextTileUp = player.getNextTile(playerUp, player);
// 			expect(nextTileUp).toStrictEqual({ chunk: 9, tile: 21 })
// 		});
// 		test('column 4', () => {
// 			const player = defaultPlayer();
// 			player.location = { chunk:15, tile:4 };
// 			const nextTileUp = player.getNextTile(playerUp, player);
// 			expect(nextTileUp).toStrictEqual({ chunk: 9, tile: 22 })
// 		});
// 		test('column 5', () => {
// 			const player = defaultPlayer();
// 			player.location = { chunk:15, tile:5 };
// 			const nextTileUp = player.getNextTile(playerUp, player);
// 			expect(nextTileUp).toStrictEqual({ chunk: 9, tile: 23 })
// 		});
// 		test.skip('stay within map boundary', ()=> { })
// 	})
// 	describe('getTile in next chunk down', () => {
// 		test('column 0', () => {
// 			const player = defaultPlayer();
// 			player.location = { chunk:15, tile:18 };
// 			const nextTileUp = player.getNextTile(playerDown, player);
// 			expect(nextTileUp).toStrictEqual({ chunk: 21, tile: 0 })
// 		});
// 		test('column 1', () => {
// 			const player = defaultPlayer();
// 			player.location = { chunk:15, tile:19 };
// 			const nextTileDown = player.getNextTile(playerDown,player);
// 			expect(nextTileDown).toStrictEqual({ chunk: 21, tile: 1 })
// 		});
// 		test('column 2', () => {
// 			const player = defaultPlayer();
// 			player.location = { chunk:15, tile:20 };
// 			const nextTileDown = player.getNextTile(playerDown,player);
// 			expect(nextTileDown).toStrictEqual({ chunk: 21, tile: 2 })
// 		});
// 		test('column 3', () => {
// 			const player = defaultPlayer();
// 			player.location = { chunk:15, tile:21 };
// 			const nextTileDown = player.getNextTile(playerDown,player);
// 			expect(nextTileDown).toStrictEqual({ chunk: 21, tile: 3 })
// 		});
// 		test('column 4', () => {
// 			const player = defaultPlayer();
// 			player.location = { chunk:15, tile:22 };
// 			const nextTileDown = player.getNextTile(playerDown,player);
// 			expect(nextTileDown).toStrictEqual({ chunk: 21, tile: 4 })
// 		});
// 		test('column 5', () => {
// 			const player = defaultPlayer();
// 			player.location = { chunk:15, tile:23 };
// 			const nextTileDown = player.getNextTile(playerDown,player);
// 			expect(nextTileDown).toStrictEqual({ chunk: 21, tile: 5 })
// 		});
// 		test.skip('stay within map boundary', ()=> { })
// 	})
// 	describe('getTile in next chunk left', () => {
// 		test('row 0', () => {			
// 			const player = defaultPlayer();
// 			player.location = { chunk:15, tile:0 };
// 			const nextTileLeft = player.getNextTile(playerLeft,player);
// 			expect(nextTileLeft).toStrictEqual({ chunk: 14, tile: 5 })
// 		})
// 		test('row 1', () => {
// 			const player = defaultPlayer();
// 			player.location = { chunk:15, tile:6 };
// 			const nextTileLeft = player.getNextTile(playerLeft,player);
// 			expect(nextTileLeft).toStrictEqual({ chunk: 14, tile: 11 })
// 		});
// 		test('row 2', () => {
// 			const player = defaultPlayer();
// 			player.location = { chunk:15, tile:12 };
// 			const nextTileLeft = player.getNextTile(playerLeft,player);
// 			expect(nextTileLeft).toStrictEqual({ chunk: 14, tile: 17 })
// 		});
// 		test('row 3', () => {
// 			const player = defaultPlayer();
// 			player.location = { chunk:15, tile:18 };
// 			const nextTileLeft = player.getNextTile(playerLeft,player);
// 			expect(nextTileLeft).toStrictEqual({ chunk: 14, tile: 23 })
// 		});

// 		test.skip('stay within map boundary', ()=> { })
// 	})
// 	describe('getTile in next chunk right', () => {
// 		test('row 0', () => {			
// 			const player = defaultPlayer();
// 			player.location = { chunk:15, tile:5 };
// 			const nextTileRight = player.getNextTile(playerRight, player);
// 			expect(nextTileRight).toStrictEqual({ chunk: 16, tile: 0 })
// 		});
// 		test('row 1', () => {
// 			const player = defaultPlayer();
// 			player.location = { chunk:15, tile:11 };
// 			const nextTileRight = player.getNextTile(playerRight, player);
// 			expect(nextTileRight).toStrictEqual({ chunk: 16, tile: 6 })
// 		});
// 		test('row 2', () => {
// 			const player = defaultPlayer();
// 			player.location = { chunk:15, tile:17 };
// 			const nextTileRight = player.getNextTile(playerRight, player);
// 			expect(nextTileRight).toStrictEqual({ chunk: 16, tile: 12 })
// 		});
// 		test('row 3', () => {
// 			const player = defaultPlayer();
// 			player.location = { chunk:15, tile:23 };
// 			const nextTileRight = player.getNextTile(playerRight, player);
// 			expect(nextTileRight).toStrictEqual({ chunk: 16, tile: 18 })
// 		});
// 		test.skip('stay within map boundary', ()=> { })
// 	})
// });

// describe('handleMove', () => { 

// 	/// mock handler
// 	const setBoardRef = (ref:Board|null) => { board = ref! };
// 	const mockBoardRef = vi.fn().mockImplementation(setBoardRef);

// 	/// origin chunk { chunk: 15, tile: 15 }
// 	let board: Board;
// 	let player: Character;
// 	beforeEach(
// 		async()=>{
// 			board = new Board();
// 			await board.initialize();
// 			player = new Player(canvas!);
// 			vi.restoreAllMocks();
// 		});

// 	test('move up', () => {
// 		player.handleMove(board, playerUp, mockBoardRef);
// 		expect(false).toBeTruthy()
// 	})

// 	test('move down', () => {
// 		player.handleMove(board, playerDown, mockBoardRef);
// 		expect(false).toBeTruthy()
// 	})

// 	test('move left', () => {
// 		player.handleMove(board, playerLeft, mockBoardRef);
// 		expect(false).toBeTruthy()
// 	})

// 	test('move right', () => {
// 		player.handleMove(board, playerRight, mockBoardRef);
// 		expect(false).toBeTruthy()
// 	})
// })