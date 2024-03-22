import { boardWidth, chunkLength } from "@/constants/board";
import { Coordinates, TerrainNames } from "@/types";
import Tile from "@/lib/map/Tile";
import { terrainTypes } from "@/constants/sprites";

export default class Chunk {
	
	terrain: TerrainNames
	coords: Coordinates
	tiles: Tile[] /// this is the floor plan of the cunk

	constructor(chunkIndex:number){
		/// select random terrain from terrain array		
		this.terrain = terrainTypes[Math.floor( Math.random()**2 * terrainTypes.length )]!;
		this.coords = Chunk.indexToCoords(chunkIndex);
		this.tiles = [];
	}

	/**
	 * This function executes loop to generate all games 
	 * 	tiles for a single chunk
	 */
	async initialize(){
		/// generate all tiles for single chunk
		const promises = Array.from({ length: chunkLength }, async (_, index) => {
			const tile = new Tile(this.coords, index);
			return await tile.initialize(this.terrain);
			/// add tile to array of all Tiles to store in chunk
		});

		this.tiles = await Promise.all(promises); /// set tiles this class store

		return this; /// pass chunk ref back to parent board
	}

	getTile(tileIndex:number|undefined){
		if(tileIndex !== 0 && !tileIndex) return;
		if(tileIndex > this.tiles.length - 1) throw new Error('out of index')
		return this.tiles[tileIndex];
	}

	static indexToCoords(chunkIndex:number){
		return {
			y: Math.floor(chunkIndex / boardWidth), // Calculate chunk row
			x: chunkIndex % boardWidth, // Calculate chunk column
		};
	}
}