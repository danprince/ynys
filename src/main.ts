import { start, pressed, randomInt, randomElement } from "@danprince/games";
import * as sprites from "./sprites";
import { keybindings } from "./config";
import { Game, Terrain, GameMap, Tags } from "./game";
import { Player, Roman, Tree } from "./objects";
import { moveBy, rest } from "./actions";
import { render } from "./render";
import { cardinalDirections } from "./helpers";

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
    updateNonPlayerObjects();
  }
}

function updateCamera() {
  let { camera, player } = game;

  // Move camera to center on player
  camera.x = player.x;
  camera.y = player.y;

  // If the camera isn't stabilised, move it with the player's motion
  if (!camera.stable) {
    camera.x += player.spriteOffsetX;
    camera.y += player.spriteOffsetY;
  }
}

function updatePlayer(): boolean {
  if (keybindings.down.some(pressed)) return moveBy(game.player, 0, 1);
  if (keybindings.left.some(pressed)) return moveBy(game.player, -1, 0);
  if (keybindings.right.some(pressed)) return moveBy(game.player, 1, 0);
  if (keybindings.up.some(pressed)) return moveBy(game.player, 0, -1);
  if (keybindings.rest.some(pressed)) return rest(game.player);
  return false;
}

function updateNonPlayerObjects() {
  for (let object of game.map.objects) {
    if (object === game.player) continue;
    if (object.tags.has(Tags.Mobile)) {
      let [x, y] = randomElement(cardinalDirections);
      moveBy(object, x, y);
    }
  }
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
