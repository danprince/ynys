import { tween } from "@danprince/games";
import { GameObject } from "./game";

export function moveBy(object: GameObject, dx: number, dy: number): boolean {
  return moveTo(object, object.x + dx, object.y + dy);
}

export function moveTo(object: GameObject, x: number, y: number): boolean {
  if (game.map.isOutOfBounds(x, y)) return false;
  let dx = (object.x - x);
  let dy = (object.y - y);

  object.spriteOffsetX = dx;
  object.spriteOffsetY = dy;

  tween(object, {
    spriteOffsetX: 0,
    spriteOffsetY: 0,
  }, {
    duration: 150,
    id: object.id,
    step: t => object.spriteOffsetZ = Math.sin(t * Math.PI) * 1,
  });

  game.map.moveObject(object, x, y);
  return true;
}
