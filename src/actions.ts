import { easeInOut, tween } from "@danprince/games";
import { GameObject } from "./game";

export function moveBy(object: GameObject, dx: number, dy: number): boolean {
  return moveTo(object, object.x + dx, object.y + dy);
}

export function moveTo(object: GameObject, x: number, y: number): boolean {
  if (game.map.isOutOfBounds(x, y)) return false;
  let cell = game.map.getCell(x, y);
  if (cell == null) return false;

  if (cell.objects.length) {
    return bump(object, x, y);
  }

  object.spriteOffsetX = object.x - x;
  object.spriteOffsetY = object.y - y;

  // If the object is moving horizontally, set facing
  if (x !== object.x) object.facing = x > object.x ? "right" : "left";

  tween(object, {
    spriteOffsetX: 0,
    spriteOffsetY: 0,
  }, {
    duration: 150,
    id: object.id,
    step: t => object.spriteOffsetZ = Math.sin(t * Math.PI) * 0.25,
    easing: easeInOut,
  });

  game.map.moveObject(object, x, y);
  return true;
}

export function bump(object: GameObject, x: number, y: number): boolean {
  object.spriteOffsetX = (x - object.x) / 2;
  object.spriteOffsetY = (y - object.y) / 2;

  tween(object, {
    spriteOffsetX: 0,
    spriteOffsetY: 0,
  }, {
    duration: 150,
    id: object.id,
    easing: easeInOut,
  });

  return false;
}
