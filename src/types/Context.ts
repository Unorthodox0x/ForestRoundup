import type { RefObject } from "react"
import type Player from '@/lib/chars/Player';
import type Board from '@/lib/map/Board';
import { GameStates, SetStateType } from "./Base";
import EventHandler from "@/lib/events/EventHandler";

export type IWalletContext = {
	
}

export type IControllerContext = object;

export type IGameContext = {
    gameFrame: RefObject<number>, /// ticks bentween drawing each frame

    score: number,
    setScore: SetStateType<number>,

	// gameState: GameStates,
	// setGameState: SetStateType<GameStates>,
	gameState: RefObject<GameStates>,
	setGameState: (ref:GameStates) => void,

	gameOverScreen: RefObject<HTMLCanvasElement> | null,
	gameStartScreen: RefObject<HTMLCanvasElement> | null,
	terrainCanvas: RefObject<HTMLCanvasElement> | null,
	enemyCanvas: RefObject<HTMLCanvasElement> | null,
	treasureCanvas: RefObject<HTMLCanvasElement> | null,
	objectCanvas: RefObject<HTMLCanvasElement> | null,
	playerCanvas: RefObject<HTMLCanvasElement> | null,
	treeCanvas:RefObject<HTMLCanvasElement> | null,

	boardRef: RefObject<Board|null>,
	setBoardRef: (ref:Board|null) => void,

	playerRef: RefObject<Player|null>,
	setPlayerRef: (ref:Player|null) => void,

	eventHandler: RefObject<EventHandler>
}