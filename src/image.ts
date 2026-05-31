const imageCache = new Map<string, HTMLImageElement>();

export const ImageManager = {
    async preload(imageSource: string): Promise<HTMLImageElement> {
        let image = imageCache.get(imageSource);

        if (image) {
            return image;
        }

        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.onload = () => {
                imageCache.set(imageSource, img);
                resolve(img);
            };
            img.onerror = () => {
                reject(new Error(`Failed to load image: ${imageSource}`));
            };
            img.src = imageSource;
        });
    },

    get(imageSource: string): HTMLImageElement | undefined {
        return imageCache.get(imageSource);
    },

    clear() {
        imageCache.clear();
    },
};
