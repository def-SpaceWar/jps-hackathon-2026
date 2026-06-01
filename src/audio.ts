interface AudioSource {
    element: HTMLAudioElement;
    type: "sfx" | "music";
    volume: number;
}

export class AudioManager {
    private static sources = new Map<string, AudioSource>();
    private static masterVolume = 1;
    private static sfxVolume = 1;
    private static musicVolume = 0.7;
    private static currentMusic: string | null = null;

    private static fadeIn(
        audio: HTMLAudioElement,
        targetVolume: number,
        duration: number,
    ): void {
        const startTime = Date.now();
        const startVolume = audio.volume;

        const updateVolume = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            audio.volume = startVolume +
                (targetVolume - startVolume) * progress;

            if (progress < 1) {
                requestAnimationFrame(updateVolume);
            }
        };

        requestAnimationFrame(updateVolume);
    }

    static load(
        id: string,
        src: string,
        type: "sfx" | "music" = "sfx",
        loop: boolean = false,
    ): void {
        if (this.sources.has(id)) {
            console.warn(`Audio "${id}" is already loaded`);
            return;
        }

        const audio = new Audio();
        audio.src = src;
        audio.loop = loop;
        audio.preload = "auto";

        const volume = type === "music" ? this.musicVolume : this.sfxVolume;
        audio.volume = volume * this.masterVolume;

        this.sources.set(id, {
            element: audio,
            type,
            volume,
        });
    }

    static play(id: string, volume?: number): void {
        const source = this.sources.get(id);
        if (!source) {
            console.warn(`Audio "${id}" not found`);
            return;
        }

        const audio = source.element;
        audio.currentTime = 0;

        if (volume !== undefined) {
            audio.volume = volume * this.masterVolume;
        } else {
            audio.volume = source.volume * this.masterVolume;
        }

        audio.play();
        if (audio.paused) alert("ENABLE AUTOPLAY AND RELOAD PAGE");
    }

    static playMusic(id: string, fadeInDuration: number = 0): void {
        if (id == this.currentMusic) return;
        
        const source = this.sources.get(id);
        if (!source) {
            console.warn(`Music "${id}" not found`);
            return;
        }

        if (source.type !== "music") {
            console.warn(`Audio "${id}" is not a music track`);
            return;
        }

        if (this.currentMusic) {
            this.stopMusic();
        }

        const audio = source.element;
        audio.currentTime = 0;

        if (fadeInDuration > 0) {
            audio.volume = 0;
            audio.play();

            this.fadeIn(
                audio,
                this.musicVolume * this.masterVolume,
                fadeInDuration,
            );
        } else {
            audio.volume = this.musicVolume * this.masterVolume;
            audio.play();
        }

        this.currentMusic = id;
    }

    static stop(id: string): void {
        const source = this.sources.get(id);
        if (!source) {
            console.warn(`Audio "${id}" not found`);
            return;
        }

        source.element.pause();
        source.element.currentTime = 0;

        if (this.currentMusic === id) {
            this.currentMusic = null;
        }
    }

    static stopMusic(): void {
        if (this.currentMusic) {
            this.stop(this.currentMusic);
        }
    }

    static pause(id: string): void {
        const source = this.sources.get(id);
        if (!source) {
            console.warn(`Audio "${id}" not found`);
            return;
        }

        source.element.pause();
    }

    static resume(id: string): void {
        const source = this.sources.get(id);
        if (!source) {
            console.warn(`Audio "${id}" not found`);
            return;
        }

        source.element.play();
    }

    static isPlaying(id: string): boolean {
        const source = this.sources.get(id);
        if (!source) return false;

        return !source.element.paused && source.element.currentTime > 0;
    }

    static setMasterVolume(volume: number): void {
        this.masterVolume = Math.max(0, Math.min(1, volume));

        this.sources.forEach((source) => {
            source.element.volume = source.volume * this.masterVolume;
        });
    }

    static setSFXVolume(volume: number): void {
        this.sfxVolume = Math.max(0, Math.min(1, volume));

        this.sources.forEach((source) => {
            if (source.type === "sfx") {
                source.element.volume = this.sfxVolume * this.masterVolume;
            }
        });
    }

    static setMusicVolume(volume: number): void {
        this.musicVolume = Math.max(0, Math.min(1, volume));

        this.sources.forEach((source) => {
            if (source.type === "music") {
                source.element.volume = this.musicVolume * this.masterVolume;
            }
        });
    }

    static getMasterVolume(): number {
        return this.masterVolume;
    }

    static getSFXVolume(): number {
        return this.sfxVolume;
    }

    static getMusicVolume(): number {
        return this.musicVolume;
    }

    static getCurrentMusic(): string | null {
        return this.currentMusic;
    }

    static fadeOut(id: string, duration: number = 1000): void {
        const source = this.sources.get(id);
        if (!source) {
            console.warn(`Audio "${id}" not found`);
            return;
        }

        const audio = source.element;
        const startTime = Date.now();
        const startVolume = audio.volume;

        const updateVolume = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            audio.volume = startVolume * (1 - progress);

            if (progress < 1) {
                requestAnimationFrame(updateVolume);
            } else {
                audio.pause();
                audio.currentTime = 0;

                if (this.currentMusic === id) {
                    this.currentMusic = null;
                }
            }
        };

        requestAnimationFrame(updateVolume);
    }

    static unload(id: string): void {
        const source = this.sources.get(id);
        if (!source) return;

        source.element.pause();
        source.element.src = "";
        this.sources.delete(id);

        if (this.currentMusic === id) {
            this.currentMusic = null;
        }
    }

    static unloadAll(): void {
        this.sources.forEach((source) => {
            source.element.pause();
            source.element.src = "";
        });
        this.sources.clear();
        this.currentMusic = null;
    }

    static getLoadedAudio(): string[] {
        return Array.from(this.sources.keys());
    }
}
