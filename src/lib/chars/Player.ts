import type { BoardLocation, PlayerDirection, PlayerLocation, RenderStateOne, RenderStateTwo } from '@/types'
import { 
	chunkHeight, chunkWidth, 
	originChunk, originSquare, 
} from "@/constants/board";
import { renderStateOne } from '@/constants/canvas';
import RenderEngine from '@/lib/render/RenderEngine';
import Tile from '../map/Tile';
import Chunk from '../map/Chunk';
import { gameSquare } from '@/constants/sprites';
import { playerDown, playerLeft, playerRight, playerUp } from '@/constants/input';
import Controller from '../input/Controller';

export default class Player {

	/// location in board state
	location: BoardLocation	;
	
	/// current player direction when not moving,
	/// prev player direction when handling input event
	direction: PlayerDirection;

	canvas: HTMLCanvasElement;
	/// location where image is drawn on screen
	canvasX: number;
	canvasY: number;

	constructor(
		playerCanvas:HTMLCanvasElement
	){
		this.canvas = playerCanvas
		this.direction = playerDown; /// paired with initial state set in board during initialization

		this.location = {
			chunk: originChunk,
			tile: originSquare
		};

		/// set default coords to render player to canvas
		const chunk = Chunk.indexToCoords(originChunk);
		const tile = Tile.indexToCoords(originSquare);
		this.canvasX = 
			chunk.x * chunkWidth * gameSquare + 
			tile.x * gameSquare;
		this.canvasY = 
			chunk.y * chunkHeight * gameSquare + 
			tile.y * gameSquare;

		/// draw newly created player
		this.draw(renderStateOne);
	}

    /// this is only called once movement has been validated
    async move(
		nextTileLoc: PlayerLocation,
    ){	
		this.location = {
			chunk: nextTileLoc.chunk,
			tile:nextTileLoc.tile
		}

		/// update canvas		
		switch(this.direction){
			case playerUp:
				await Controller.moveUp(this);
				break;
			case playerDown:
				await Controller.moveDown(this);
				break;			
			case playerRight:
				await Controller.moveRight(this);
				break;			
			case playerLeft:
				await Controller.moveLeft(this);
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
	async draw(renderState: RenderStateOne|RenderStateTwo){

		const sprite = RenderEngine.getSprite(this.direction);
		if(!sprite) return;

		const playerContext = this.canvas.getContext('2d');
		console.log('draw player', this.canvas)
		if(!playerContext) return;
		
		const tileImage = new Image();
		tileImage.src = sprite.src;

		tileImage.onload = (() => {
			/// erase last drawn player sprite before drawing next
			playerContext.clearRect(0, 0, playerContext.canvas.width, playerContext.canvas.height)
		
			/// get square of sprite sheet to be drawn
			const frameCoords = sprite.frames[renderState];
			if(!frameCoords) return;
			return playerContext.drawImage(tileImage,
				frameCoords.x, frameCoords.y, gameSquare, gameSquare, /// section of sprite sheet
				this.canvasX*2, this.canvasY*2, // location on canvas
				gameSquare*2, gameSquare*2 /// area on canvas
			);
		});
	}
}