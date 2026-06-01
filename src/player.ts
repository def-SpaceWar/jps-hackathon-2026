import type { SpriteSheet } from "./render/animation";
import { ctx } from "./render/canvas";
import { ImageManager } from "./render/image";
import { Sprite } from "./render/sprite";
import playerUrl from "./assets/player.png";

const image = await ImageManager.preload(playerUrl);

export class Player {
    location: "hallway" | "oproom1" | "radiology" | "oproom2" = "hallway";
    x = -800;
    y = -95;
    width = 50;
    height = 150;
    spritesheet: SpriteSheet = {
        image,
        spriteWidth: 400,
        spriteHeight: 225,
        animations: {
            default: [0],
            walk: [
                0,
                1,
                2,
                3,
                4,
                5,
                6,
                7,
                8,
                9,
                10,
                11,
                12,
                13,
                14,
                15,
                16,
                17,
                18,
                19,
                20,
                21,
                22,
                23,
                24,
            ],
        },
        width: 6,
        height: 6,
    };
    sprite = new Sprite(this.spritesheet, {
        x: -165,
        y: -20,
        width: 180 * 16 / 9,
        height: 180,
        animation: "walk",
        frameDuration: 1 / 32,
    });
    right = true;

    constructor() {}

    render(dt: number) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.fillStyle = "red";
        this.sprite.update(dt);
        this.sprite.render(!this.right);
        ctx.restore();
    }

    setLocation(loc: typeof this.location) {
        switch (this.location) {
            case "oproom1":
                this.x = -800;
                break;
            case "radiology":
                this.x = 0;
                break;
            case "oproom2":
                this.x = 750;
                break;
        }
        this.location = loc;
    }
}
