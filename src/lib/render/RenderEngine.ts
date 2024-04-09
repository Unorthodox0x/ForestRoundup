import type { 
	RenderStateOne, RenderStateTwo, 
    SpriteData,
    TerrainSpriteName,
    TerrainNames,
    ObjectSpriteNames,
    Coordinates,
    ObjectSpriteData,
    TerrainSpriteData
} from "@/types";
import { chunkHeight, chunkWidth } from "@/constants/board";
import {  gameSquare, rockOne, rockThree, rockTwo, spriteAnimationFrames, treasureOne, treasureThree, treasureTwo, treeOne, treeTwo } from "@/constants/sprites";
import { 
	terrainStaggerFrames,
    renderStateOne,
    renderStateTwo,
} from "@/constants/canvas";

import type Board from "@/lib/map/Board";


/**
 * ______________________________________________________________
 * This class does not modify the map's state at all
 * 	 map state is read from board and written to canvas
 * ______________________________________________________________
 * 
 * ______________________________________________________________
 * Render engine should be created at the point the game is loaded
 * 	since the window size is determined by the connecting device and not screen size
 * 	this value should normally, only be determined once at point of loading the app on the device
 * ______________________________________________________________
 */
export default class RenderEngine {

	canvasWidth: number;
	canvasHeight: number;

	constructor(
		canvasWidth: number,
		canvasHeight: number,
	){
		this.canvasHeight = canvasHeight;
		this.canvasWidth = canvasWidth;
	}

	renderBoard(
		board: Board|null,
		gameFrame: number,
		terrainCanvas: HTMLCanvasElement | null,
		treasureCanvas: HTMLCanvasElement | null,
		treeCanvas: HTMLCanvasElement | null,
		rockCanvas:HTMLCanvasElement | null,
	){	
		/// uninitialized	
		if(!board || !terrainCanvas || !treasureCanvas || !treeCanvas || !rockCanvas ) return;

		// const terrainContext = terrainCanvas.getContext('2d');
		// const rockContext = rockCanvas.getContext('2d');
		// const treeContext= treeCanvas.getContext('2d');
		// rockContext?.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
		// terrainContext?.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
		// treeContext?.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

		/// v make this a promise and resolve it all at once??? 
		board.chunks.map((chunk) =>{
			if(chunk.tiles.length < 1) return;
			chunk.tiles.map((tile) => {
				if(tile.state.length < 1) return;
				
				/// clear all state from single tile, before rendering all contents of that tile
				// const canvasX = chunkWidth * chunk.coords.x * gameSquare + tile.coords.x * gameSquare;
				// const canvasY = chunkHeight * chunk.coords.y * gameSquare + tile.coords.y * gameSquare;				
				// RenderEngine.clearSprite(terrainCanvas, canvasX, canvasY);
				// RenderEngine.clearSprite(treasureCanvas, canvasX, canvasY);
				// RenderEngine.clearSprite(treeCanvas, canvasX, canvasY);
				// RenderEngine.clearSprite(rockCanvas, canvasX, canvasY);

				const canvasX = RenderEngine.getCanvasX(chunk.coords.x, tile.coords.x)
				const canvasY = RenderEngine.getCanvasY(chunk.coords.y, tile.coords.y)

				tile.state.map((value, index) => {
					if(index === 0){ 

						///
						/// FORMAT KEY STORED IN TILE STATE TO KEY THAT REFERENCES SPRITE IN SPRITE_ANIMATIONS
						///
						// the first item of 'state'in every tile is a ref to a background to render
						/// 'Forest0' || 'Ground0' || 'Field0' <-- references data created by loadTerrainSprites()
						const terrainSpriteName = value as TerrainSpriteName;

						const renderState = RenderEngine.getRenderState(gameFrame, terrainStaggerFrames)
						if(renderState !== renderStateOne && renderState !== renderStateTwo) return;  /// no update to terrain on this frame 

						const sprite = RenderEngine.getSprite(value.slice(0, -1) as TerrainNames, terrainSpriteName);
						RenderEngine.drawSprite(terrainCanvas, renderState, sprite, { canvasX, canvasY }) 
							/// ^ this will become generic draw
					}
					

					let sprite:SpriteData|undefined;
					switch(value){

						//// remove this from here, and only draw on board, 
							/// spawn 1st on board creation
						case treasureOne:
						case treasureTwo:
						case treasureThree:
							/// *** Draw Treasure  *** ///
							sprite = RenderEngine.getSprite(value);
							/// clear previous
							RenderEngine.drawSprite(treasureCanvas, renderStateOne, sprite, { canvasX, canvasY })
							break;


						case rockOne:
						case rockTwo:
						case rockThree:

        					/// *** Draw Rocks Only once on map generation  *** ///
      						if(gameFrame !== 1) break; 
							sprite = RenderEngine.getSprite(value);
							RenderEngine.drawSprite(rockCanvas, renderStateOne, sprite, { canvasX, canvasY })
							break;

						case treeOne:
						case treeTwo:

        					const renderState = RenderEngine.getRenderState(gameFrame, terrainStaggerFrames)
							if(renderState !== renderStateOne && renderState !== renderStateTwo) return;  /// no update to terrain on this frame 
							sprite = RenderEngine.getSprite(value); /// [ Ex. TreeOne: { spriteName, src, frames:[]  } ]

							RenderEngine.drawSprite(treeCanvas, renderState, sprite, { canvasX, canvasY });
							break;

						default:
							break; /// because 0th state index still falls through through switch 
					}  
				})
			})
		})
	}

	/**
	 * This draw method is bound to the chunk:{ x, y }, tile:{ x, y } coordinates of an object in the map grid
	 * 
	 * - canvas is always a pointer to object in global state
	 * 	 passed down through board render tree or player movement tree
	 */
	static drawSprite(
		canvas:HTMLCanvasElement, 
		renderState: RenderStateOne | RenderStateTwo,
		sprite: ObjectSpriteData | TerrainSpriteData | undefined ,
		currentCanvasLocation: { canvasX:number, canvasY:number },
		prevCanvasLocation?: { canvasX:number, canvasY:number } /// only for players
	){
		if(!sprite) return;

		const context = canvas?.getContext('2d');
		if(!context) return; /// if the canvas leaves the dom, it should be undefined, 
		/// causing this to end running proccesses dependent on canvas elements like the enemy movement loop

		const tileImage = new Image();
		tileImage.src = sprite.src;
		tileImage.onload = (() => {

			/// get square of sprite sheet to be drawn
			const frameCoords = sprite.frames[renderState];
			if(!frameCoords) return;

			if(prevCanvasLocation){
				/// for enemies and players			
				context.clearRect(
					prevCanvasLocation?.canvasX*2, 
					prevCanvasLocation?.canvasY*2, 
					gameSquare*2, /// width
					gameSquare*2 /// height
				);
			} else {
				context.clearRect(
					currentCanvasLocation.canvasX*2, 
					currentCanvasLocation.canvasY*2, 
					gameSquare*2, /// width
					gameSquare*2 /// height
				);
			}
			
			// console.log('`` ~~ draw object ~~ ``');	
			context.drawImage(tileImage,
				frameCoords.x, frameCoords.y, /// section of sprite sheet
				gameSquare, gameSquare, /// [ sprite sheets are 32x32 ]
				currentCanvasLocation.canvasX*2, currentCanvasLocation.canvasY*2, // location on canvas
				gameSquare*2, gameSquare*2 /// area on canvas
			);
		});
	}


	/**
	 * THESE METHODS ARE PROBLEMATIC, 
	 * 	BECAUSE THEY ONLY TAKE IN THE CHUNK/TILE COORDS, 	
	 * 	CHARACTERS CAN NEVER EXIST BETWEEN SQUARES...
	 * 
	 * FOR CHARACTERS, CANVASX && CANVASY SHOULD ONLY BE SET ONCE...?
	 * 	THEN MODIFY AS NEEDED...??
	 * 	
	 * BY HOW MUCH DISTANCE SHOULD A MOVEMENT IN 
	 * 	SOME DIRECTION MODIFY CANVASX && CANVASY OF CHAR
	 */
	static getCanvasX(chunk:Coordinates['x'|'y'], tile:Coordinates['x'|'y']){
		return chunk * chunkWidth * gameSquare + tile * gameSquare;
	}
	static getCanvasY(chunk:Coordinates['x'|'y'], tile:Coordinates['x'|'y']){
		return chunk * chunkHeight * gameSquare + tile * gameSquare;
	}

	/**
	 * The Terrain sprites have a diffent data structure than other sprites
	 * 	due to their layout having multiple variations on a single sprite sheet
	 * 	src/assets/Forest.png [Forest0, Forest1, Forest2, ...]
	 */
	static getSprite(
		spriteName: TerrainNames|ObjectSpriteNames, //// 'Forest' | 'Ground' | 'Field'
		terrainName?: TerrainSpriteName /// 'Forest0' | 'RockOne' <-- to filter out sprite from SpriteData[]
	){
		//// this is trying to use spriteName to index
		/// an object, but the object returned is undefined
		return spriteAnimationFrames[spriteName].find(
										// ^'Forest', 'RockOne'
			(sprite) => terrainName ? 
				sprite.spriteName === terrainName 
				:sprite.spriteName === spriteName
				        // ^'Forest0', 'RockOne'
		);
								
		/// return entire sprite Obj including frames frame to be passed next to render
	}

	//// each sprite possible 1 or 2 frames
	/// for sprites with 2 frames, they repeat on a cycle
	/// [Ex. every 8 frames(staggerFrames*2), or every 4 frames(staggerFrames) ]
	/// the alternation of this cycle is what produces the animation effect
	/**
	 * There should be stagger frames specific to each 
	 * 	animation 
	 * 	- Trees
	 *  - Rocks
	 *  - Player
	 */
	static getRenderState(
		gameFrame:number,
		staggerFrames: number, 
	){
		/// these are deliberately out of phase, 
		/// if staggerFrames === 4, the render cycle is 2
		const renderFrame1 = gameFrame === 1 || gameFrame % staggerFrames === 0;
		const renderFrame2 = gameFrame % (staggerFrames * 2) === 0;

		if(renderFrame2){ /// frame2 first to prioritize over frame1
			return renderStateOne; 
		} else if(renderFrame1) {
			return renderStateTwo; /// board spawns with all in renderStateOne, so first animations requires this to be stateTwo
		}
		return;
	}
}