export class HasteBody {
  x: number;
  y: number;
  width: number;
  height: number;
  name: string;
  angle: number;
}

export class HasteGameState {
  height: number;
  width: number;
  player: HasteBody;
  staticBodies: HasteBody[];
  stars: HasteBody[];
  bombs: HasteBody[];
  rectangle: HasteBody;
}
