import type { BoardLocation, EnemyDirection, PlayerDirection, Enemy, Player, Coordinates } from "@/types";

import { gameSquare } from "@/constants/sprites";
import { renderStateOne, renderStateTwo } from "@/constants/canvas";
import { boardWidth, bottomChunkBoundary, bottomMapBoundary, chunkWidth, lastTileIndex, rightChunkBoundary, rightMapBoundary } from "@/constants/board";
import { 
	enemyDown, enemyLeft, enemyRight, enemyUp, 
	playerDown, playerLeft, playerRight, playerUp 
} from "@/constants/zod/input";

import RenderEngine from "@/lib/render/RenderEngine";
import Chunk from "@/lib/map/Chunk";
import Tile from "@/lib/map/Tile";

export default class Character {

	id: number; /// this is used with direction to place characters in tile state
	charType: Enemy | Player;
	direction: EnemyDirection|PlayerDirection; /// current enemy direction

	/// location in board state
	location: BoardLocation;


	/// location where image is drawn on screen
	canvasX: number;
	canvasY: number;

	/// total width of global canvas, ref passed down from global state
	canvasWidth: number;
	canvasHeight: number;

	/// create enemies when initializing board
	constructor(
		id:number,
		charType: Enemy|Player,
		direction: EnemyDirection|PlayerDirection,
		location: BoardLocation,
		canvas: HTMLCanvasElement,
		canvasWidth: number,
		canvasHeight: number,
	){
		this.id = id;
		this.charType = charType;
		this.location = location;
		this.direction = direction;

		this.canvasWidth = canvasWidth;
		this.canvasHeight = canvasHeight;

		// console.log('enemy - enemyDirection', enemyDirection)
		const chunk = Chunk.indexToCoords(location.chunk)
		const tile = Tile.indexToCoords(location.tile);

		this.canvasX = RenderEngine.getCanvasX(chunk.x, tile.x);
		this.canvasY = RenderEngine.getCanvasY(chunk.y, tile.y);

		/// [== spawn ==] draw character
		RenderEngine.drawSprite(
			canvas, 
			renderStateOne, 
			RenderEngine.getSprite(this.direction),
			{ canvasX: this.canvasX, canvasY: this.canvasY }
		);
	}

	/// this is only called once movement has been validated
    move(
    	/// individual types could be created for canvases
    		/// PlayerCanvas = ... with playerCanvas.id set unique to differentiate
		canvas: HTMLCanvasElement, /// enemy canvas || player canvas
    	nextTileLoc: BoardLocation
    ){
		this.location = {
			chunk: nextTileLoc.chunk,
			tile: nextTileLoc.tile
		}

		switch(this.direction){
			case enemyUp:
			case playerUp:
				this.playYMove(canvas, -gameSquare); // increment down to 0 at top of screen
				break;
			case enemyDown:
			case playerDown:
				this.playYMove(canvas, gameSquare);
				break;
			case enemyLeft:
			case playerLeft:
				this.playXMove(canvas, -gameSquare); // increment down to 0 at left of screen
				break;
			case enemyRight:
			case playerRight:
				this.playXMove(canvas, gameSquare);
				break;
			default:
				break;
		}    
	}

	/// get the chars's current tile, based on chars' direction, 
	//// return the location of next chunk/tile char will land in,
    getNextTile(direction: PlayerDirection|EnemyDirection){
		const chunk = Chunk.indexToCoords(this.location.chunk)
		// console.log('getNextTile - chunk', chunk)
		const tile = Tile.indexToCoords(this.location.tile)
		// console.log('getNextTile - tile', tile)

		/// if tile coords are within chunk boundaries, 
		/// motion is within chunk. Only modify this.location.tile
		switch(direction){
			case playerUp:
			case enemyUp:
				return this.getTileUp(chunk, tile)
			case playerDown:
			case enemyDown:
				return this.getTileDown(chunk, tile);
			case playerLeft:
			case enemyLeft:
				return this.getTileLeft(chunk, tile)
			case playerRight:
			case enemyRight:
				return this.getTileRight(chunk, tile)
			default:
				throw new Error('invalid direction')
		}
    }

    getTileUp(
    	chunk:Coordinates,
    	tile: Coordinates,
    ){
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
				chunk: this.location.chunk - boardWidth,
				tile: lastTileIndex - rightChunkBoundary + tile.x
			}
		}

		/// player will land in chunk
		/// add exactly one row from current tileIndex to get tile directly above
		else {
			return {
				chunk: this.location.chunk,
				tile: this.location.tile - chunkWidth
			}
		}
	}

	getTileDown(
		chunk:Coordinates,
    	tile: Coordinates,
    ){
		/// player will land in next chunk down
		if(tile.y === bottomChunkBoundary){
			if(chunk.y === bottomMapBoundary) return; /// already in bottom-most chunk

			return {
				/// add one width of map to place player in next chunk higher
				chunk: this.location.chunk + boardWidth,

				/// player definitely in first row fo new chunk
				// new coords will be { x:?, y:0 }
				tile: tile.x
			}
		}

		/// player will land in chunk dont modify chunk vals
		else {
			return {
				chunk: this.location.chunk,
				/// add one row width to current tile index
				tile: this.location.tile + chunkWidth
			}
		}
	}

	getTileLeft(
		chunk:Coordinates,
    	tile: Coordinates,
    ){
		/// player will land in next chunk left
		if(tile.x === 0){
			if(chunk.x === 0) return; /// already in left-most chunk
			return {
				chunk: this.location.chunk - 1, /// one chunk left

				/// player definitely in right column of new chunk
					/// leftMost === 0 + 5 === right most row0
					/// leftMost === 6 + 5 === right most row1
					/// leftMost === 12 + 5 === right most row2
				tile: this.location.tile + 5
			}
		}

		/// player will land in chunk dont modify chunk vals
		else {
			return {
				chunk: this.location.chunk,
				tile: this.location.tile-1 /// one tile left 
			}
		}
	}

	getTileRight(
		chunk:Coordinates,
    	tile: Coordinates,
    ){
		/// player will land in next chunk right
		if(tile.x === rightChunkBoundary){
			/// already in right-most chunk
			if(chunk.x === rightMapBoundary) return; 

			return {
				chunk: this.location.chunk + 1, /// one chunk right	
				/// player definitely in left column of new chunk
					/// rightMost === 5 - 5 === right most row0
					/// rightMost === 11 - 5 === right most row1
					/// rightMost === 16 - 5 === right most row2
				tile: this.location.tile - 5
			}
		}

		/// player will land in chunk dont modify chunk vals
		else {
			return {
				chunk: this.location.chunk,
				tile: this.location.tile+1 /// one tile left 
			}
		}
	}


	/// update sprite to face direction, but do not move 
    playDirectionChange(canvas:HTMLCanvasElement){ 
		/// this slight delay is used to introduce 
		 /// a stagger frame to produce an animation effect
		RenderEngine.drawSprite(
			canvas, 
			renderStateTwo, 
			RenderEngine.getSprite(this.direction),
			{ canvasX: this.canvasX, canvasY: this.canvasY }
		) /// begin move
		setTimeout(()=> {
			RenderEngine.drawSprite(
				canvas, 
				renderStateOne,
				RenderEngine.getSprite(this.direction),
				{ canvasX: this.canvasX, canvasY: this.canvasY }
		) /// finish move
		}, 100);
    }
	/** 
	 * Handlers for all character movement 
	 * Both Player Char && Enemies
	 * 
	 * TODO::: modify these methods to include prev {canvasX/canvasY} to clear as 
	 * 	/// new character is being drawn? this will smoothe out animation, less choppy
	 * */
    playXMove(
		canvas:HTMLCanvasElement,
   		distance: number /// positive for right, negative for left
   	){
		const prevX1 = this.canvasX; /// place on canvas before movement 'where to clear'
		this.canvasX += distance/2;
		RenderEngine.drawSprite(
			canvas, 
			renderStateTwo,
			RenderEngine.getSprite(this.direction),
			{ canvasX: this.canvasX, canvasY: this.canvasY },
			{ canvasX: prevX1, canvasY: this.canvasY },
		) /// start move
		
		setTimeout(() => {
			const prevX2 = this.canvasX; /// place on canvas before movement 'where to clear'
			this.canvasX += distance/2;
			RenderEngine.drawSprite(
				canvas, 
				renderStateOne, 
				RenderEngine.getSprite(this.direction),
				{ canvasX: this.canvasX, canvasY: this.canvasY },
				{ canvasX: prevX2, canvasY: this.canvasY },
			) /// finish move
		}, 100);
    }
    playYMove(
		canvas:HTMLCanvasElement,
   		distance: number /// positive for up, negative for down
    ){
		const prevY1 = this.canvasY;
		this.canvasY += distance/2; /// place on canvas before movement 'where to clear'
		RenderEngine.drawSprite(
			canvas, 
			renderStateTwo, 
			RenderEngine.getSprite(this.direction),
			{ canvasX: this.canvasX, canvasY: this.canvasY },
			{ canvasX: this.canvasX, canvasY: prevY1 },
		) /// start move

		setTimeout(() => {
			const prevY2 = this.canvasY; /// place on canvas before movement 'where to clear'
			this.canvasY += distance/2;
			RenderEngine.drawSprite(
			canvas, 
			renderStateOne,
			RenderEngine.getSprite(this.direction),
			{ canvasX: this.canvasX, canvasY: this.canvasY },
			{ canvasX: this.canvasX, canvasY: prevY2 },
			) /// finish move
		}, 100);
    }
}