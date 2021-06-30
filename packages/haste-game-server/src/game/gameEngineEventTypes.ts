import { Haste } from '@haste-sdk/sdk';
import { GameEngine } from './gameEngine';

export type GameEngineEvent = 'tick' | 'afterUpdate' | 'collisionStart';

export type GameEngineActionFn<T, R> = (event: R, source: T, engine: GameEngine, haste: Haste) => void;

export interface WrappedGameEngineEvent<T, R> {
  source: T;
  eventName: string;
  callback: GameEngineActionFn<T, R>;
}
