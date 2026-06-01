import type { SpriteSheet } from "./animation";
import { ctx, drawAnimSprite } from "./canvas";

export interface SpriteOptions {
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    animation?: string;
    frameDuration?: number;
    loop?: boolean;
}

export class Sprite {
    spriteSheet: SpriteSheet;
    x: number;
    y: number;
    width: number;
    height: number;
    animation: string;
    frameIndex: number;
    frameDuration: number;
    frameElapsed: number;
    loop: boolean;
    visible: boolean;

    constructor(spriteSheet: SpriteSheet, options: SpriteOptions = {}) {
        this.spriteSheet = spriteSheet;
        this.x = options.x ?? 0;
        this.y = options.y ?? 0;
        this.width = options.width ?? spriteSheet.spriteWidth;
        this.height = options.height ?? spriteSheet.spriteHeight;
        this.animation = options.animation ??
            Object.keys(spriteSheet.animations)[0] ?? "default";
        this.frameIndex = 0;
        this.frameDuration = options.frameDuration ?? 0.1;
        this.frameElapsed = 0;
        this.loop = options.loop ?? true;
        this.visible = true;
    }

    setPosition(x: number, y: number): this {
        this.x = x;
        this.y = y;
        return this;
    }

    setSize(width: number, height: number): this {
        this.width = width;
        this.height = height;
        return this;
    }

    setAnimation(
        name: string,
        options?: {
            resetFrame?: boolean;
            frameDuration?: number;
            loop?: boolean;
        },
    ): this {
        if (this.animation == name) return this;
        if (!this.spriteSheet.animations[name]) {
            throw new Error(
                `Animation '${name}' does not exist on sprite sheet.`,
            );
        }

        this.animation = name;
        if (options?.frameDuration !== undefined) {
            this.frameDuration = options.frameDuration;
        }
        if (options?.loop !== undefined) {
            this.loop = options.loop;
        }
        if (options?.resetFrame ?? true) {
            this.frameIndex = 0;
            this.frameElapsed = 0;
        }
        return this;
    }

    update(dt: number): void {
        if (!this.visible || this.frameDuration <= 0) {
            return;
        }

        const frames = this.spriteSheet.animations[this.animation];
        if (!frames || frames.length === 0) {
            return;
        }

        this.frameElapsed += dt;
        while (this.frameElapsed >= this.frameDuration) {
            this.frameElapsed -= this.frameDuration;
            this.frameIndex += 1;
            if (this.frameIndex >= frames.length) {
                if (this.loop) {
                    this.frameIndex = 0;
                } else {
                    this.frameIndex = frames.length - 1;
                    break;
                }
            }
        }
    }

    render(flipped = false): void {
        if (!this.visible) {
            return;
        }

        const frames = this.spriteSheet.animations[this.animation];
        if (!frames || frames.length === 0) {
            return;
        }

        ctx.save();
        ctx.scale(flipped ? -1 : 1, 1);
        ctx.translate(this.x, this.y);
        drawAnimSprite(
            this.spriteSheet,
            this.animation,
            this.frameIndex,
            0,
            0,
            this.width,
            this.height,
        );
        ctx.restore();
    }
}
