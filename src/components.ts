import { GameObject } from "./game";

export abstract class Component {
  object: GameObject;

  constructor(object: GameObject) {
    this.object = object;
  }
}

export class Vitality extends Component {
  hp: number = 1;

  constructor(object: GameObject, { hp }: { hp: number }) {
    super(object);
    this.hp = hp;
  }

  damage(amount: number) {
    this.hp = Math.max(0, this.hp - amount);

    if (this.hp <= 0) {
      game.map.despawn(this.object);
    }
  }
}

export class Equipment extends Component {
  use?: () => void;
  bump?: (x: number, y: number) => void;
}
