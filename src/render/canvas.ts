import type { SpriteSheet } from "./animation";

export let canvas: HTMLCanvasElement;
export let ctx: CanvasRenderingContext2D;

export function initializeCanvas(parent: HTMLElement) {
    canvas = parent.appendChild(document.createElement("canvas"));
    ctx = canvas.getContext("2d")!;
    if (!ctx) {
        alert(
            "Rendering failed to initialized. (try using a browser that supports canvas2d)",
        );
    }
}

let canvasWidth = 1920;
export function setCanvasWidth(width: number) {
    canvasWidth = width;
}

export function autoResizeCanvas() {
    const resizeCanvas = () => {
        canvas.width = canvasWidth;
        canvas.height = window.innerHeight / window.innerWidth * canvasWidth;
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();
}

export function drawAnimSprite(
    spriteSheet: SpriteSheet,
    animationName: string,
    frameIndex: number,
    x: number,
    y: number,
    width: number,
    height: number,
) {
    const spriteNum = spriteSheet.animations[animationName][frameIndex];
    ctx.drawImage(
        spriteSheet.image,
        (spriteNum % spriteSheet.width) * spriteSheet.spriteWidth,
        Math.floor(spriteNum / spriteSheet.width) * spriteSheet.spriteHeight,
        spriteSheet.spriteWidth,
        spriteSheet.spriteHeight,
        x,
        y,
        width,
        height,
    );
}
