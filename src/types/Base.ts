import { gameStates } from '@/constants/game';
import type { supportedNetworkIds } from "@/constants/networks";

export type SetStateType<TType> = React.Dispatch<React.SetStateAction<TType>>
export type GameStates = typeof gameStates[number] | null

/**
 * Board: {
 * 		{ GameChunk }, { GameChunk }, { GameChunk },
 * 		{ GameChunk }, { GameChunk }, { GameChunk },
 * 		{ GameChunk }, { GameChunk }, { GameChunk },  }
 */

/**
 * Chunk: { { GameTile }, { GameTile }, { GameTile }, 
 * 	   		{ GameTile }, { GameTile }, { GameTile }, 
 * 	   		{ GameTile }, { GameTile }, { GameTile }, }
 */

/**
 * Tile: 
 * 	state: [ "{some}", "?", "?", ]
 */

/**
 * WALLETS AND CHAINS
 */
export type HexString = `0x${string}`;
export type Address = HexString;

export type ChainId = number; 
export type SupportedChain = SupportedChains[ChainId];
export type SupportedChains = typeof supportedNetworkIds;


/**
 * TYPESCRIPT HELPERS
 */

export type Prettify<T> = {
	[K in keyof T]: T[K];
} & NonNullable<unknown>;

/// unswaps an array type to infer array type
export type Unwrap<T> = T extends (infer U)[] ? U : never;

export type PartialExcept<T, K extends keyof T> = Partial<T> & Pick<T, K>;
// Example usage:
// type PartialUserExceptName = PartialExcept<User, 'id' | 'email'>;
// Equivalent to { id?: number; name: string; email?: string; }

export type Diff<T, U> = T extends U ? never : T;
// Example usage:
// type DifferentProperties = Diff<{ a: number; b: string }, { b: string; c: boolean }>;
// Evaluates to { a: number }

export type TupleToObject<TTuple extends readonly PropertyKey[]> = {
	[TIndex in TTuple[number]]: TIndex;
};
// Example usage:
// const tuple = ['1', '2', '3'] as const;
// export type TupleAsObject = TupleToObject<typeof tuple>;
// Equivalent to { 1: '1'; 2: '2'; 3: '3'; }