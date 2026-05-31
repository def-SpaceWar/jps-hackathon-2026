export const keys = new Set<string>();
export const mousePos = { x: 0, y: 0 };
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
    },
    listenMDown = (_: MouseEvent) => {
        isMouseDown = true;
    },
    listenMUp = (_: MouseEvent) => {
        isMouseDown = false;
    };

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
    document.addEventListener("mousemove", listenMMove);
    document.addEventListener("mousedown", listenMDown);
    document.addEventListener("mouseup", listenMUp);
    keys.clear();
}