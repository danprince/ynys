import { Sprite, PivotSprite } from "@danprince/games";
import * as sprites from "./sprites";

export class GameObject {
  sprite: Sprite | PivotSprite = sprites.missing_sprite;
  x: number = 0;
  y: number = 0;
}

