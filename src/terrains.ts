import { Autotiling, Terrain } from "./game";
import * as sprites from "./sprites";

export let grass = new Terrain({
  sprites: [sprites.tile_grass_1, sprites.tile_grass_2],
  autotiling: Autotiling.Checkerboard,
});
