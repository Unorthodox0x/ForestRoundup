import type { RefObject } from "react"
import type Character from "@/lib/chars/Character";
import type Board from '@/lib/map/Board';
import type { GameStates, SetStateType, Address } from "@/types";
import type EventHandler from "@/lib/events/EventHandler";

export type ISessionContext = {
	walletAddress: Address | null
	isSubscribed: boolean | null
	handleDisconnect: () => void,
}

export type IControllerContext = object;

export type IGameContext = {
    gameFrame: RefObject<number>, /// ticks bentween drawing each frame

    score: number,
    setScore: SetStateType<number>,

    resetGameFrames: () => void,
	// gameState: GameStates,
	// setGameState: SetStateType<GameStates>,
	gameState: RefObject<GameStates>,
	setGameState: (ref:GameStates) => void,

	gameOverScreen: RefObject<HTMLCanvasElement> | null,
	gameStartScreen: RefObject<HTMLCanvasElement> | null,
	
	terrainCanvas: RefObject<HTMLCanvasElement> | null,
	enemyCanvas: RefObject<HTMLCanvasElement> | null,
	treasureCanvas: RefObject<HTMLCanvasElement> | null,
	rockCanvas: RefObject<HTMLCanvasElement> | null,
	playerCanvas: RefObject<HTMLCanvasElement> | null,
	treeCanvas:RefObject<HTMLCanvasElement> | null,

	boardRef: RefObject<Board|null>,
	setBoardRef: (ref:Board|null) => void,

	playerRef: RefObject<Character|null>,
	setPlayerRef: (ref:Character|null) => void,

	eventHandler: RefObject<EventHandler>
}