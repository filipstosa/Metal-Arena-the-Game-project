import { events } from "../../Events";
import { GameObject } from "../../GameObject";
import { resources } from "../../Resources";
import { Sprite } from "../../Sprite";
import { Vector2 } from "../../Vector2";

export class Inventory extends GameObject {
    constructor() {
        super({
            position: new Vector2(13.0625*2, 13.0625*2)
        });

        this.nextId = 0;

        this.items = [
            {
                id: -1,
                image: resources.images.key,
            },

                        {
                id: -2,
                image: resources.images.key,
            }
        ]

        events.on("HERO_PICKS_UP_ITEM", this, data => {
            this.nextId += 1;
            this.items.push({
                id: this.nextId,
                image: resources.images.key
            })

            this.renderInventory();
        })

        this.renderInventory();
    }

    renderInventory() {
            this.children.forEach(child => child.destroy())
        
        
        this.items.forEach((item, index) => {
            const sprite = new Sprite({
            resource: item.image,
            frameSize: new Vector2(53, 106),
            position: new Vector2(index*79, 0)
        })

        this.addChild(sprite);
        })
    }

    removeFromInventory(id) {
        this.items = this.items.filter(item => item.id !== id);
        this.renderInventory();
    }
}