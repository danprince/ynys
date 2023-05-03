import { start, draw, down, pressed, clear, drawFlipped, randomInt, ctx, bounds, Rectangle, clamp, canvas, view, end, Point, local, pointer } from "@danprince/games";
import * as sprites from "./sprites";
import { keybindings, unit } from "./config";
import { Game, GameObject, Terrain, GameMap, Tags } from "./game";
import { Player, Tree } from "./objects";
import { moveBy, moveTo } from "./actions";

declare global {
  const game: Game;

  interface Window {
    game: Game;
  }
}

let grass = new Terrain({
  sprites: [sprites.tile_grass_1, sprites.tile_grass_2],
});

function loop() {
  update();
  render();
}

function render() {
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
  let offsetX = object.spriteOffsetX * unit;
  let offsetY = object.spriteOffsetY * unit;
  let offsetZ = object.spriteOffsetZ * unit;

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

function update() {
  updateCamera();

  if (pressed()) {
    let p = pointer();
    console.log(screenToWorld(p.x, p.y));
  }

  let success = updatePlayer();

  if (success) {
    // TODO: Update other objects
  }
}

function getViewport(): Rectangle {
  let { camera, map } = game;

  let w = Math.ceil(canvas.width / unit);
  let h = Math.ceil(canvas.height / unit);
  let x = camera.x - w / 2;
  let y = camera.y - h / 2;

  // Prevent viewport from going outside map bounds
  x = clamp(0, map.width - w, x);
  y = clamp(0, map.height - h, y);

  // Render outside the visible area so that camera tweens are smooth
  w = w + 1;
  h = h + 1;

  return { x, y, w, h };
}

function getLogicalViewport(): Rectangle {
  let { x, y, w, h } = getViewport();
  return { x: Math.floor(x), y: Math.floor(y), w, h };
}

function updateCamera() {
  let { camera, player } = game;

  // Move camera to center on player
  camera.x = player.x + player.spriteOffsetX;
  camera.y = player.y + player.spriteOffsetY;
  camera.x
}

function updatePlayer(): boolean {
  if (keybindings.down.some(pressed)) return moveBy(game.player, 0, 1);
  if (keybindings.left.some(pressed)) return moveBy(game.player, -1, 0);
  if (keybindings.right.some(pressed)) return moveBy(game.player, 1, 0);
  if (keybindings.up.some(pressed)) return moveBy(game.player, 0, -1);
  return false;
}

function screenToWorld(x: number, y: number): Point {
  let gridX = x / unit;
  let gridY = y / unit;
  let viewport = getViewport();
  return {
    x: Math.floor(gridX + viewport.x),
    y: Math.floor(gridY + viewport.y),
  };
}

function worldToScreen(x: number, y: number): Point {
  let viewport = getViewport();
  return {
    x: (x + viewport.x) * unit,
    y: (y + viewport.y) * unit,
  };
}

function init() {
  let player = Player();

  let map = new GameMap({ width: 30, height: 30, terrain: grass });
  map.spawn(player, 5, 5);

  for (let i = 0; i < 10; i++) {
    let tree = Tree();
    map.spawn(tree, randomInt(map.width), randomInt(map.height));
  }

  window.game = new Game({ map, player });

  // Aspect ratio tweaked slightly to be a perfect multiple of units
  start({ loop, width: 336, height: 192 });
}

init();
