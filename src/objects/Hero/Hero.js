import { GameObject } from "../../GameObject";
import { isSpaceFree } from "../../helpers/grid";
import { DOWN, LEFT, RIGHT, UP } from "../../Input";
import { Vector2 } from "../../Vector2";
import { walls } from "../../levels/level1";
import { Sprite } from "../../Sprite";
import { WALK_DOWN, WALK_LEFT, WALK_UP, WALK_RIGHT, STAND_DOWN, STAND_LEFT, STAND_UP, STAND_RIGHT, BASIC_ATTACK_DOWN, BASIC_ATTACK_UP, BASIC_ATTACK_LEFT, BASIC_ATTACK_RIGHT, LIGHT_UP_DOWN, LIGHT_UP_LEFT, LIGHT_UP_RIGHT, LIGHT_UP_UP } from "./heroAnimations";
import { FrameIndexPattern } from "../../frameIndexPattern";
import { Animations } from "../../Animations";
import { gridCells } from "../../helpers/grid";
import { resources } from "../../Resources";
import { moveTowards } from "../../helpers/moveTowards";
import { events } from "../../Events";
import { Howl } from "howler";


export class Hero extends GameObject {
    constructor(x, y) {
        super({
            position: new Vector2(x, y)
        })

        this.facingDirection = DOWN;
        this.destinationPosition = this.position.duplicate();
        this.footstep = new Howl({
          src: ['/audio/footstep.mp3'],
          loop: false,
          volume: 1,
        })

        this.pick_up_sound = new Howl({
          src: ['/audio/pick_up.mp3'],
          loop: false,
          volume: 1,
        })

        this.attack_sound = new Howl({
          src: ['/audio/punch.mp3'],
          loop: false,
          volume: 1
        })




        this.isAttacking = false;
        this.attackTime = 0;
        this.attackCooldown = 250;

        this.attackHitbox = {
          x: 0,
          y: 0,
           width: 391.875/2,
            height: 391.875,
          active: false
        };


        window.addEventListener("blur", () => {
          this.footstep.stop();
        });

        document.addEventListener("visibilitychange", () => {
          if (document.hidden) {
            this.footstep.stop();
          }
        });

        const shadow = new Sprite({
            resource: resources.images.shadow_basic,
            frameSize: new Vector2(183,105),
            position: new Vector2(13.0625*-3, -13.0625*4),
           
        })
        this.addChild(shadow);


        this.body = new Sprite({
          resource: resources.images.trash_warrior,
          frameSize: new Vector2(391.875,391.875),
          hFrames: 4,
          vFrames: 10,
          frame: 0,
          position: new Vector2(-195.9375 + 13.0625*4,-391.875 + 13.0625*3),
          animations: new Animations({
            walkdown: new FrameIndexPattern(WALK_DOWN),
            walkup: new FrameIndexPattern(WALK_UP),
            walkleft: new FrameIndexPattern(WALK_LEFT),
            walkright: new FrameIndexPattern(WALK_RIGHT),
            standdown: new FrameIndexPattern(STAND_DOWN),
            standup: new FrameIndexPattern(STAND_UP),
            standleft: new FrameIndexPattern(STAND_LEFT),
            standright: new FrameIndexPattern(STAND_RIGHT),
            basicAttackDown: new FrameIndexPattern(BASIC_ATTACK_DOWN),
            basicAttackUp: new FrameIndexPattern(BASIC_ATTACK_UP),
            basicAttackLeft: new FrameIndexPattern(BASIC_ATTACK_LEFT),
            basicAttackRight: new FrameIndexPattern(BASIC_ATTACK_RIGHT),
            lightUpDown: new FrameIndexPattern(LIGHT_UP_DOWN),
            lightUpUp: new FrameIndexPattern(LIGHT_UP_UP),
            lightUpLeft: new FrameIndexPattern(LIGHT_UP_LEFT),
            lightUpRight: new FrameIndexPattern(LIGHT_UP_RIGHT),

          })
        })


        this.addChild(this.body);

        this.itemPickupTime = 0;
        this.itemPickupShell = null;


        events.on("HERO_PICKS_UP_ITEM", this, data => {
          this.onPickUpItem(data)
        })

        this.health = 500;
    }

    step(delta, root) {

      if (this.itemPickupTime > 0) {
        this.workOnItemPickup(delta);
        return;
      }

      if (this.attackTime > 0) {
        this.workOnAttack(delta);
        return;
      }

if (root.input.attackPressed && this.attackTime <= 0) {

  root.input.attackPressed = false;

  this.startAttack();
  return;
}



        const distance = moveTowards(this, this.destinationPosition, 9)
        const hasArrived = distance <= 9;
        if (hasArrived) {
        this.tryMove(root)
        }


        this.tryEmitPosition()


    }


    tryEmitPosition() {

        if (this.lastX === this.position.x && this.lastY === this.position.y) {
            return;
        }

        this.lastX = this.position.x;
        this.lastY = this.position.y;

        events.emit("HERO_POSITION", this.position)
    }

    tryMove(root) {
        const {input} = root;

      if (!input.direction) {
        this.footstep.stop();
        if (this.facingDirection === LEFT) {this.body.animations.play("standleft")};
        if (this.facingDirection === RIGHT) {this.body.animations.play("standright")};
        if (this.facingDirection === UP) {this.body.animations.play("standup")};
        if (this.facingDirection === DOWN) {this.body.animations.play("standdown")};
      }
    
      let NextX = this.destinationPosition.x;
      let NextY = this.destinationPosition.y;
      const gridSize = 13.0625;
    
        if (input.direction === DOWN) {
        NextY += gridSize;
        this.body.animations.play("walkdown");
      }
        if (input.direction === UP) {
        NextY -= gridSize;
        this.body.animations.play("walkup");
      }
        if (input.direction === LEFT) {
        NextX -= gridSize;
        this.body.animations.play("walkleft");
      }
        if (input.direction === RIGHT) {
        NextX += gridSize;
        this.body.animations.play("walkright");
      }
      this.facingDirection = input.direction ?? this.facingDirection;
      
      if (!this.footstep.playing()) {
        this.footstep.play();
      }

      if (isSpaceFree(walls, NextX, NextY, gridSize)) {
    
    
    
    
        this.destinationPosition.x = NextX;
        this.destinationPosition.y = NextY;
      }
    }

    startAttack() {
if (this.attackTime > 0) return;
  this.footstep.stop();

  this.attackTime = this.attackCooldown;
  this.attackHitbox.active = true;

  const size = 26;

  this.attackHitbox.width = size;
  this.attackHitbox.height = size;

  if (this.facingDirection === DOWN) {
    this.body.animations.play("basicAttackDown");

    this.attackHitbox.x = this.position.x;
    this.attackHitbox.y = this.position.y + size;
  }

  if (this.facingDirection === UP) {
    this.body.animations.play("basicAttackUp");

    this.attackHitbox.x = this.position.x;
    this.attackHitbox.y = this.position.y - size;
  }

  if (this.facingDirection === LEFT) {
    this.body.animations.play("basicAttackLeft");

    this.attackHitbox.x = this.position.x - size;
    this.attackHitbox.y = this.position.y;
  }

  if (this.facingDirection === RIGHT) {
    this.body.animations.play("basicAttackRight");

    this.attackHitbox.x = this.position.x + size;
    this.attackHitbox.y = this.position.y;
  }

  if(!this.attack_sound.playing()) {
    this.attack_sound.play();
  }
const enemies = [window.enemy1];
enemies.forEach(enemy => {

  if (!enemy) return;

  if (
    this.attackHitbox.x < enemy.position.x + enemy.hitbox.width &&
    this.attackHitbox.x + this.attackHitbox.width > enemy.position.x &&
    this.attackHitbox.y < enemy.position.y + enemy.hitbox.height &&
    this.attackHitbox.y + this.attackHitbox.height > enemy.position.y
  ) {

    enemy.takeDamage(25);

  }

});
}

workOnAttack(delta) {

  this.attackTime -= delta;

  if (this.attackTime <= 0) {
    this.attackHitbox.active = false;

    if (this.facingDirection === LEFT) {
      this.body.animations.play("standleft");
    }

    if (this.facingDirection === RIGHT) {
      this.body.animations.play("standright");
    }

    if (this.facingDirection === UP) {
      this.body.animations.play("standup");
    }

    if (this.facingDirection === DOWN) {
      this.body.animations.play("standdown");
    }
  }
}

    workOnItemPickup(delta) {
      this.itemPickupTime -= delta;
        if (this.facingDirection === LEFT) {this.body.animations.play("lightUpLeft")};
        if (this.facingDirection === RIGHT) {this.body.animations.play("lightUpRight")};
        if (this.facingDirection === UP) {this.body.animations.play("lightUpUp")};
        if (this.facingDirection === DOWN) {this.body.animations.play("lightUpDown")};

        if (this.itemPickupTime <= 0) {
          this.itemPickupShell.destroy();
        }
    }

    onPickUpItem({ image, position}) {
      this.footstep.stop();

      if (!this.pick_up_sound.playing()) {
        this.pick_up_sound.play();
      }
      this.destinationPosition = position.duplicate();

      this.itemPickupTime = 500;

      this.itemPickupShell = new GameObject({});
      this.itemPickupShell.addChild(new Sprite({
        resource: image,
            frameSize: new Vector2(53, 106),
            position: new Vector2(13.0625*2, -106 - 13.0625*29)
      }))
      this.addChild(this.itemPickupShell);
    }
}