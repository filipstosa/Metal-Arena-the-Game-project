class Resources {
  constructor() {
    this.toLoad = {
      trash_warrior: "/sprites/hero.png",
      shadow_basic: "/sprites/shadow-basic.png",
      sky: "/sprites/sky.png",
      map: "/sprites/map.png",
      key: "/sprites/pixel key.png",
      shadow_items: "sprites/shadow_items.png",
      enemy_basic: "sprites/enemy_basic.png",
    };

    this.images = {};

    Object.keys(this.toLoad).forEach((key) => {
      const img = new Image();
      img.src = this.toLoad[key];
      this.images[key] = {
        image: img,
        isLoaded: false,
      };
      img.onload = () => {
        this.images[key].isLoaded = true;
      };
    });
  }
}

export const resources = new Resources();
