export type SpriteSheet = {
    /** amount of sprites in a row */
    width: number;
    /** amount of sprites in a column */
    height: number;
    /** the image containing the sprites */
    image: HTMLImageElement;
    /** the width of a single sprite in pixels */
    spriteWidth: number;
    /** the height of a single sprite in pixels */
    spriteHeight: number;
    /** a mapping of animation names to arrays of sprite indices */
    animations: { [key: string]: number[] };
};
