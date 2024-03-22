import { 
	originChunk,
	originSquare,
    boardLength,
    treasureSquares,
    rightMapBoundary,
    bottomMapBoundary,
    treeSquares,
    bottomChunkBoundary,
    rightChunkBoundary,
    obstacleSquares,
    chunkLength,
} from "@/constants/board";
import { enemyDirection, playerDown } from "@/constants/input";
import Enemy from "@/lib/chars/Enemy";
import Chunk from "@/lib/map/Chunk";
import { BoardLocation, EnemyDirection } from "@/types";
import RenderEngine from "@/lib/render/RenderEngine";
import Controller from "@/lib/input/Controller";
import EventHandler from "../events/EventHandler";

/** 
 * This class is stored in a useRef hook 
 *	to preserve game state when rerendering
 */	
export default class Board {

	terrainCanvas: HTMLCanvasElement;
	playerCanvas: HTMLCanvasElement;
	enemyCanvas: HTMLCanvasElement;
	treasureCanvas: HTMLCanvasElement;
	eventHandler: EventHandler;

	enemies: Enemy[];
	chunks: Chunk[]; /// useContext will access and manipulate this value
	treasure: BoardLocation;

	constructor(
		terrainCanvas:HTMLCanvasElement,
		playerCanvas:HTMLCanvasElement,
		enemyCanvas: HTMLCanvasElement,
		treasureCanvas: HTMLCanvasElement,
		eventHandler: EventHandler,
	){
		this.terrainCanvas = terrainCanvas;
		this.playerCanvas = playerCanvas;
		this.enemyCanvas = enemyCanvas;
		this.treasureCanvas = treasureCanvas;
		this.eventHandler = eventHandler; // moves enemies

		this.enemies = [];
		this.chunks = [];
		this.treasure = { chunk: 0, tile:0 } /// initialze default, will be upated when board fully generated
	}

	clearMap(){
		this.chunks = [];
	}

	getChunk(chunkIndex:number|undefined){
		if((chunkIndex !== 0 && !chunkIndex) || chunkIndex > this.chunks.length - 1) throw new Error('out of index')
		return this.chunks[chunkIndex]!;
	}

	async initialize(){
		await this.generateChunks();

		/**
		 * [ Set map boundaries ]::: set tile.state to 'x' if tile is at corresponding coods
		 * 
		 * This Map represents the starting state of the game board
		 * 	this will be passed to the renderer to draw the map on canvas
		 */

		/// add tile to array of all Tiles to store in chunk
		await this.setPerimeter();

		/**
		 * set player at origin during board initialization
		 */
		const tile = this.chunks[originChunk]!.tiles[originSquare]!
		tile.addState(playerDown);
		this.chunks[originChunk]!.tiles[originSquare] = tile;

		/**
		 * add obstacles if not player or border, 
		 * 	internally prevent replacement of border tree or player with a rock,
		 */
		await this.setObstacles();

		/**
		 * Set single treasury on map
		 */
		this.setTreasure(); /// set once default board is generated to prevent overwriting

		/// create some number of enemies, randomly set them in board
		await this.spawnEnemies();
	}

	/// generate dynamic map
	async generateChunks () {
		const promises = Array.from({ length: boardLength }, async (_, index) => {
			const chunk = new Chunk(index);
			return await chunk.initialize();
		});

		this.chunks = await Promise.all(promises);
	}

	async spawnEnemies(){
		const enemyCount = 10;
		for(let i=0; i < enemyCount; i++){

			/** Spawn enemy by adding them to some tile's state */
			const { direction, location } = await this.rollEnemyChunk();
			const enemy = new Enemy(this.enemyCanvas, direction, location);

			this.enemies.push(enemy);
		}
	}

	async rollEnemyChunk():Promise<{ 
		direction: EnemyDirection, 
		location: { chunk: number, tile: number } 
	}>{
		/// get tile to place enemy
		const chunkIndex = Math.floor(Math.random() * boardLength);
		const tileIndex = Math.floor(Math.random() * chunkLength);
		const tile = this.getChunk(chunkIndex)?.getTile(tileIndex);

		/// make sure tile doesn't have obstacle or player
		if(tile && tile.state.length <= 1){
			/// pick random direction for enemy to face
			const direction = enemyDirection[Math.floor(Math.random()*4)]! 
			tile.addState(direction)	
			this.chunks[chunkIndex]!.tiles[tileIndex] = tile;
			return {
				direction,
				location:{ chunk: chunkIndex, tile: tileIndex }
			}
		} 

		return await this.rollEnemyChunk(); /// invalid, reroll
	}

	/** During board generation add random # of obstacles to map */ 
	async setObstacles(){
		const promises = this.chunks.flatMap((chunk, chunkIndex)=>{
			return chunk.tiles.map( async(tile, tileIndex)=> {

				/// don't put obstacle in a non-empty square
				if(tile.state.length > 1) return;
				
				const obstacleRoll = Math.random();

				// roll modify chance
				if(obstacleRoll < 0.85) return tile;

				const obstacle = obstacleSquares[Math.floor(Math.random()**2*5)]!
				await tile.addState(obstacle);
				this.chunks[chunkIndex]!.tiles[tileIndex] = tile;
			})
		});

		/// does this update the chunks in place???
		await Promise.all(promises);
	}

	setTreasure() {
		/// select which chunk && tile to place treasure
		const chunkIndex = Math.floor(Math.random() * boardLength);
		const tileIndex = Math.floor(Math.random() * chunkLength);
		const tile = this.getChunk(chunkIndex)?.getTile(tileIndex);

		/// don't set treasure if state more than terrain
		if(!tile || tile.state.length > 1){ /// invalid chunk, reroll
			///random coords are invalid, 
			/// recursively retry until valid found
			this.setTreasure();
		} 

		else { /// valid chunk, update tile state array

			this.treasure = {
				chunk: chunkIndex,
				tile: tileIndex
			}

			/// select sprite animation
			const treasure = treasureSquares[Math.floor(Math.random()*3)]!;
			tile.state.push(treasure); /// update tile state
			this.chunks[chunkIndex]!.tiles[tileIndex] = tile; /// update tile in class memory

			/// *** Draw Treasure  *** ///
				/// clear last
			const context = this.treasureCanvas.getContext('2d');
			if(!context) return;
			context.clearRect(0, 0, this.treasureCanvas.width, this.treasureCanvas.height)
				/// draw new
			RenderEngine.drawTreasure(
				tile,
				context,
			);
		}
	}

	/**
	 * 1. Identify which chunk this is based on it's coordinates, 
	 * 2. determine which tiles must have a border added to it's state
	 * 3. update that tile's state array with a border if it's located on border
	 */
	async setPerimeter(){

		/**
		 * [	{ Chunks }
		 * 		[1], [2], [3], [4]
		 * 		[5], [x], [x], [8]
		 * 		[9], [x], [x], [12]
		 * 		[13],[14],[15],[16]
		 * ]
		 * [	{ Tile } Chunk: { x:0, y:0 }
		 * 		
		 * 		[x],[x],[x],[x]
		 * 		[x],[-],[-],[-]
		 * 		[x],[-],[-],[-]
		 * ]
		 * 	[	{ Tile } Chunk: { x:1, y:0 }
		 * 		
		 * 		[x],[x],[x],[x]
		 * 		[-],[-],[-],[-]
		 * 		[-],[-],[-],[-]
		 * ]
		 */

		this.chunks.map((chunk, chunkIndex)=>{
			const isBorderChunk =  chunk.coords.x === 0 || 
				chunk.coords.y === 0 || 
				chunk.coords.x === rightMapBoundary || 
				chunk.coords.y === bottomMapBoundary;

			if(!isBorderChunk) return;

			chunk.tiles.map((tile, tileIndex)=>{
				/// roll random tree to set in state
				const borderTree = treeSquares[Math.floor(Math.random() * 2)]!
				/// prevent double insertion
				const borderSet = tile.hasState('Tree');

				//// left boundary wall
				if(!borderSet && 
					chunk.coords.x === 0 && 
					tile.coords.x ===0
				){
					tile.addState(borderTree);
					// console.log('set left boundary', tile)
				}

				/// top boundary wall
				else if(!borderSet &&
					chunk.coords.y === 0 && 
					tile.coords.y === 0
				){
					tile.addState(borderTree);
					// console.log('set top boundary', tile)
				}
				
				/// right boundary wall
				else if(!borderSet &&
					chunk.coords.x === rightMapBoundary &&
					tile.coords.x === rightChunkBoundary
				){
					tile.addState(borderTree);
					// console.log('set right boundary', tile)
				} 
				
				/// bottom boundary wall
				else if(
					!borderSet &&
					chunk.coords.y === bottomMapBoundary &&
					tile.coords.y === bottomChunkBoundary
				){
					tile.addState(borderTree);					
					// console.log('set bottom boundary', tile)
				}

				/// set the modified chunk bac
				this.chunks[chunkIndex]!.tiles[tileIndex] = tile;
			})
		})
		
		return this;
	}

	/**
	 * apply all updates to enemies at once
	 */
    async moveEnemies() {	

		const movements = this.enemies.map(
			async (enemy) => {
				/// pick a random sprite direction, 
				/// up | down | left | right
				const direction = enemyDirection[Math.floor(Math.random() * 4)]!
				const nextTileLoc = Controller.getNextTile(enemy, direction)!;
				const char = await this.eventHandler.handleMove(this, nextTileLoc, enemy, direction) as Enemy;
				return char;				
			});

		this.enemies = await Promise.all(movements);
    }
}

