export const renderLoop = (callback: (dt: number) => Promise<void>) => {
    let on = true, before = performance.now();
    const cb = async (now: DOMHighResTimeStamp) => {
        if (!on) return;
        const dt = (now - before) / 1_000;
        await callback(dt);
        before = now;
        requestAnimationFrame(cb);
    };
    requestAnimationFrame(cb);
    return { stop: () => on = false };
};

export const runTimer = (
    callback: () => void,
    interval: number,
    amount = Infinity,
) => {
    let counter = 0;
    const id = setInterval(() => {
        if (counter >= amount) return clearInterval(id);
        callback();
        counter++;
    }, interval);
    return { stop: () => clearInterval(id) };
};
