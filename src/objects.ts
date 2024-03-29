import { randomElement } from "@danprince/games";
import { GameObject, Tags } from "./game";
import * as sprites from "./sprites";
import { Equipment, Vitality } from "./components";
import { ThrowingMode } from "./modes";

function Human(): GameObject {
  let unit = new GameObject();
  unit.tags.add(Tags.Mobile);
  unit.tags.add(Tags.Blocking);
  unit.vitality = new Vitality(unit, { hp: 1 });
  return unit;
}

export function Player(): GameObject {
  let unit = Human();
  unit.sprite = sprites.object_druid_idle_1;
  unit.holding = Axe();
  return unit;
}

export function Roman(): GameObject {
  let unit = Human();
  unit.sprite = sprites.object_centurion;
  return unit;
}

export function Tree(): GameObject {
  let unit = new GameObject();
  unit.tags.add(Tags.Occludes);
  unit.tags.add(Tags.Blocking);
  unit.tags.add(Tags.Choppable);
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
  unit.tags.add(Tags.Blocking);
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

export function Stone(): GameObject {
  let unit = new GameObject();
  unit.sprite = sprites.object_round_stone;
  unit.equipment = new Equipment(unit);
  unit.equipment.use = () => game.setMode(new ThrowingMode(unit));
  return unit;
}

export function Axe(): GameObject {
  let unit = new GameObject();
  unit.sprite = sprites.object_axe;
  unit.equipment = new Equipment(unit);
  unit.equipment.bump = (x, y) => {
    let cell = game.map.getCell(x, y);
    if (cell) {
      for (let target of cell.objects) {
        if (target.tags.has(Tags.Choppable)) {
          game.map.despawn(target);
        }
      }
    }
  };
  return unit;
}
