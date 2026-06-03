import { GameObject } from "../../GameObject.js";
import { Vector2 } from "../../Vector2.js";
import { Sprite } from "../../Sprite.js";
import { resources } from "../../Resources.js";
import { events } from "../../Events.js";

export class Key extends GameObject {
  constructor(x, y) {
    super({
      position: new Vector2(x, y),
    });

    const shadow_key = new Sprite({
      resource: resources.images.shadow_items,
      frameSize: new Vector2(80, 41),
      position: new Vector2(-13.0625 * 5, 0),
    });
    this.addChild(shadow_key);

    const sprite = new Sprite({
      resource: resources.images.key,
      frameSize: new Vector2(53, 106),
      position: new Vector2(-53, -106),
    });
    this.addChild(sprite);
  }

  ready() {
    events.on("HERO_POSITION", this, (pos) => {
      const roundedHeroX = Math.round(pos.x);
      const roundedHeroY = Math.round(pos.y);
      if (
        roundedHeroX >= this.position.x - 13.0625 * 8 &&
        roundedHeroX <= this.position.x + 13.0625 * 8 &&
        roundedHeroY >= this.position.y - 13.0625 * 8 &&
        roundedHeroY <= this.position.y + 13.0625 * 8
      ) {
        this.onCollideWithHero();
      }
    });
  }

  onCollideWithHero() {
    this.destroy();

    events.emit("HERO_PICKS_UP_ITEM", {
      image: resources.images.key,
      position: this.position,
    });
  }
}
