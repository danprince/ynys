import { Sprite, PivotSprite, assert, Point } from "@danprince/games";
import { removeFromArray } from "./helpers";
import * as sprites from "./sprites";

export enum Tags {
  Mobile = "mobile",
  Occludes = "occludes",
}

export class GameObject {
  static counter=  0;
  id: number = GameObject.counter++;
  sprite: Sprite | PivotSprite = sprites.missing_sprite;
  tags = new Set<Tags>();
  x: number = 0;
  y: number = 0;
  facing: "left" | "right" = "left";
  spriteOffsetX: number = 0;
  spriteOffsetY: number = 0;
  spriteOffsetZ: number = 0;
}

export class Terrain {
  sprites: Sprite[];
  objects: GameObject[];

  constructor({
    sprites,
    objects = [],
  }: {
    sprites: Sprite[];
    objects?: GameObject[];
  }) {
    this.sprites = sprites;
    this.objects = objects;
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
  objects: GameObject[];

  constructor({ tile, objects = [] }: { tile: Tile; objects?: GameObject[] }) {
    this.tile = tile;
    this.objects = objects;
  }

  addObject(object: GameObject) {
    this.objects.push(object);
  }

  removeObject(object: GameObject) {
    removeFromArray(this.objects, object);
  }
}

export class GameMap {
  cells: Cell[] = [];
  width: number = 0;
  height: number = 0;

  constructor({
    width,
    height,
    terrain,
  }: {
    width: number;
    height: number;
    terrain: Terrain;
  }) {
    this.width = width;
    this.height = height;
    this.cells = Array.from({ length: width * height }).map(
      () => new Cell({ tile: new Tile({ terrain }) }),
    );
    this.autotile();
  }

  autotile() {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        let checker = x % 2 ? y % 2 : 1 - (y % 2);
        let cell = this.getCell(x, y);
        if (cell) cell.tile.sprite = cell.tile.terrain.sprites[checker];
      }
    }
  }

  isOutOfBounds(x: number, y: number): boolean {
    return x < 0 || y < 0 || x >= this.width || y >= this.height;
  }

  getCell(x: number, y: number): Cell | undefined {
    if (this.isOutOfBounds(x, y)) return;
    return this.cells[x + y * this.width];
  }

  spawn(object: GameObject, x: number = object.x, y: number = object.y) {
    this.moveObject(object, x, y);
  }

  despawn(object: GameObject) {
    let cell = this.getCell(object.x, object.y);
    assert(cell, `Cannot despawn object at: ${object.x}, ${object.y}`);
    cell.removeObject(object);
  }

  moveObject(object: GameObject, x: number, y: number) {
    let previousCell = this.getCell(object.x, object.y);
    let newCell = this.getCell(x, y);

    if (previousCell) {
      previousCell.removeObject(object);
    }

    assert(newCell, `Cannot spawn object into missing cell at: ${x}, ${y}`);

    object.x = x;
    object.y = y;
    newCell.addObject(object);
  }
}

export class Game {
  map: GameMap;
  player: GameObject;
  camera: Point = { x: 0, y: 0 };

  constructor({ map, player }: { map: GameMap; player: GameObject }) {
    this.map = map;
    this.player = player;
  }
}
