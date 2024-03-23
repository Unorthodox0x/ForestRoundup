import Player from "@/lib/chars/Player"; 
import Board from '@/lib/map/Board';
import { gameOver, paused, running } from '@/constants/game';
import type { BoardLocation, EnemyDirection, GameStates, IGameContext, PlayerDirection } from "@/types";
import Enemy from "../chars/Enemy";
import { renderStateOne, renderStateTwo } from "@/constants/canvas";

/**
 * It may make more sense to be passing references
 */
export default class EventHandler {

	setGameState: IGameContext['setGameState']
	setScore: IGameContext['setScore'];
	setBoardRef: IGameContext['setBoardRef']
	setPlayerRef:IGameContext['setPlayerRef']
	resetGameFrames: () => void;

	constructor(
		setBoardRef: IGameContext['setBoardRef'],
		setScore: IGameContext['setScore'],
		setGameState: IGameContext['setGameState'],
		setPlayerRef: IGameContext['setPlayerRef'],
		resetGameFrames: () => void,
	){
		this.setGameState = setGameState;
		this.setScore = setScore;
		this.setBoardRef = setBoardRef;
		this.setPlayerRef = setPlayerRef;
		this.resetGameFrames = resetGameFrames;
	}

	async handleStart(
		playerCanvas: HTMLCanvasElement,
		terrainCanvas: HTMLCanvasElement,
		enemyCanvas: HTMLCanvasElement,
		treasureCanvas: HTMLCanvasElement, 
	){	
		/// generate board && player
		const board = new Board(terrainCanvas, enemyCanvas, treasureCanvas, this);
	
		await board.initialize(); /// initialize board
		this.setBoardRef(board);
	
		this.setPlayerRef(new Player(playerCanvas)); /// initialze player

		this.setGameState(running); /// signal start
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
    async handleMove(
		board: Board,
		nextTileLoc: BoardLocation,
		char: Player|Enemy,
		direction:PlayerDirection|EnemyDirection,
    ) {	
		/// get location of next tile to insert character
		const nextTile = board.getChunk(nextTileLoc.chunk)
			.getTile(nextTileLoc?.tile)!;

		/// handle outcome of movement,
		if (
			(char instanceof Player && nextTile.hasState('enemy')) ||
			(char instanceof Enemy && nextTile.hasState('player'))
		) {
			/// remove both player && enemy from their tiles
			char.direction = direction;
			char.move(nextTileLoc)
			this.handleLose();
			return char;
		}

		/// neither enemy or player move into obstacles
		if(nextTile.hasState('Rock')||nextTile.hasState('Tree')){
			/// update sprite to face direction, but do not move 
			char.direction = direction;
			await char.draw(renderStateTwo);	
			
			/// this slight delay is used to introduce 
			/// a stagger frame to produce an animation effect
			setTimeout(async()=> {
				await char.draw(renderStateOne);
			}, 100);
			this.setBoardRef(board);
			return char; /// enemy gets returned
		}

		/// move either player or enemy
		if(nextTile.state.length === 1 || nextTile.hasState('Treasure')){

			/// remove char from previous tile
			/// use char's direction before the move occurs to remove them 
			/// from their previous tile
			board.chunks[char.location.chunk]!.tiles[char.location.tile]?.removeState(char.direction);

			/// add character to next tile
			board.chunks[nextTileLoc.chunk]!.tiles[nextTileLoc.tile]?.
				addState(direction);
			
			// next tile is empty || has treasure, move char
			char.direction = direction;
			
			char.move(nextTileLoc);
		}

		/// only collect treasure if char is player
		if(char instanceof Player && nextTile.hasState('Treasure')){		
			/// TODO::: SetBoardRef && setScore in GameEvents
			// GameEvents.collectTreasure(board, setBoardRef, setScore)
			this.collectTreasure(board)
		}

		this.setBoardRef(board);
		return char; /// after all movement done, return updated char object	
    }

	/**
	 * @notice, this board contains update info from player movement
	 */
	collectTreasure(board: Board){
		const tile = board.getChunk(board.treasure.chunk)?.getTile(board.treasure.tile);
		const treasure = tile?.state.find((state)=> state.includes('Treasure'));
		if(!treasure) return;

		/// remove old treasure from board
		board.chunks[board.treasure.chunk]!.tiles[board.treasure.tile]!
			.removeState(treasure);		
		board.setTreasure(); /// spawn new treasure on board

		this.setScore((prev)=> prev + 1000); /// increment player score in global game context
		this.setBoardRef(board);
    }

    //// TODO Set score to 0 when new game starts
    /// this will allow display of score on game over screen
    handleLose(){

   		/// losing state has already been detected 	

    	/// get the sprite,
    	/// play animation, 

    	/// display Game Over && score
    	/// simple black screen, big white letters, 
    	/// score below
    	this.resetGameFrames();
		this.setGameState(gameOver);
		this.setBoardRef(null);
		this.setPlayerRef(null);
		// this.setGameState(null);

    }
}