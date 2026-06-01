import { AudioManager } from "../audio";
import { canvasMousePos, isMouseDown } from "../input";

export interface ButtonOptions {
    x: number;
    y: number;
    width: number;
    height: number;
    text?: string;
    fillStyle?: string;
    textFillStyle?: string;
    fontSize?: number;
    fontFamily?: string;
    hoverFillStyle?: string;
    borderRadius?: number;
}

let wasMouseDownLastFrame = false;
let clickDetected = false;

/**
 * Reset click detection state at the start of each frame
 * Call this once at the beginning of your render loop
 */
export function resetClickDetection(): void {
    clickDetected = false;
}

/**
 * Update mouse state tracking at the end of frame
 * Call this once at the end of your render loop
 */
export function updateMouseState(): void {
    wasMouseDownLastFrame = isMouseDown;
}

/**
 * Render a button on canvas
 * @returns true if the button was just clicked (on mouse up)
 */
export function renderButton(
    ctx: CanvasRenderingContext2D,
    options: ButtonOptions,
): boolean {
    const {
        x,
        y,
        width,
        height,
        text = "",
        fillStyle = "#ccc",
        textFillStyle = "#000",
        fontSize = 16,
        fontFamily = "Arial",
        hoverFillStyle = "#aaa",
    } = options;

    // Check if mouse is over button
    const isHovering = canvasMousePos.x >= x - width / 2 &&
        canvasMousePos.x <= x + width / 2 &&
        canvasMousePos.y >= y - height / 2 &&
        canvasMousePos.y <= y + height / 2;

    // Detect click: mouse was down last frame, now it's up, and we haven't detected a click yet this frame
    const wasJustClicked = isHovering && wasMouseDownLastFrame &&
        !isMouseDown && !clickDetected;
    if (wasJustClicked) {
        clickDetected = true;
    }

    // Draw button background
    ctx.save();
    ctx.fillStyle = isHovering ? hoverFillStyle : fillStyle;
    if (isHovering && isMouseDown) {
        ctx.filter = "brightness(1.2)";
    }
    ctx.translate(x, y);
    ctx.fillRect(-width / 2, -height / 2, width, height);
    // Draw button text
    if (text) {
        ctx.fillStyle = textFillStyle;
        ctx.font = `${fontSize}px ${fontFamily}`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(text, 0, 0);
    }
    ctx.restore();

    if (wasJustClicked) AudioManager.play("click");
    return wasJustClicked;
}

/**
 * Check if a point is inside a button
 */
export function isPointInButton(
    point: { x: number; y: number },
    button: ButtonOptions,
): boolean {
    return (
        point.x >= button.x &&
        point.x <= button.x + button.width &&
        point.y >= button.y &&
        point.y <= button.y + button.height
    );
}

/**
 * Check if mouse is currently over a button
 */
export function isMouseOverButton(button: ButtonOptions): boolean {
    return isPointInButton(canvasMousePos, button);
}
