import { ctx } from "./render/canvas";

const videoCache = new Map<string, HTMLVideoElement>();
const videoTimeCache = new Map<string, number>();

// getVideo function that gets it from cache
export function getVideo(videoSource: string): HTMLVideoElement | undefined {
    return videoCache.get(videoSource);
}

export async function renderVideoFrame(
    videoSource: string,
    time: number,
    options: { x?: number; y?: number; width?: number; height?: number } = {},
) {
    let video = videoCache.get(videoSource);

    if (!video) {
        video = document.createElement("video");
        video.src = videoSource;
        video.crossOrigin = "anonymous";
        video.preload = "metadata";
        videoCache.set(videoSource, video);
    }

    const lastTime = videoTimeCache.get(videoSource) ?? -Infinity;
    if (Math.abs(time - lastTime) > 1 / 24) {
        video.pause();
        video.currentTime = time;
        videoTimeCache.set(videoSource, time);
    }

    const {
        x = video.videoWidth / -2,
        y = video.videoHeight / -2,
        width = video.videoWidth,
        height = video.videoHeight,
    } = options;

    ctx.drawImage(video, x, y, width, height);
}

export async function playVideo(
    videoSource: string,
    options: { x?: number; y?: number; width?: number; height?: number } = {},
    backwards = false,
) {
    let video = videoCache.get(videoSource);

    if (!video) {
        video = document.createElement("video");
        video.src = videoSource;
        video.crossOrigin = "anonymous";
        video.preload = "metadata";
        videoCache.set(videoSource, video);
    }

    if (backwards) {
        /** @ts-ignore */
        video.playBackwards();
    } else {
        video.play();
    }

    const {
        x = video.videoWidth / -2,
        y = video.videoHeight / -2,
        width = video.videoWidth,
        height = video.videoHeight,
    } = options;

    ctx.drawImage(video, x, y, width, height);
}

/** @ts-ignore */
HTMLVideoElement.prototype.playBackwards = function () {
    this.pause();

    const fps = 24;
    let intervalRewind = setInterval(function () {
        /** @ts-ignore */
        if (this.currentTime <= 0) {
            clearInterval(intervalRewind);
            /** @ts-ignore */
            this.pause();
        } else {
            /** @ts-ignore */
            this.currentTime -= 1 / fps;
        }
    }, 1000 / fps);
};

export function preloadVideo(videoSource: string): Promise<HTMLVideoElement> {
    return new Promise((resolve) => {
        let video = videoCache.get(videoSource);

        if (!video) {
            video = document.createElement("video");
            video.src = videoSource;
            video.crossOrigin = "anonymous";
            video.preload = "auto";
            videoCache.set(videoSource, video);
            video.loop = false;
        }

        if (video.readyState >= video.HAVE_METADATA) {
            resolve(video);
        } else {
            video.addEventListener("loadedmetadata", () => resolve(video), {
                once: true,
            });
        }
    });
}

export function clearVideoCache() {
    videoCache.forEach((video) => {
        video.pause();
        video.src = "";
    });
    videoCache.clear();
}
