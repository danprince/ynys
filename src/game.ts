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

  // Camera follows the offset properties
  spriteOffsetX: number = 0;
  spriteOffsetY: number = 0;

  // Camera ignores the bump properties
  spriteBumpX: number = 0;
  spriteBumpY: number = 0;
  spriteBumpZ: number = 0;
}

export class Terrain {
  sprites: Sprite[];

  constructor({
    sprites,
  }: {
    sprites: Sprite[];
  }) {
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
  objects: GameObject[] = [];
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
    this.objects.push(object);
  }

  despawn(object: GameObject) {
    let cell = this.getCell(object.x, object.y);
    assert(cell, `Cannot despawn object at: ${object.x}, ${object.y}`);
    cell.removeObject(object);
    removeFromArray(this.objects, object);
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

class BlockingActionQueue {
  private promises: Promise<any>[] = [];
  private onEmptyCallbacks: (() => void)[] = [];

  add(promise: Promise<any>) {
    this.promises.push(promise);
    promise.catch(console.error);
    promise.finally(() => this.remove(promise));
  }

  remove(promise: Promise<any>) {
    removeFromArray(this.promises, promise);
    if (this.isEmpty()) {
      this.onEmpty();
    }
  }

  isEmpty() {
    return this.promises.length === 0;
  }

  private onEmpty() {
    let callbacks = this.onEmptyCallbacks;
    this.onEmptyCallbacks = [];
    for (let callback of callbacks) {
      callback();
    }
  }

  waitUntilEmpty() {
    if (this.isEmpty()) return;
    return new Promise<void>(resolve => {
      this.onEmptyCallbacks.push(resolve);
    });
  }
}

export class Game {
  map: GameMap;
  player: GameObject;
  camera: Point = { x: 0, y: 0 };
  actionQueue = new BlockingActionQueue();

  constructor({ map, player }: { map: GameMap; player: GameObject }) {
    this.map = map;
    this.player = player;
  }

  /**
   * The game will block input until the returned promise has settled. This
   * is useful for preventing input during animations that need to block
   * before showing their consequences.
   */
  block(callback: () => Promise<any>) {
    this.actionQueue.add(callback());
  }
}
