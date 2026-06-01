export const renderLoop = (callback: (dt: number) => Promise<void>) => {
    let on = true;
    let before = performance.now();
    let requestId = 0;
    let resolveFinish: () => void = () => {};

    const finish = new Promise<void>((resolve) => {
        resolveFinish = resolve;

        const cb = async (now: DOMHighResTimeStamp) => {
            if (!on) return;
            const dt = (now - before) / 1_000;
            await callback(dt);
            before = now;
            requestId = requestAnimationFrame(cb);
        };

        requestId = requestAnimationFrame(cb);
    });

    return {
        stop: () => {
            if (!on) return;
            on = false;
            cancelAnimationFrame(requestId);
            resolveFinish();
        },
        finish,
    };
};

export const runTimer = (
    callback: (counter: number) => void,
    interval: number,
    amount = Infinity,
) => {
    let counter = 0;
    let on = true;
    let intervalId: ReturnType<typeof setInterval>;
    let resolveFinish: () => void = () => {};

    const finish = new Promise<void>((resolve) => {
        resolveFinish = resolve;
        intervalId = setInterval(() => {
            if (!on) return;
            if (counter >= amount) {
                on = false;
                clearInterval(intervalId);
                resolveFinish();
                return;
            }
            callback(counter);
            counter++;
        }, interval);
    });

    return {
        stop: () => {
            if (!on) return;
            on = false;
            clearInterval(intervalId);
            resolveFinish();
        },
        finish,
    };
};

export const runTimerRand = (
    callback: () => void,
    minInterval: number,
    maxInterval: number,
    amount = Infinity,
) => {
    let counter = 0;
    let on = true;
    let timeoutId: ReturnType<typeof setTimeout>;
    let resolveFinish: () => void = () => {};

    const finish = new Promise<void>((resolve) => {
        resolveFinish = resolve;

        const scheduleNext = () => {
            if (!on) return;
            if (counter >= amount) {
                on = false;
                resolveFinish();
                return;
            }

            const interval = Math.random() * (maxInterval - minInterval) +
                minInterval;
            timeoutId = setTimeout(() => {
                if (!on) return;
                callback();
                counter++;
                scheduleNext();
            }, interval);
        };

        scheduleNext();
    });

    return {
        stop: () => {
            if (!on) return;
            on = false;
            clearTimeout(timeoutId);
            resolveFinish();
        },
        finish,
    };
};
