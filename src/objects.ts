import { randomElement } from "@danprince/games";
import { GameObject, Tags } from "./game";
import * as sprites from "./sprites";

export function Player(): GameObject {
  let unit = new GameObject();
  unit.sprite = sprites.object_druid_idle_1;
  unit.tags.add(Tags.Mobile);
  return unit;
}

export function Roman(): GameObject {
  let unit = new GameObject();
  unit.sprite = sprites.object_centurion;
  unit.tags.add(Tags.Mobile);
  return unit;
}

export function Tree(): GameObject {
  let unit = new GameObject();
  unit.tags.add(Tags.Occludes);
  unit.sprite = randomElement([
    sprites.object_tree_1,
    sprites.object_tree_2,
    sprites.object_tree_3,
    sprites.object_tree_4,
    sprites.object_tree_5,
    sprites.object_tree_6,
    //sprites.object_tree_7,
    //sprites.object_tree_8,
  ]);
  return unit;
}

export function Rock(): GameObject {
  let unit = new GameObject();
  unit.facing = randomElement(["left", "right"]);
  unit.sprite = randomElement([
    sprites.object_mossy_rock_1,
    sprites.object_mossy_rock_2,
    sprites.object_mossy_rock_3,
    sprites.object_mossy_rock_4,
    sprites.object_mossy_rock_5,
    sprites.object_standing_stone_1,
    sprites.object_standing_stone_2,
    sprites.object_standing_stone_3,
    sprites.object_standing_stone_4,
    sprites.object_standing_stone_5,
  ]);
  return unit;
}
