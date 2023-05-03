import { start, pressed, randomInt } from "@danprince/games";
import * as sprites from "./sprites";
import { keybindings } from "./config";
import { Game, Terrain, GameMap } from "./game";
import { Player, Roman, Tree } from "./objects";
import { moveBy } from "./actions";
import { render } from "./render";

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

function update() {
  updateCamera();

  let success = updatePlayer();

  if (success) {
    // TODO: Update other objects
  }
}

function updateCamera() {
  let { camera, player } = game;

  // Move camera to center on player
  camera.x = player.x + player.spriteOffsetX;
  camera.y = player.y + player.spriteOffsetY;
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

  let map = new GameMap({ width: 30, height: 30, terrain: grass });
  map.spawn(player, 5, 5);

  map.spawn(Roman(), randomInt(map.width), randomInt(map.height));

  for (let i = 0; i < 100; i++) {
    let tree = Tree();
    map.spawn(tree, randomInt(map.width), randomInt(map.height));
  }

  window.game = new Game({ map, player });

  // Aspect ratio tweaked slightly to be a perfect multiple of units
  start({ loop, width: 336, height: 192 });
}

init();
