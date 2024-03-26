import type { EnemyDirection, PlayerDirection } from "@/types";
import type Enemy from "../chars/Enemy";
import type Player from "../chars/Player";
import { enemyDown, enemyLeft, enemyRight, enemyUp, playerDown, playerLeft, playerRight, playerUp } from "@/constants/zod/input";
import Chunk from "../map/Chunk";
import Tile from "../map/Tile";
import { boardWidth, bottomChunkBoundary, bottomMapBoundary, chunkWidth, lastTileIndex, rightChunkBoundary, rightMapBoundary } from "@/constants/board";
import { renderStateOne, renderStateTwo } from "@/constants/canvas";
import { gameSquare } from "@/constants/sprites";

/**
 * This class handles movement for player and enemies
 * 	:: for player, movement is triggered by input listener in ControllerContext,
 *  :: for enemies, movement is triggered by internal game loop, 
 */
export default class Controller {

    /** 
	 * Handlers for all character movement 
	 * */
	static moveUp(char: Player|Enemy){
		/// to move up, decrement values closer to 0
		char.canvasY -= gameSquare/2
		char.draw(renderStateTwo) /// begin move
		setTimeout(() => {
			char.canvasY -= gameSquare/2
			char.draw(renderStateOne) /// finish move
		}, 100);
	}
	static moveDown(char: Player|Enemy){
		/// to move down, decrement values closer to canvasHeight
		char.canvasY += gameSquare/2
		 char.draw(renderStateTwo) /// begin move
		setTimeout(()=> {
			char.canvasY += gameSquare/2
			char.draw(renderStateOne) /// finish move
		}, 100);
	}
	static moveLeft(char: Player|Enemy){
		char.canvasX -= gameSquare/2
		char.draw(renderStateTwo) /// begin move
		setTimeout(()=> {
			char.canvasX -= gameSquare/2
			char.draw(renderStateOne) /// finish move
		}, 100);
	}
	static moveRight(char: Player|Enemy){
		char.canvasX += gameSquare/2
		char.draw(renderStateTwo) /// begin move
		setTimeout(()=> {
			char.canvasX += gameSquare/2
			char.draw(renderStateOne) /// finish move
		}, 100);
	}

	/// get the chars's current tile, based on chars' direction, 
	//// return the location of next chunk/tile char will land in,
    static getNextTile(
		char: Player|Enemy,
		direction: PlayerDirection|EnemyDirection
    ){	

		const chunk = Chunk.indexToCoords(char.location.chunk)
		// console.log('getNextTile - chunk', chunk)
		const tile = Tile.indexToCoords(char.location.tile)
		// console.log('getNextTile - tile', tile)

		/// if tile coords are within chunk boundaries, 
		/// motion is within chunk. Only modify this.location.tile
		switch(direction){
			case playerUp:
			case enemyUp:
				/// player will land in next chunk up
				if(tile.y === 0){
					if(chunk.y === 0) return; /// player already in top chunk

					/** 
					 * move player from x1 to x2
					 * [
					 * 	[],[x2],[],[],[]	{chunk2}
					 * ______________________
					 * 	[],[x1],[],[],[]	{chunk1}
					 * ]
					 * 
					 */

					/// subtract one width of map to place player in next chunk higher
					return {
						chunk: char.location.chunk - boardWidth,
						tile: lastTileIndex - rightChunkBoundary + tile.x
					}
				}

				/// player will land in chunk
				/// add exactly one row from current tileIndex to get tile directly above
				else {
					return {
						chunk: char.location.chunk,
						tile: char.location.tile - chunkWidth
					}
				}

			case playerDown:
			case enemyDown:
				
				/// player will land in next chunk down
				if(tile.y === bottomChunkBoundary){
					if(chunk.y === bottomMapBoundary) return; /// already in bottom-most chunk

					return {
						/// add one width of map to place player in next chunk higher
						chunk: char.location.chunk + boardWidth,

						/// player definitely in first row fo new chunk
						// new coords will be { x:?, y:0 }
						tile: tile.x
					}
				}

				/// player will land in chunk dont modify chunk vals
				else {
					return {
						chunk: char.location.chunk,
						/// add one row width to current tile index
						tile: char.location.tile + chunkWidth
					}
				}

			case playerLeft:
			case enemyLeft:

				/// player will land in next chunk left
				if(tile.x === 0){
					if(chunk.x === 0) return; /// already in left-most chunk
					return {
						chunk: char.location.chunk - 1, /// one chunk left

						/// player definitely in right column of new chunk
							/// leftMost === 0 + 5 === right most row0
							/// leftMost === 6 + 5 === right most row1
							/// leftMost === 12 + 5 === right most row2
						tile: char.location.tile + 5
					}
				}

				/// player will land in chunk dont modify chunk vals
				else {
					return {
						chunk: char.location.chunk,
						tile: char.location.tile-1 /// one tile left 
					}
				}

			case playerRight:
			case enemyRight:

				/// player will land in next chunk right
				if(tile.x === rightChunkBoundary){
					/// already in right-most chunk
					if(chunk.x === rightMapBoundary) return; 

					return {
						chunk: char.location.chunk + 1, /// one chunk right	
						/// player definitely in left column of new chunk
							/// rightMost === 5 - 5 === right most row0
							/// rightMost === 11 - 5 === right most row1
							/// rightMost === 16 - 5 === right most row2
						tile: char.location.tile - 5
					}
				}

				/// player will land in chunk dont modify chunk vals
				else {
					return {
						chunk: char.location.chunk,
						tile: char.location.tile+1 /// one tile left 
					}
				}

			default:
				throw new Error('invalid direction')
		}
    }
}