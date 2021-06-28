import { Bomb } from './bomb';
import { Floor } from './floor';
import { Platform } from './platform';
import { Player } from './player';
import { Star } from './star';

export class HasteGameState {
  height: number;
  width: number;
  player: Player;
  platforms: Platform[];
  floor: Floor;
  stars: Star[];
  bombs: Bomb[];
  score: number;

  constructor(
    width: number,
    height: number,
    player: Player,
    floor: Floor,
    platforms: Platform[],
    stars: Star[],
    bombs: Bomb[],
    score: number,
  ) {
    this.height = height;
    this.width = width;
    this.platforms = platforms;
    this.floor = floor;
    this.player = player;
    this.stars = stars;
    this.bombs = bombs;
    this.score = score;
  }
}
