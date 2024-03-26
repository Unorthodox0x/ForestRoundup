import type { 
	RenderStateOne, RenderStateTwo, 
    SpriteData,
    TerrainSpriteName,
    TerrainNames,
    ObjectSpriteNames,
    RockSprites,
    TreeSprites,
    TreasureSprites,
    Coordinates
} from "@/types";
import { chunkHeight, chunkWidth } from "@/constants/board";
import {  gameSquare, spriteAnimationFrames } from "@/constants/sprites";
import { 
	terrainStaggerFrames,
    renderStateOne,
    renderStateTwo
} from "@/constants/canvas";

import type Board from "@/lib/map/Board";
import type Tile from "../map/Tile";

/**
 * This class does not modify the map's state at all
 * 	simply takes map state as input and writes that to canvas
 */
/**
 * There are stagger frames specific to each 
 * 	animation 
 * 	- Trees
 *  - Rocks
 *  - Player
 */
class RenderEngine {

	drawTerrain(
		board: Board|null,
		context: CanvasRenderingContext2D|null|undefined,
		gameFrame: number,
	){	
		if(!board || !context) return; /// uninitialized
		const renderState = this.getRenderState(gameFrame, terrainStaggerFrames)
		if(renderState !== renderStateOne && renderState !== renderStateTwo) return;  /// no update to terrain on this frame 
		
		board.chunks.flatMap(chunk =>{
			if(chunk.tiles.length < 1) return;
			chunk.tiles.map((tile) => {
				if(tile.state.length < 1) return;

				///
				/// FORMAT KEY STORED IN TILE STATE TO KEY THAT REFERENCES SPRITE IN SPRITE_ANIMATIONS
				///

				// the first item of 'state'in every tile is a ref to a background to render
				/// 'Forest0' || 'Ground0' || 'Field0' <-- references data created by loadTerrainSprites()
				const terrainSpriteName = tile.state[0] as TerrainSpriteName;

				/// terrainType === state of tile 'Forest0', Transform to match sprite index 'Forest'
				const terrainName = terrainSpriteName.slice(0, -1) as TerrainNames;
				if(!terrainName) return;

				const sprite = this.getSprite(terrainName, terrainSpriteName);
				if(!sprite) return; /// if board is setup correctly, there should always be a terrain sprite ref in state

				/// coordinates to draw tile on canvas, pixels in 1) which chunk; 2) which tile;
				const canvasX = chunkWidth * chunk.coords.x * gameSquare + tile.coords.x * gameSquare;
				const canvasY = chunkHeight * chunk.coords.y * gameSquare + tile.coords.y * gameSquare

				return this.drawSprite(context, sprite, renderState, { x: canvasX, y: canvasY }) /// only one render state
			})
		});
	}

	drawTrees(	
		board:Board|null,
		context: CanvasRenderingContext2D|null|undefined,
		gameFrame: number,
	){
		if(!board || !context) return; /// uninitialized
		const renderState = this.getRenderState(gameFrame, terrainStaggerFrames)
		if(renderState !== renderStateOne && renderState !== renderStateTwo) return;  /// no update to terrain on this frame 
		board.chunks.flatMap(chunk => {
			if(chunk.tiles.length < 1) return;
				chunk.tiles.map((tile) => {
					if(tile.state.length < 1) return;
					
					/// tree is in state?
					const treeSpriteName = tile.state.find(val => val.includes("Tree")) as TreeSprites;
					if(!treeSpriteName) return;
					
					const sprite = this.getSprite(treeSpriteName);
					if(!sprite) return;

					/// coordinates to draw tile on canvas, pixels in 1) which chunk; 2) which tile;
					const canvasX = chunkWidth * chunk.coords.x * gameSquare + tile.coords.x * gameSquare;
					const canvasY = chunkHeight * chunk.coords.y * gameSquare + tile.coords.y * gameSquare
												/// rocks only have 1 state
					return this.drawSprite(context, sprite, renderState, {x: canvasX, y: canvasY}) /// only one render state
				})
		});
	}

	drawRocks(
		board: Board|null,
		context: CanvasRenderingContext2D|null|undefined,
		gameFrame:number,
	){
		/// rock sprites are static on their own canvas, only draw on first frame of game	
		if(!board || !context || gameFrame !== 1) return; /// uninitialized		
		board.chunks.flatMap(chunk => {
			if(chunk.tiles.length < 1) return;
			chunk.tiles.map(tile =>{
				if(tile.state.length < 1) return;
				
				/// get sprite name from tile's state	
				const rockSpriteName = tile.state.find(val => val.includes("Rock")) as RockSprites;
				if(!rockSpriteName) return; /// no rock in tile,

				//// find the sprite from loaded sprite data using key from tile's state
				const sprite = this.getSprite(rockSpriteName);
				if(!sprite) return;

				/// coordinates to draw tile on canvas, pixels in 1) which chunk; 2) which tile;
				const canvasX = chunkWidth * chunk.coords.x * gameSquare + tile.coords.x * gameSquare;
				const canvasY = chunkHeight * chunk.coords.y * gameSquare + tile.coords.y * gameSquare
											/// rocks only have 1 state
				return  this.drawSprite(context, sprite, renderStateOne, {x: canvasX, y: canvasY}) /// only one render state
			});
		});
	}

	/**
	 * Since location is stored in BOARD Class, 
	 * 	no need to filter over every tile in game
	 * 	 just target that tile directly
	 */
	drawTreasure(
		tile: Tile,
		context: CanvasRenderingContext2D,
	){
		const spriteName = tile.state.find((val) => val.includes('Treasure')) as TreasureSprites;
		if(!spriteName) return;

		const sprite = this.getSprite(spriteName);
		if(!sprite) return;

		/// coordinates to draw tile on canvas, pixels in 1) which chunk; 2) which tile;
		const canvasX = chunkWidth * tile.chunk.x * gameSquare + tile.coords.x * gameSquare;
		const canvasY = chunkHeight * tile.chunk.y * gameSquare + tile.coords.y * gameSquare
		return this.drawSprite(context, sprite, renderStateOne, {x: canvasX, y: canvasY}) /// only one render state 
	}

	/// the snail caught in the battle should be removed from board state
	/// so that other snails continue moving, but this snail involved in battle
	/// is no longer moved/animated
	// playDeathAnimation(){
	// 	/// where?
	// 	const sprite = spriteAnimationFrames['BattleAnimation'];
	// 	for(let frame=0; frame < 6; frame++){ /// death animation has 6 frames
	// 		setTimeout(()=>{

	// 		},100) /// timeout to introduce small pause between frames
	// 	}
	// }

	/**
	 * This draw method is bound to the chunk:{ x, y }, tile:{ x, y } coordinates of an object in the map grid
	 * 
	 * 	To animate enemy/player movement...
	 */
	drawSprite(
		context:CanvasRenderingContext2D,
		sprite: SpriteData, /// [ Ex. TreeOne: { spriteName, src, frames:[]  } ]
		renderState: RenderStateOne|RenderStateTwo,
		canvasCoords: Coordinates
	){
		const tileImage = new Image();
		tileImage.src = sprite.src;
		tileImage.onload = (()=> {
			// console.log('`` ~~ draw tile ~~ ``');
		
			/// get square of sprite sheet to be drawn
			const frameCoords = sprite.frames[renderState];
			if(!frameCoords) return;
			context.drawImage(tileImage,
				frameCoords.x, frameCoords.y, gameSquare, gameSquare, /// section of sprite sheet
				canvasCoords.x*2, canvasCoords.y*2, // location on canvas
				gameSquare*2, gameSquare*2 /// area on canvas
			);
		});
	}

	/**
	 * The Terrain sprites have a diffent data structure than other sprites
	 * 	due to their layout having multiple variations on a single sprite sheet
	 * 	src/assets/Forest.png [Forest0, Forest1, Forest2, ...]
	 */
	getSprite(
		spriteName: TerrainNames|ObjectSpriteNames, //// 'Forest' | 'Ground' | 'Field'
		terrainName?: TerrainSpriteName /// 'Forest0' | 'RockOne' <-- to filter out sprite from SpriteData[]
	){
		//// this is trying to use spriteName to index
		/// an object, but the object returned is undefined
		return spriteAnimationFrames[spriteName].find(
										///^ 'Forest', 'RockOne'
			(sprite) => terrainName ? 
				sprite.spriteName === terrainName 
				:sprite.spriteName === spriteName
				///^ 'Forest0', 'RockOne'
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
	getRenderState(
		gameFrame:number,
		staggerFrames: number, 
	){
		/// these are out of phase, 
		/// if staggerFrames === 4, the render cycle is 2
		const renderFrame1 = gameFrame === 1 || gameFrame % staggerFrames === 0;
		const renderFrame2 = gameFrame % (staggerFrames * 2) === 0;

		if(renderFrame2){ /// frame2 first to prioritize over frame1
			return renderStateOne; 
		}else if(renderFrame1){
			return renderStateTwo; /// board spawns with all in renderStateOne, so first animations requires this to be stateTwo
		}
		return;
	}
}

const renderer = new RenderEngine();
export default renderer