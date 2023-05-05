import { assert, easeInOut, tween } from "@danprince/games";
import { Game, GameObject, Tags } from "./game";

export function moveBy(object: GameObject, dx: number, dy: number): boolean {
  return moveTo(object, object.x + dx, object.y + dy);
}

export function moveTowards(object: GameObject, x: number, y: number): boolean {
  let dx = x - object.x;
  let dy = y - object.y;

  if (Math.abs(dx) > Math.abs(dy)) {
    return moveBy(object, Math.sign(dx), 0);
  } else {
    return moveBy(object, 0, Math.sign(dy));
  }
}

export function moveTo(object: GameObject, x: number, y: number): boolean {
  // If the object is moving horizontally, set facing
  if (x !== object.x) {
    object.facing = x > object.x ? "right" : "left";
  }

  if (game.map.isOutOfBounds(x, y)) return false;
  let cell = game.map.getCell(x, y);
  if (cell == null) return false;

  if (cell.objects.some(target => target.tags.has(Tags.Blocking))) {
    return bump(object, x, y);
  }

  for (let target of cell.objects) {
    if (!object.holding && target.tags.has(Tags.Pickup)) {
      pickup(object, target);
    }
  }

  object.spriteOffsetX = object.x - x;
  object.spriteOffsetY = object.y - y;

  tween(object, {
    spriteOffsetX: 0,
    spriteOffsetY: 0,
  }, {
    duration: 150,
    id: object.id,
    step: t => object.spriteBumpZ = Math.sin(t * Math.PI) * 0.25,
    easing: easeInOut,
  });

  game.map.moveObject(object, x, y);
  return true;
}

export function bump(object: GameObject, x: number, y: number): boolean {
  object.spriteBumpX = (x - object.x) / 2;
  object.spriteBumpY = (y - object.y) / 2;

  tween(object, {
    spriteBumpX: 0,
    spriteBumpY: 0,
  }, {
    duration: 150,
    id: object.id,
    easing: easeInOut,
  });

  let targets = game.map
    .getCell(x, y)
    ?.objects.filter(target => target.vitality);

  if (targets) {
    for (let target of targets) {
      attack({ object, target, damage: 1 });
    }

    return true;
  }

  return false;
}

export function rest(object: GameObject): boolean {
  return true;
}

interface Attack {
  object: GameObject;
  target: GameObject;
  damage: number;
}

export function attack(attack: Attack): boolean {
  damage(attack.target, attack.damage);
  return true;
}

export function damage(target: GameObject, amount: number): boolean {
  assert(target.vitality, "Can't damage object without vitals!");

  target.vitality.damage(amount);

  if (target.vitality.hp <= 0) {
    death(target);
  }

  return true;
}

export function death(object: GameObject) {
  game.map.despawn(object);
}

export function pickup(object: GameObject, target: GameObject) {
  if (object.holding) return false;
  game.map.despawn(target);
  object.holding = target;
}
