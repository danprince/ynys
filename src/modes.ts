import { pressed, tween } from "@danprince/games";
import { rest, moveTowards, moveBy } from "./actions";
import { keybindings } from "./config";
import { GameObject, Mode } from "./game";

export class DefaultMode extends Mode {
  update(): boolean {
    // Keyboard
    if (keybindings.down.some(pressed)) return moveBy(game.player, 0, 1);
    if (keybindings.left.some(pressed)) return moveBy(game.player, -1, 0);
    if (keybindings.right.some(pressed)) return moveBy(game.player, 1, 0);
    if (keybindings.up.some(pressed)) return moveBy(game.player, 0, -1);
    if (keybindings.rest.some(pressed)) return rest(game.player);
    if (keybindings.use.some(pressed)) return use(game.player);

    // Mouse
    if (pressed()) return moveTowards(game.player, game.cursor.x, game.cursor.y);

    return false;
  }
}

export class ThrowingMode extends Mode {
  constructor(private object: GameObject) {
    super();
  }

  update(): boolean {
    if (pressed()) {
      return this.throw(game.cursor.x, game.cursor.y);
    }

    if (keybindings.cancel.some(pressed)) {
      game.setMode(new DefaultMode);
      return false;
    }

    return false;
  }

  throw(x: number, y: number): boolean {
    game.block(async () => {
      if (game.player.holding === this.object) {
        game.player.holding = undefined;
      }

      game.map.spawn(this.object, x, y);
      this.object.spriteOffsetX = game.player.x - x;
      this.object.spriteOffsetY = game.player.y - y;

      await tween(
        this.object,
        { spriteOffsetX: 0, spriteOffsetY: 0 },
        { duration: 200 },
      );
    });

    game.setMode(new DefaultMode);

    return true;
  }
}

export function use(object: GameObject): boolean {
  if (!object.holding?.equipment) return false;
  object.holding.equipment.use?.();
  return true;
}
