import { chunkHeight, chunkWidth } from "@/constants/board";
import type { BoardLocation, EnemyDirection, RenderStateOne, RenderStateTwo } from "@/types";
import Chunk from "@/lib/map/Chunk";
import Tile from "@/lib/map/Tile";
import { gameSquare } from "@/constants/sprites";
import RenderEngine from "@/lib/render/RenderEngine";
import { renderStateOne } from "@/constants/canvas";
import { enemyDown, enemyLeft, enemyRight, enemyUp } from "@/constants/zod/input";
import Controller from "@/lib/input/Controller";

export default class Enemy {
	/// location in board state
	location: BoardLocation;

	/// current enemy direction
	direction: EnemyDirection;

	canvas: HTMLCanvasElement;

	/// location where image is drawn on screen
	canvasX: number;
	canvasY: number;

	/// create enemies when initializing board
	constructor(
		enemyCanvas: HTMLCanvasElement,
		enemyDirection: EnemyDirection,
		location: BoardLocation,
	){
		this.canvas = enemyCanvas;
		this.location = location;
		this.direction = enemyDirection;

		// console.log('enemy - enemyDirection', enemyDirection)
		const chunk = Chunk.indexToCoords(location.chunk)
		const tile = Tile.indexToCoords(location.tile);
		this.canvasX = 
			chunk.x * chunkWidth * gameSquare 
			+ tile.x * gameSquare;
		this.canvasY = 
			chunk.y * chunkHeight * gameSquare 
			+ tile.y * gameSquare;

		/// draw new enemy
		this.draw(renderStateOne);
	}

    /// this is only called once movement has been validated
    move(
		nextTileLoc: BoardLocation,
    ){
		this.location = {
			chunk: nextTileLoc.chunk,
			tile:nextTileLoc.tile
		}

		switch(this.direction){
			case enemyUp:
				Controller.moveUp(this);
				break;		
			case enemyDown:
				Controller.moveDown(this);
				break;			
			case enemyRight:
				Controller.moveRight(this);
				break;			
			case enemyLeft:
				Controller.moveLeft(this);
				break;
			default:
				break;
		}
    }

	/**
	 * Since location is stored in PLAYER Class, 
	 * 	no need to filter over every tile in game
	 * 	 just target that tile directly
	 */
	draw(renderState: RenderStateOne|RenderStateTwo){
		const sprite = RenderEngine.getSprite(this.direction);
		if(!sprite) return;
		
		const enemyContext = this.canvas.getContext('2d');
		if(!enemyContext) return;
		enemyContext?.clearRect(0,0,this.canvas.width, this.canvas.height)

		const tileImage = new Image();
		tileImage.src = sprite.src;

		tileImage.onload = (()=> {

			/// get square of sprite sheet to be drawn
			const frameCoords = sprite.frames[renderState];
			if(!frameCoords) return;
			return enemyContext.drawImage(tileImage,
				frameCoords.x, frameCoords.y, gameSquare, gameSquare, /// section of sprite sheet
				this.canvasX*2, this.canvasY*2, // location on canvas
				gameSquare*2, gameSquare*2 /// area on canvas
			);
		});
	}
}