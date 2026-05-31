import { ctx } from "./render/canvas";

export class Player {
    location: "hallway" | "oproom1" | "radiology" | "oproom2" = "hallway";
    x = -800;
    y = -95;
    width = 50;
    height = 150;

    constructor() {}

    render(dt: number) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.fillStyle = "red";
        ctx.fillRect(0, 0, this.width, this.height);
        ctx.restore();

        // animation manager or smth
    }

    setLocation(loc: typeof this.location) {
        this.x = -800;
        this.location = loc;
    }
}
