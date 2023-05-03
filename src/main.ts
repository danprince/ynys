import { start, draw } from "@danprince/games";
import * as sprites from "./sprites";
import { unit } from "./config";
import { Game, GameObject, Terrain, GameMap } from "./game";

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
  for (let y = 0; y < game.map.height; y++) {
    for (let x = 0; x < game.map.width; x++) {
      let cell = game.map.getCell(x, y)!;
      draw(cell.tile.sprite, x * unit, y * unit);
      for (let object of cell.objects) {
        draw(object.sprite, x * unit, y * unit);
      }
    }
  }
}

function init() {
  let player = new GameObject();
  player.sprite = sprites.mob_druid_idle_1;

  let map = new GameMap({ width: 10, height: 10, terrain: grass });
  map.spawn(player, 5, 5);

  window.game = new Game({ map });

  start({ loop });
}

init();
