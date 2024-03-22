import { describe, test, expect } from 'vitest';
import Tile from "@/lib/map/Tile";
import { field, forest, ground, rockOne, rockThree, rockTwo, terrainTypes, treasureOne, treeOne, treeTwo } from '@/constants/sprites';
import { obstacleSquares, defaultPlayerSq } from '@/constants/board';
import { enemyLeft, playerDown, playerUp } from '@/constants/input';

export const defaultCoords = { x: 0, y: 0 }

test('tileIndexToCoords', () => {

	/// origin tile 
	expect(Tile.indexToCoords(15)).toStrictEqual({ x: 3, y: 2 })

	/// row 1
	expect(Tile.indexToCoords(0)).toStrictEqual({ x: 0, y:0 })
	expect(Tile.indexToCoords(1)).toStrictEqual({ x: 1, y:0 })
	expect(Tile.indexToCoords(2)).toStrictEqual({ x: 2, y:0 })
	expect(Tile.indexToCoords(3)).toStrictEqual({ x: 3, y:0 })
	expect(Tile.indexToCoords(4)).toStrictEqual({ x: 4, y:0 })
	expect(Tile.indexToCoords(5)).toStrictEqual({ x: 5, y:0 })

	/// row 2
	expect(Tile.indexToCoords(6)).toStrictEqual({ x: 0, y: 1 })
	expect(Tile.indexToCoords(7)).toStrictEqual({ x: 1, y: 1 })
	expect(Tile.indexToCoords(8)).toStrictEqual({ x: 2, y: 1 })
	expect(Tile.indexToCoords(9)).toStrictEqual({ x: 3, y: 1 })
	expect(Tile.indexToCoords(10)).toStrictEqual({ x: 4, y: 1 })
	expect(Tile.indexToCoords(11)).toStrictEqual({ x: 5, y: 1 })
});


describe('setTerrain', async() => {

	test('create forest terrain tile', async() => {
		const tile = new Tile(defaultCoords, 0);
		expect(tile.state.some((val) => terrainTypes.includes(val))).toBeFalsy()
		await tile.initialize(forest);
		// console.log('tile.state[0]', tile.state[0])
		/// 'Forest0'.. 'Forest1'..
		expect(tile.state[0]?.includes(forest)).toBeTruthy();
		expect(tile.state[0]?.includes(ground)).toBeFalsy();
		expect(tile.state[0]?.includes(field)).toBeFalsy();
	})
	test('create ground terrain tile', async() => {
		const tile = new Tile(defaultCoords, 0);
		expect(tile.state.some((val) => terrainTypes.includes(val))).toBeFalsy()
		await tile.initialize(ground);
		expect(tile.state[0]?.includes(ground)).toBeTruthy();
		expect(tile.state[0]?.includes(forest)).toBeFalsy();
		expect(tile.state[0]?.includes(field)).toBeFalsy();
	})
	test('create field terrain tile', async() => {
		const tile = new Tile(defaultCoords, 0);
		expect(tile.state.some((val) => terrainTypes.includes(val))).toBeFalsy()
		await tile.initialize(field);
		expect(tile.state[0]?.includes(field)).toBeTruthy();
		expect(tile.state[0]?.includes(forest)).toBeFalsy();
		expect(tile.state[0]?.includes(ground)).toBeFalsy();
	})
})

describe('addState', () => {

	test('player', () => {
		const tile = new Tile(defaultCoords, 0);
		tile.addState(playerUp);
		expect(tile.hasState('player')).toBeTruthy();
	})
	test('enemy', () => {
		const tile = new Tile(defaultCoords, 0);
		tile.addState(enemyLeft);
		expect(tile.hasState('enemy')).toBeTruthy();
	})
	test('treasure', () => {
		const tile = new Tile(defaultCoords, 0);
		tile.addState(treasureOne);
		expect(tile.hasState('Treasure')).toBeTruthy();
		expect(tile.hasState('Tree')).not.toBeTruthy(); // random test of func
	})
	test('rock', () => {
		const tile = new Tile(defaultCoords, 0);
		tile.addState(rockOne);
		expect(tile.hasState('Rock')).toBeTruthy();
		expect(tile.hasState('Player')).not.toBeTruthy(); // random test of func
	})
	test('tree', () => {
		const tile = new Tile(defaultCoords, 0);
		tile.addState(treeOne);
		expect(tile.hasState('Tree')).toBeTruthy();
		expect(tile.hasState('Rock')).not.toBeTruthy(); // random test of func
	})
})

describe('removeState', () => {
	
	test('modify state with tree', ()=> {
		const tile = new Tile(defaultCoords, 0);
		const unmodified = tile.state;
		tile.addState(treeOne);


		tile.removeState(treeTwo);
		expect(tile.state).toEqual(unmodified); /// treeTwo !== treeOne,
		tile.removeState(treeOne);
		expect(tile.state).not.toEqual(unmodified);
	});

	test('modify state with player', ()=> {
		const tile = new Tile(defaultCoords, 0);
		const unmodified = tile.state;
		tile.addState(playerUp);


		tile.removeState(playerDown);
		expect(tile.state).toEqual(unmodified); /// playerDown !== playerUP,
		tile.removeState(playerUp);
		expect(tile.state).not.toEqual(unmodified);
	});
});