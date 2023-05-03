import { start, draw, down, pressed, clear, drawFlipped, randomInt, ctx } from "@danprince/games";
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
  clear();

  for (let y = 0; y < game.map.height; y++) {
    for (let x = 0; x < game.map.width; x++) {
      let cell = game.map.getCell(x, y)!;
      draw(cell.tile.sprite, x * unit, y * unit);
    }
  }

  for (let y = 0; y < game.map.height; y++) {
    for (let x = 0; x < game.map.width; x++) {
      let cell = game.map.getCell(x, y)!;

      for (let object of cell.objects) {
        renderObject(object);
      }
    }
  }
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
  let success = updatePlayer();
  if (success) {
    // TODO: Update other objects
  }
}

function updatePlayer(): boolean {
  if (keybindings.down.some(pressed)) return moveBy(game.player, 0, 1);
  if (keybindings.left.some(pressed)) return moveBy(game.player, -1, 0);
  if (keybindings.right.some(pressed)) return moveBy(game.player, 1, 0);
  if (keybindings.up.some(pressed)) return moveBy(game.player, 0, -1);
  return false;
}

function init() {
  let player = Player();

  let map = new GameMap({ width: 10, height: 10, terrain: grass });
  map.spawn(player, 5, 5);

  for (let i = 0; i < 10; i++) {
    let tree = Tree();
    map.spawn(tree, randomInt(map.width), randomInt(map.height));
  }

  window.game = new Game({ map, player });

  start({ loop });
}

init();
