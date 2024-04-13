import { boardWidth, chunkLength } from "@/constants/board";
import type { Coordinates, TerrainNames, TileDimensions } from "@/types";
import Tile from "@/lib/map/Tile";
import { terrainTypes } from "@/constants/sprites";

export default class Chunk {
	
	terrain: TerrainNames
	coords: Coordinates
	tiles: Tile[] /// this is the floor plan of the cunk

	constructor(
		chunkIndex:number,
		tileDimensions: TileDimensions
	){
		/// select random terrain from terrain array		
		this.terrain = terrainTypes[Math.floor( Math.random()**2 * terrainTypes.length )]!;
		this.coords = Chunk.indexToCoords(chunkIndex);
		
		/// create && add tiles to array of all Tiles to store in chunk
		this.tiles = Array.from({ length: chunkLength }, (_, index) => {
			return new Tile(this.terrain, this.coords, index, tileDimensions);
		});
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