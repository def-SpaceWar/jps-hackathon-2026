import { canvas } from "./render/canvas";

export const keys = new Set<string>();
export const mousePos = { x: 0, y: 0 };
export const canvasMousePos = { x: 0, y: 0 };
export let isMouseDown = false;

const listenDown = (e: KeyboardEvent) => {
        keys.add(e.key);
    },
    listenUp = (e: KeyboardEvent) => {
        keys.delete(e.key);
    },
    listenMMove = (e: MouseEvent) => {
        mousePos.x = e.clientX;
        mousePos.y = e.clientY;
        updateCanvasMousePos();
    },
    listenMDown = (_: MouseEvent) => {
        isMouseDown = true;
    },
    listenMUp = (_: MouseEvent) => {
        isMouseDown = false;
    };

/**
 * Convert viewport mouse coordinates to canvas coordinates
 * Accounts for canvas position, size, and scale
 */
function updateCanvasMousePos() {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    canvasMousePos.x = (mousePos.x - rect.left) * scaleX - canvas.width / 2;
    canvasMousePos.y = (mousePos.y - rect.top) * scaleY - canvas.height / 2;
}

/**
 * Convert any viewport coordinates to canvas coordinates
 */
export function viewportToCanvas(viewportX: number, viewportY: number): { x: number; y: number } {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
        x: (viewportX - rect.left) * scaleX,
        y: (viewportY - rect.top) * scaleY,
    };
}

export function listenInput() {
    document.addEventListener("keydown", listenDown);
    document.addEventListener("keyup", listenUp);
    document.addEventListener("mousemove", listenMMove);
    document.addEventListener("mousedown", listenMDown);
    document.addEventListener("mouseup", listenMUp);
}

export function stopInput() {
    document.removeEventListener("keydown", listenDown);
    document.removeEventListener("keyup", listenUp);   
    document.removeEventListener("mousemove", listenMMove);
    document.removeEventListener("mousedown", listenMDown);
    document.removeEventListener("mouseup", listenMUp);
    keys.clear();
}