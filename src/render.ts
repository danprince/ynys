import { Rectangle, canvas, clamp, clear, view, draw, end, ctx, drawFlipped, Point, Sprite, pointer } from "@danprince/games";
import { unit } from "./config";
import { GameObject, Tags } from "./game";
import * as sprites from "./sprites";
import { lerp } from "./helpers";

export function getViewport(): Rectangle {
  let { camera, map } = game;

  let w = Math.ceil(canvas.width / unit);
  let h = Math.ceil(canvas.height / unit);
  let x = camera.x - w / 2;
  let y = camera.y - h / 2;

  // Prevent viewport from going outside map bounds
  x = clamp(0, map.width - w, x);
  y = clamp(0, map.height - h, y);

  // Render outside the visible area so that camera tweens are smooth. There
  // are quite a few "tall" objects, like trees, so render a few extra rows
  // vertically to prevent objects suddenly appearing.
  w = w + 1;
  h = h + 3;

  return { x, y, w, h };
}

export function getLogicalViewport(): Rectangle {
  let { x, y, w, h } = getViewport();
  return { x: Math.floor(x), y: Math.floor(y), w, h };
}

export function screenToWorld(x: number, y: number): Point {
  let gridX = x / unit;
  let gridY = y / unit;
  let viewport = getViewport();
  return {
    x: Math.floor(gridX + viewport.x),
    y: Math.floor(gridY + viewport.y),
  };
}

export function worldToScreen(x: number, y: number): Point {
  let viewport = getViewport();
  return {
    x: (x + viewport.x) * unit,
    y: (y + viewport.y) * unit,
  };
}

export function render() {
  let offset = getViewport();
  let viewport = getLogicalViewport();

  clear();

  view(Math.floor(-offset.x * unit), Math.floor(-offset.y * unit));

  for (let y = viewport.y; y < viewport.y + viewport.h; y++) {
    for (let x = viewport.x; x < viewport.x + viewport.w; x++) {
      let cell = game.map.getCell(x, y);
      if (cell == null) continue;
      draw(cell.tile.sprite, x * unit, y * unit);
    }
  }

  for (let y = viewport.y; y < viewport.y + viewport.h; y++) {
    for (let x = viewport.x; x < viewport.x + viewport.w; x++) {
      let cell = game.map.getCell(x, y)!;
      if (cell == null) continue;

      for (let object of cell.objects) {
        renderObject(object);
      }
    }
  }

  end();
}

function drawDottedLine(p1: Point, p2: Point) {
  let x1 = p1.x + 0.5;
  let y1 = p1.y + 0.5;
  let x2 = p2.x + 0.5;
  let y2 = p2.y + 0.5;
  let numberOfDots = Math.abs(p2.x - p1.x) + Math.abs(p2.y - p1.y);

  for (let i = 1; i <= numberOfDots; i++) {
    draw(
      sprites.ui_targeting_dot,
      lerp(x1, x2, i / numberOfDots) * unit - 2,
      lerp(y1, y2, i / numberOfDots) * unit - 2,
    );
  }
}

function getCursorPosition() {
  let { x, y } = pointer();
  return screenToWorld(x, y);
}

function renderObject(object: GameObject) {
  // Get the center of the tile
  let tileCenterX = (object.x + 0.5) * unit;
  let tileCenterY = (object.y + 0.5) * unit;

  // The default pivot of a sprite is the bottom center
  let pivotX = object.sprite.w / 2;
  let pivotY = object.sprite.h;

  // Use a predefined pivot if the sprite has one
  if ("pivot" in object.sprite) {
    pivotX = object.sprite.pivot.x;
    pivotY = object.sprite.pivot.y;
  }

  // Account for sprite's visual offset during tweens etc
  let offsetX = (object.spriteOffsetX + object.spriteBumpX)* unit;
  let offsetY = (object.spriteOffsetY + object.spriteBumpY) * unit;
  let offsetZ = object.spriteBumpZ * unit;

  let spriteX = tileCenterX - pivotX + offsetX;
  let spriteY = tileCenterY - pivotY + offsetY - offsetZ;

  if (object.tags.has(Tags.Mobile)) {
    let shadowX = tileCenterX - sprites.shadow.w / 2 + offsetX;
    let shadowY = tileCenterY - sprites.shadow.h / 2 + offsetY;
    draw(sprites.shadow, shadowX, shadowY);
  }

  ctx.save();
  if (object.tags.has(Tags.Occludes)) {
    let occludedCell = game.map.getCell(object.x, object.y - 1);
    if (occludedCell?.objects.some(object => object.tags.has(Tags.Mobile))) {
      ctx.globalAlpha = 0.5;
    }
  }

  drawFlipped(object.sprite, spriteX, spriteY, object.facing === "left", false);
  ctx.restore();
}
