import { events } from "./Events";
import { GameObject } from "./GameObject";
import { Vector2 } from "./Vector2";

export class Camera extends GameObject {
  constructor() {
    super({});

    events.on("HERO_POSITION", this, (heroPosition) => {
      const personHalf = 13.0625 * 4;
      const canvasWidth = 1672;
      const canvasHeight = 941;
      const halfWidth = -personHalf + canvasWidth / 2;
      const halfHeight = canvasHeight / 2;
      this.position = new Vector2(
        -heroPosition.x + halfWidth,
        -heroPosition.y + halfHeight + 13.0625 * 10,
      );
    });
  }
}
