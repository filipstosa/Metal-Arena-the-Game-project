import "./style.css";
import { setupCounter } from "./counter.js";
import { resources } from "./src/Resources.js";
import { Sprite } from "./src/Sprite.js";
import { Vector2 } from "./src/Vector2.js";
import { GameLoop } from "./src/GameLoop.js";
import { Input } from "./src/Input.js";
import { LEFT } from "./src/Input.js";
import { RIGHT } from "./src/Input.js";
import { UP } from "./src/Input.js";
import { DOWN } from "./src/Input.js";
import { gridCells, isSpaceFree } from "./src/helpers/grid.js";
import { moveTowards } from "./src/helpers/moveTowards.js";
import { walls } from "./src/levels/level1.js";
import { Animations } from "./src/Animations.js";
import { STAND_DOWN } from "./src/objects/Hero/heroAnimations.js";
import { STAND_UP } from "./src/objects/Hero/heroAnimations.js";
import { STAND_LEFT } from "./src/objects/Hero/heroAnimations.js";
import { STAND_RIGHT } from "./src/objects/Hero/heroAnimations.js";
import { WALK_DOWN } from "./src/objects/Hero/heroAnimations.js";
import { WALK_UP } from "./src/objects/Hero/heroAnimations.js";
import { WALK_LEFT } from "./src/objects/Hero/heroAnimations.js";
import { WALK_RIGHT } from "./src/objects/Hero/heroAnimations.js";
import { BASIC_ATTACK_DOWN } from "./src/objects/Hero/heroAnimations.js";
import { BASIC_ATTACK_LEFT } from "./src/objects/Hero/heroAnimations.js";
import { BASIC_ATTACK_UP } from "./src/objects/Hero/heroAnimations.js";
import { BASIC_ATTACK_RIGHT } from "./src/objects/Hero/heroAnimations.js";
import { FrameIndexPattern } from "./src/frameIndexPattern.js";
import { GameObject } from "./src/GameObject.js";
import { Hero } from "./src/objects/Hero/Hero.js";
import { events } from "./src/Events.js";
import { Camera } from "./src/Camera.js";
import { Key } from "./src/objects/Key/Key.js";
import { Inventory } from "./src/objects/Inventory/Inventory.js";
import { Howl, Howler } from "howler";
import { Enemy } from "./src/objects/Enemy/Enemy.js";

Howler.autoSuspend = false;

window.addEventListener("click", unlockAudio, { once: true });
window.addEventListener("keydown", unlockAudio, { once: true });

function unlockAudio() {
  if (Howler.ctx && Howler.ctx.state !== "running") {
    Howler.ctx.resume();
  }
}

document.querySelector("#app").innerHTML = ``;
const canvas = document.querySelector("#game-canvas");
const ctx = canvas.getContext("2d");

const mainScene = new GameObject({
  position: new Vector2(0, 0),
});

const main_music = new Howl({
  src: ["/audio/main_bg_music.mp3"],
  loop: true,
  volume: 0.0,
});

const main_ambience = new Howl({
  src: ["/audio/main_bg_ambience.mp3"],
  loop: true,
  volume: 1,
});

const skySprite = new Sprite({
  resource: resources.images.sky,
  frameSize: new Vector2(1920, 1080),
});

const mapSprite = new Sprite({
  resource: resources.images.map,
  frameSize: new Vector2(3345, 3608),
});

mainScene.addChild(mapSprite);

const hero = new Hero(gridCells(8 * 6), gridCells(8 * 4));
mainScene.addChild(hero);

const enemy1 = new Enemy({
  x: gridCells(8 * 18),
  y: gridCells(8 * 4),
  target: hero,
});
window.enemy1 = enemy1;
mainScene.addChild(enemy1);

const camera = new Camera();
mainScene.addChild(camera);

const key = new Key(gridCells(8 * 11), gridCells(8 * 6));
mainScene.addChild(key);

const inventory = new Inventory();

mainScene.input = new Input();

const update = (delta) => {
  mainScene.stepEntry(delta, mainScene);
};

const draw = () => {
  if (!main_music.playing()) {
    main_music.play();
  }
  if (!main_ambience.playing()) {
    main_ambience.play();
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  skySprite.drawImage(ctx, 0, 0);

  ctx.save();

  ctx.translate(camera.position.x, camera.position.y);

  mainScene.draw(ctx, 0, 0);

  ctx.restore();

  inventory.draw(ctx, 0, 0);
};

const gameLoop = new GameLoop(update, draw);

gameLoop.start();
