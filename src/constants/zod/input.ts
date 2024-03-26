import { z } from 'zod';

export const playerUp = "playerUp" as const;
export const playerDown = "playerDown" as const;
export const playerLeft = "playerLeft" as const;
export const playerRight = "playerRight" as const;
export const playerDirection = [playerUp, playerDown, playerLeft, playerRight]

export const enemyUp = "enemyUp" as const;
export const enemyDown = "enemyDown" as const;
export const enemyLeft = "enemyLeft" as const;
export const enemyRight = "enemyRight" as const;
export const enemyDirection = [enemyUp, enemyDown, enemyLeft, enemyRight];

export type PlayerInputMove = DownMoveInput|UpMoveInput|LeftMoveInput|RightMoveInput

const downMoveInputSchema = z.union([z.literal('KeyS'), z.literal('ArrowDown')]);
export type DownMoveInput = z.infer<typeof downMoveInputSchema>;

const upMoveInputSchema = z.union([z.literal('KeyW'), z.literal('ArrowUp')]);
export type UpMoveInput = z.infer<typeof upMoveInputSchema>;

const leftMoveInputSchema = z.union([z.literal('KeyA'), z.literal('ArrowLeft')]);
export type LeftMoveInput = z.infer<typeof leftMoveInputSchema>;

const rightMoveInputSchema = z.union([z.literal('KeyD'), z.literal('ArrowRight')]);
export type RightMoveInput = z.infer<typeof rightMoveInputSchema>;