import { start, draw } from "@danprince/games";
import { GameMap, Terrain } from "./map";
import * as sprites from "./sprites";
import { unit } from "./config";

declare global {
  const game: Game;

  interface Window {
    game: Game;
  }
}

let grass = new Terrain({
  sprites: [sprites.tile_grass_1, sprites.tile_grass_2],
});

class Game {
  map: GameMap;
  constructor() {
    this.map = new GameMap({ width: 10, height: 10, terrain: grass });
  }
}

function loop() {
  for (let y = 0; y < game.map.height; y++) {
    for (let x = 0; x < game.map.width; x++) {
      let cell = game.map.getCell(x, y)!;
      draw(cell.tile.sprite, x * unit, y * unit);
    }
  }
}

function init() {
  window.game = new Game();
  start({ loop });
}

init();
