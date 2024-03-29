import { start, randomInt, randomElement, pointer } from "@danprince/games";
import * as sprites from "./sprites";
import { Game, GameMap, Tags, Decoration } from "./game";
import { Player, Rock, Roman, Stone, Tree } from "./objects";
import { moveBy } from "./actions";
import { render, screenToWorld } from "./render";
import { cardinalDirections } from "./helpers";
import { grass } from "./terrains";
import { DefaultMode } from "./modes";

declare global {
  const game: Game;

  interface Window {
    game: Game;
  }
}

function loop() {
  update();
  render();
}

async function update() {
  updateCamera();
  updateCursor();

  if (game.actionQueue.isEmpty()) {
    let success = game.mode.update();

    // Wait for any consequential blocking animations to be done before
    // updating the other enemies.
    await game.actionQueue.waitUntilEmpty();

    if (success) {
      updateNonPlayerObjects();
    }
  }
}

function updateCursor() {
  let { x, y } = pointer();
  game.cursor = screenToWorld(x, y);
}

function updateCamera() {
  let { camera, player } = game;

  // Move camera to center on player
  camera.x = player.x + player.spriteOffsetX;
  camera.y = player.y + player.spriteOffsetY;
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

  map.spawn(Stone(), randomInt(map.width), randomInt(map.height));
  map.spawn(Stone(), randomInt(map.width), randomInt(map.height));
  map.spawn(Stone(), randomInt(map.width), randomInt(map.height));
  map.spawn(Stone(), randomInt(map.width), randomInt(map.height));

  for (let i = 0; i < 100; i++) {
    let cell = randomElement(map.cells);
    if (cell?.isEmpty()) {
      map.spawn(Tree(), cell.x, cell.y);
    }
  }

  for (let i = 0; i < 20; i++) {
    let cell = randomElement(map.cells);
    if (cell?.isEmpty()) {
      map.spawn(Rock(), cell.x, cell.y);
    }
  }

  for (let i = 0; i < 1000; i++) {
    let cell = randomElement(map.cells);

    cell.addDecoration(new Decoration({
      sprite: randomElement([
        sprites.decoration_grass_1, sprites.decoration_grass_2, sprites.decoration_grass_2, sprites.decoration_grass_1, sprites.decoration_grass_4,
        sprites.decoration_grass_5, sprites.decoration_grass_6, sprites.decoration_grass_7, sprites.decoration_grass_8, sprites.decoration_grass_9,
      ]),
    }));
  }

  let mode = new DefaultMode();

  window.game = new Game({ map, player, mode });

  // Aspect ratio tweaked slightly to be a perfect multiple of units
  start({ loop, width: 336, height: 192 });
}

init();
