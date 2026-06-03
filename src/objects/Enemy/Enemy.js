import { GameObject } from "../../GameObject";
import { resources } from "../../Resources";
import { Sprite } from "../../Sprite";
import { Vector2 } from "../../Vector2";

export class Enemy extends GameObject {
  constructor(config) {
    super(config);

    this.position = new Vector2(config.x, config.y);

    this.speed = 4;
    this.health = 100;
    this.damage = 10;

    this.hitbox = {
      width: 391.875 / 2,
      height: 391.875,
    };

    this.detectionRange = 13.0625 * 8 * 7;
    this.attackRange = 40;
    this.attackCooldown = 1000;
    this.lastAttackTime = 0;
    this.target = config.target;

    const shadow = new Sprite({
      resource: resources.images.shadow_basic,
      frameSize: new Vector2(183, 105),
      position: new Vector2(13.0625 * -9, -13.0625 * 5),
    });
    this.addChild(shadow);

    this.body = new Sprite({
      resource: resources.images.enemy_basic,
      frameSize: new Vector2(391.875, 391.875),
      hFrames: 4,
      vFrames: 10,
      frame: 0,
      position: new Vector2(-195.9375 + 13.0625 * 4, -391.875 + 13.0625 * 3),
    });

    this.addChild(this.body);
  }

  step(delta, root) {
    if (this.dead) return;
    if (!this.target) return;

    const dx = this.target.position.x - this.position.x;
    const dy = this.target.position.y - this.position.y;

    const distance = Math.hypot(dx, dy);

    if (distance < this.detectionRange && distance > this.attackRange) {
      const angle = Math.atan2(dy, dx);

      this.position.x += Math.cos(angle) * this.speed;
      this.position.y += Math.sin(angle) * this.speed;
    }

    if (distance <= this.attackRange) {
      const now = Date.now();

      if (now - this.lastAttackTime > this.attackCooldown) {
        this.attack();

        this.lastAttackTime = now;
      }
    }
  }

  attack() {
    console.log("Enemy attacked player");

    if (this.target.health !== undefined) {
      this.target.health -= this.damage;

      console.log("Player HP:", this.target.health);
    }
  }

  takeDamage(amount) {
    this.health -= amount;

    console.log("Enemy HP:", this.health);

    if (this.health <= 0) {
      this.health = 0;

      console.log("Enemy died");

      this.destroy();
    }
  }
}
