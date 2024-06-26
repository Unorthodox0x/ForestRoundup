export const mount = "Mount" as const;
export const running = "Running" as const;
export const paused = "Paused" as const;
export const gameOver = "Game Over" as const;
export const startGame = 'Start Game' as const;
export const gameStates = [mount, startGame, running, paused, gameOver];

/// game events to trigger on character movement
export const collectTreasure = "Collect Treasure" as const; /// player movement into square with treasure
export const movePlayer = "MovePlayer" as const; /// normal player movement into open square
export const moveEnemy = 'Move Enemy' as const;

export const initialFrame = 0;
export const enemyCount = 12;
