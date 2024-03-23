import { playerStaggerFrames, terrainStaggerFrames } from "@/constants/canvas";
import { PlayerDirection } from "./Sprite";
import { Coordinates } from "./Board";

export type BackgroundFrames = typeof terrainStaggerFrames
export type PlayerFrames = typeof playerStaggerFrames
export type RenderStateOne = 0;
export type RenderStateTwo = 1;

/// likely needs updated
export type PlayerState = Record<
	PlayerDirection, {
		spriteLoc: Coordinates[]
	}
>