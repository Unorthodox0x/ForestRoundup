import { chunkWidth } from "@/constants/board";
import type { AllSprites, Coordinates, TerrainNames, TileDimensions, TileState } from "@/types";
import RenderEngine from "../render/RenderEngine";

export default class Tile {
	
	chunk: Coordinates; /// which chunk does this belong to ?? 'metadata'
	coords: Coordinates;
	canvasX: number;
	canvasY: number;
	state:  TileState[]; /// forest1 + p + t + ..

	static indexToCoords(tileIndex:number){
		return {
			y: Math.floor(tileIndex / chunkWidth), // Calculate the row index
			x: tileIndex % chunkWidth, // Calculate the column index
		}
	}

	constructor(
		terrain: TerrainNames, /// parent chunk's terrain
		parent: Coordinates,
		tileIndex: number,
		spriteAnimationFrames: AllSprites,
		tileDimensions: TileDimensions,
	){
		this.chunk = parent;
		this.coords = Tile.indexToCoords(tileIndex);

		this.canvasX = RenderEngine.getCanvasX(
			{chunk: this.chunk.x, tile: this.coords.x},
			tileDimensions,
		)
		this.canvasY = RenderEngine.getCanvasY(
			{chunk: this.chunk.y, tile: this.coords.y},
			tileDimensions,
		)
		/// pick a random terrain from terrainTypes 
		/// &&
		/// a random number 1-10, higher likelyhood of lower numbers
		/// where there are 10 tiles for each terrain type
		const terrainSpriteIndex = Math.floor((Math.random() ** 2) * 10);
		const spriteName = spriteAnimationFrames[terrain][terrainSpriteIndex]!.spriteName;

		this.state = [spriteName];
	}
	
	clearState(){ this.state = []; }
	
	/// 
	addState(state: TileState){
		this.state.push(state);
	}

	/// remove a single value from tile's state
	/// ex player movement
	/// must remove player from the state of the prev tile
	removeState(prevState: TileState){
		this.state = this.state.filter(state => state !== prevState);
	}

	hasState(state:string){ /// rockOne||rockTwo||rockTree contain 'Rock'
		return this.state.some((value)=> value.includes(state));
	}
}