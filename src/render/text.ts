export interface TextOptions {
    x?: number;
    y?: number;
    fontSize?: number;
    fontFamily?: string;
    fillStyle?: string;
    textAlign?: CanvasTextAlign;
    textBaseline?: CanvasTextBaseline;
    lineHeight?: number;
    maxWidth?: number;
}

export interface AnimatedTextOptions extends TextOptions {
    duration?: number;
    easing?: (t: number) => number;
    onComplete?: () => void;
}

export interface TypingTextOptions extends AnimatedTextOptions {
    speed?: number; // characters per second
    lineHeight?: number;
}

export const TextRenderer = {
    draw(
        ctx: CanvasRenderingContext2D,
        text: string,
        options: TextOptions = {}
    ): void {
        const {
            x = 0,
            y = 0,
            fontSize = 16,
            fontFamily = "Arial",
            fillStyle = "black",
            textAlign = "left",
            textBaseline = "top",
            maxWidth,
        } = options;

        ctx.save();
        ctx.font = `${fontSize}px ${fontFamily}`;
        ctx.fillStyle = fillStyle;
        ctx.textAlign = textAlign;
        ctx.textBaseline = textBaseline;

        if (maxWidth) {
            ctx.fillText(text, x, y, maxWidth);
        } else {
            ctx.fillText(text, x, y);
        }
        ctx.restore();
    },

    drawMultiline(
        ctx: CanvasRenderingContext2D,
        text: string,
        options: TextOptions = {}
    ): void {
        const {
            x = 0,
            y = 0,
            fontSize = 16,
            fontFamily = "Arial",
            fillStyle = "black",
            textAlign = "left",
            textBaseline = "top",
            lineHeight = fontSize * 1.2,
            maxWidth,
        } = options as TextOptions;

        const lines = text.split("\n");
        lines.forEach((line, index) => {
            TextRenderer.draw(ctx, line, {
                x,
                y: y + index * lineHeight,
                fontSize,
                fontFamily,
                fillStyle,
                textAlign,
                textBaseline,
                maxWidth,
            });
        });
    },

    typeText(
        ctx: CanvasRenderingContext2D,
        text: string,
        options: TypingTextOptions = {}
    ): Promise<void> {
        return new Promise((resolve) => {
            const {
                duration,
                speed = 50,
                onComplete,
            } = options;
            const lineHeight = options.lineHeight ?? (options.fontSize ? options.fontSize * 1.2 : 19.2);

            const renderOptions = {
                ...options,
                lineHeight,
            };

            const lines = text.split("\n");
            const fullLength = lines.reduce((sum, line) => sum + line.length, 0);
            if (fullLength === 0) {
                TextRenderer.drawMultiline(ctx, "", renderOptions);
                if (onComplete) onComplete();
                resolve();
                return;
            }
            const totalDuration = duration ?? (fullLength / speed) * 1000;
            const startTime = performance.now();

            const drawFrame = (currentTime: number) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / totalDuration, 1);
                const totalChars = Math.floor(fullLength * progress);

                let remaining = totalChars;
                const rendered = lines.map((line) => {
                    if (remaining <= 0) return "";
                    const count = Math.min(line.length, remaining);
                    remaining -= count;
                    return line.slice(0, count);
                });

                const visibleText = rendered.join("\n");
                TextRenderer.drawMultiline(ctx, visibleText, renderOptions);

                if (progress < 1) {
                    requestAnimationFrame(drawFrame);
                } else {
                    if (onComplete) onComplete();
                    resolve();
                }
            };

            requestAnimationFrame(drawFrame);
        });
    },

    fadeText(
        ctx: CanvasRenderingContext2D,
        text: string,
        options: AnimatedTextOptions = {}
    ): Promise<void> {
        return new Promise((resolve) => {
            const { duration = 1000, easing = (t) => t, onComplete } = options;
            const startTime = performance.now();

            const animate = (currentTime: number) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const easedProgress = easing(progress);

                // Clear and redraw with updated opacity
                ctx.save();
                ctx.globalAlpha = easedProgress;
                TextRenderer.draw(ctx, text, options);
                ctx.restore();

                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    if (onComplete) onComplete();
                    resolve();
                }
            };

            requestAnimationFrame(animate);
        });
    },

    slideText(
        ctx: CanvasRenderingContext2D,
        text: string,
        startX: number,
        endX: number,
        options: AnimatedTextOptions = {}
    ): Promise<void> {
        return new Promise((resolve) => {
            const { duration = 1000, easing = (t) => t, onComplete } = options;
            const startTime = performance.now();

            const animate = (currentTime: number) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const easedProgress = easing(progress);

                const currentX = startX + (endX - startX) * easedProgress;
                TextRenderer.draw(ctx, text, { ...options, x: currentX });

                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    if (onComplete) onComplete();
                    resolve();
                }
            };

            requestAnimationFrame(animate);
        });
    },

    scaleText(
        ctx: CanvasRenderingContext2D,
        text: string,
        startSize: number,
        endSize: number,
        options: AnimatedTextOptions = {}
    ): Promise<void> {
        return new Promise((resolve) => {
            const { duration = 1000, easing = (t) => t, onComplete } = options;
            const startTime = performance.now();

            const animate = (currentTime: number) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const easedProgress = easing(progress);

                const currentSize = startSize + (endSize - startSize) * easedProgress;
                TextRenderer.draw(ctx, text, {
                    ...options,
                    fontSize: currentSize,
                });

                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    if (onComplete) onComplete();
                    resolve();
                }
            };

            requestAnimationFrame(animate);
        });
    },

    linear: (t: number) => t,
    easeIn: (t: number) => t * t,
    easeOut: (t: number) => t * (2 - t),
    easeInOut: (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
};
