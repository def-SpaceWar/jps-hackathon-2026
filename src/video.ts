import { ctx } from "./render/canvas";

const videoCache = new Map<string, HTMLVideoElement>();
const videoTimeCache = new Map<string, number>();

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
    if (Math.abs(time - lastTime) > 1 / 48) {
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

export function preloadVideo(videoSource: string): Promise<HTMLVideoElement> {
    return new Promise((resolve) => {
        let video = videoCache.get(videoSource);

        if (!video) {
            video = document.createElement("video");
            video.src = videoSource;
            video.crossOrigin = "anonymous";
            video.preload = "auto";
            videoCache.set(videoSource, video);
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
