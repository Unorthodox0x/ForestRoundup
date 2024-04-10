import Board from '@/lib/map/Board';
import { enemyType, gameOver, paused, playerType, running } from '@/constants/game';
import type { EnemyDirection, GameStates, IGameContext, PlayerDirection, TileDimensions } from "@/types";
import Character from "@/lib/chars/Character";
import { originChunk, originSquare } from '@/constants/board';
import { playerDown } from '@/constants/zod/input';

/**
 * It may make more sense to be passing references
 */
export default class EventHandler {

	setGameState: IGameContext['setGameState']
	setScore: IGameContext['setScore'];
	setBoardRef: IGameContext['setBoardRef']
	setPlayerRef:IGameContext['setPlayerRef']

	canvasHeight: number;
	canvasWidth: number;
	tileDimensions: TileDimensions

	
	constructor(
		setBoardRef: IGameContext['setBoardRef'],
		setScore: IGameContext['setScore'],
		setGameState: IGameContext['setGameState'],
		setPlayerRef: IGameContext['setPlayerRef'],
		canvasWidth: number,
		canvasHeight: number,
		tileDimensions: TileDimensions,
	){
		this.setGameState = setGameState;
		this.setScore = setScore;
		this.setBoardRef = setBoardRef;
		this.setPlayerRef = setPlayerRef;

		this.canvasHeight = canvasHeight;
		this.canvasWidth = canvasWidth;
		this.tileDimensions = tileDimensions;
	}

	handleStart(
		playerCanvas: HTMLCanvasElement, /// ref from global state passed down, from controller, no separate ref is set in this class
		enemyCanvas: HTMLCanvasElement, /// ref from global state passed down, only a single instance of canvas is used for all enemies
		treasureCanvas:HTMLCanvasElement,
	){
		try {
			/// generate board && player
			const board = new Board(
				this, 
				enemyCanvas, 
				treasureCanvas, 
				this.canvasWidth, 
				this.canvasHeight,
				this.tileDimensions
			);
			
			board.initialize(); /// initialize board with global enemy context
			this.setBoardRef(board);
		
			/// initialze player
			this.setPlayerRef(
				new Character(
					0,
					playerType,
					playerDown,
					{ chunk: originChunk, tile: originSquare },
					playerCanvas,
					this.canvasWidth,
					this.canvasHeight,
					this.tileDimensions
				)
			);

			this.setGameState(running); /// signal start
		}

		catch(err) {
			console.error('Game Start Failed', err)
		}
	}

	handlePause(gameState:GameStates){
		switch(gameState){
			case paused:
				console.log( '~~~```Run Game```~~~')
				this.setGameState(running); /// cause game if spacebar pressed
				break;
			case running:
				console.log( '~~~```Pause Game```~~~')
				this.setGameState(paused); /// cause game if spacebar pressed
				break;
			default:
				break; 
		}
	}

	/**
	 * Decide if player should move
	 * 	and what the outcome of that movement should be
	 */
    handleMove(
		board: Board,
		char: Character,
		direction:PlayerDirection|EnemyDirection,
		canvas: HTMLCanvasElement|undefined|null, /// delivered from controller && enemy movement loop
		/// contexts can be passed in here,,,
		/// treasureContext to update treasure when it is collected
		/// this keeps with design of taking canvas|context as input and not creating a ref in this class
    ) {	
    	if(!canvas) return;


		/// 
		/// [ get next tile to determine && handle outcome of movement ]
		/// 
		/// it is not possible for nextTileLoc to return undefined, 
		///   if the player were to attempt to move out of map boundary, it would be possible,
		///   but trees are setup as a barrier preventing boundary from being reached
		const nextTileLoc = char.getNextTile(direction)
		const nextTile = board.getChunk(nextTileLoc?.chunk).getTile(nextTileLoc?.tile);
		if(!nextTileLoc || !nextTile) return;
		
    	// if(char.charType === playerType){
		// 	console.log('nextTile===:::', nextTile.state)
		// }

		/** 
		 * @notice it is important that the char's direction is changed after 
		 *  	char's previous state has been used to remove player from their prev location
		 */

		if (
			(char.charType === playerType && nextTile.hasState(enemyType)) ||
			(char.charType === enemyType && nextTile.hasState(playerType))
		) {
			/// board will be null not necessary to update state 
			///

			/// set direction char is facing		
			char.direction = direction;
			
			/// move char into next tile
			char.move(canvas, nextTileLoc)
			
			/// end game
			this.handleLose();
			return;
		}

		/// dont allow enemy or player to move into obstacles
		else if(
			nextTile.hasState('Rock') || nextTile.hasState('Tree') ||
			(char.charType === enemyType && nextTile.hasState(enemyType))
		){

			board.moveObject(
				char.location, 
				`${char.direction}${char.id}`,  /// char.id makes it that only that char instance is modified
				char.location,  /// same location so no 'movement' occurs
				`${direction}${char.id}` /// new direction
			);

			this.setBoardRef(board); 

			// console.log('move into obstacle location', char.location)
			/// set direction char is facing		
			char.direction = direction;
			char.playDirectionChange(canvas);

			if(char.charType !== playerType) return char; /// enemy gets returned to board to be set in state
			this.setPlayerRef(char);
			return;
		}


		/// when an enemy is already in the tile and another enemy attempts to move in, 
			/// movement misses, and undefined is returned for that char

		else if(char.charType === playerType && nextTile.hasState('Treasure')){
			board.moveObject(
				char.location, 
				`${char.direction}${char.id}`,  /// char.id makes it that only that char instance is modified
				nextTileLoc, 
				`${direction}${char.id}`
			);

			/// set direction char is facing		
			char.direction = direction;
			/// move char into next tile
			char.move(canvas, nextTileLoc)

			this.collectTreasure(board) /// internally sets board to global context, so player movement changes are propagated
		}

		else if(char.charType === playerType && nextTile.state.length === 1){
			board.moveObject(
				char.location, 
				`${char.direction}${char.id}`,  /// char.id makes it that only that char instance is modified
				nextTileLoc, 
				`${direction}${char.id}`
			);

			/// set direction char is facing		
			char.direction = direction;
			/// move char into next tile
			char.move(canvas, nextTileLoc)
			
			this.setBoardRef(board); 
		}

		/// move character into next tile
		else if(char.charType === enemyType){

			board.moveObject(
				char.location, 
				`${char.direction}${char.id}`,  /// char.id makes it that only that char instance is modified
				nextTileLoc, 
				`${direction}${char.id}`
			);
 
			this.setBoardRef(board);

			/// set direction char is facing		
			char.direction = direction;
			/// move char into next tile
			char.move(canvas, nextTileLoc)
			return char;
		}
    }

	/**
	 * @notice, this board contains update info from player movement
	 */
	collectTreasure(board: Board){
		const tile = board.getChunk(board.treasure.chunk)?.getTile(board.treasure.tile);
		const treasure = tile?.state.find((state)=> state.includes('Treasure'));
		if(!treasure) return;

		/// remove old treasure from board
		board.chunks[board.treasure.chunk]!.
			tiles[board.treasure.tile]!.removeState(treasure);		

		board.setTreasure(); /// spawn new treasure on board

		this.setScore((prev)=> prev + 1000); /// increment player score in global game context
		this.setBoardRef(board); /// pass modified board state back to global game context
    }

    handleLose(){

   		/// losing state has already been detected 	
    	/// display Game Over && score
		this.setBoardRef(null);
		this.setPlayerRef(null);
		this.setGameState(gameOver);
    }
}