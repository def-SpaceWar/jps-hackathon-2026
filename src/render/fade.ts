import { runTimer } from "../loop";
import { canvas, ctx } from "./canvas";

export async function fadeOut(time = 1_000) {
    await runTimer(
        () => {
            ctx.fillStyle = `rgba(0, 0, 0, .05)`;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        },
        10,
        time / 10,
    ).finish;
}

export function fadeInLoop(start: number, time = 1_000, inOrOut: "in" | "out" = "in") {
    const percentage = Math.min((performance.now() - start) / time, 1);
    ctx.fillStyle = `rgba(0, 0, 0, ${inOrOut === "in" ? 1 - percentage : percentage})`;
    ctx.fillRect(-canvas.width, -canvas.height, 2 * canvas.width, 2 * canvas.height);
}
