import { GameObject, Tags } from "./game";
import * as sprites from "./sprites";

export function Player(): GameObject {
  let unit = new GameObject();
  unit.sprite = sprites.mob_druid_idle_1;
  unit.tags.add(Tags.Mobile);
  return unit;
}
