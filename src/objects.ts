import { GameObject } from "./game";
import * as sprites from "./sprites";

export function Player(): GameObject {
  let unit = new GameObject();
  unit.sprite = sprites.mob_druid_idle_1;
  return unit;
}
