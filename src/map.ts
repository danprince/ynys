import { Sprite } from "@danprince/games";

export class Terrain {
  sprites: Sprite[];

  constructor({ sprites }: { sprites: Sprite[] }) {
    this.sprites = sprites;
  }
}

export class Tile {
  terrain: Terrain;
  sprite: Sprite;

  constructor({ terrain }: { terrain: Terrain }) {
    this.terrain = terrain;
    this.sprite = terrain.sprites[0];
  }
}

export class Cell {
  tile: Tile;

  constructor({ tile }: { tile: Tile }) {
    this.tile = tile;
  }
}

export class GameMap {
  cells: Cell[] = [];
  width: number = 0;
  height: number = 0;

  constructor({ width, height, terrain }: { width: number, height: number, terrain: Terrain }) {
    this.width = width;
    this.height = height;
    this.cells = Array.from({ length: width * height }).map(
      () => new Cell({ tile: new Tile({ terrain }) }),
    );
  }

  isOutOfBounds(x: number, y: number): boolean {
    return x < 0 || y < 0 || x >= this.width || y >= this.height;
  }

  getCell(x: number, y: number): Cell | undefined {
    if (this.isOutOfBounds(x, y)) return;
    return this.cells[x + y * this.width];
  }
}
