import { keys, listenInput } from "./input";
import { renderLoop, runTimer, runTimerRand } from "./loop";
import {
    autoResizeCanvas,
    canvas,
    ctx,
    initializeCanvas,
    setCanvasWidth,
} from "./render/canvas";
import "./style.css";
import titleUrl from "./assets/main/titleCard.png";
import titleBgUrl from "./assets/main/titleBg.mp4";
import hallwayUrl from "./assets/hallway/bg.mp4";
import redhandsUrl from "./assets/hallway/redhands.mp4";
import door1Url from "./assets/hallway/door1.mp4";
import door1RevUrl from "./assets/hallway/door1rev.mp4";
import door2Url from "./assets/hallway/door2.mp4";
import door2RevUrl from "./assets/hallway/door2rev.mp4";
import door3Url from "./assets/hallway/door3.mp4";
import door3RevUrl from "./assets/hallway/door3rev.mp4";
import op1Url from "./assets/op1/bg.jpg";
import radiologyUrl from "./assets/radio2/bg.jpg";
import op2Url from "./assets/op3/bg.jpg";
import hypnosisUrl from "./assets/op3/hypnosis.png";
import mainMusicUrl from "./assets/music/maintheme.mp3";
import musicUrl from "./assets/music/hospitalbg.mp3";
import anatomyMusicUrl from "./assets/music/anatomybg.mp3";
import radiologyMusicUrl from "./assets/music/anatomybg.mp3";
import surgeryMusicUrl from "./assets/music/surgerybg.mp3";
import doorOpenUrl from "./assets/sfx/doorOpen.mp3";
import doorCloseUrl from "./assets/sfx/doorClose.mp3";
import clickUrl from "./assets/sfx/mouseClick.mp3";
import tickUrl from "./assets/sfx/tickAudio.mp3";
import reverseTickUrl from "./assets/sfx/reverseTickAudio.mp3";
import rushEntityUrl from "./assets/sfx/rushEntity.mp3";
import footstepsUrl from "./assets/sfx/footstepsJapan.mp3";
import impostorScreamUrl from "./assets/sfx/impostorScream.mp3";
import impostorUrl from "./assets/op1/impostor.mp4";
import mriUrl from "./assets/radio2/mri.mp4";
import mriSpinningUrl from "./assets/sfx/mriSpinning.mp3";
import hypnosisDroningUrl from "./assets/sfx/hypnosisDroning.mp3";
import { Player } from "./player";
import { AudioManager } from "./audio";
import {
    clearVideoCache,
    getVideo,
    playVideo,
    preloadVideo,
    renderVideoFrame,
} from "./video";
import { ImageManager } from "./render/image";
import {
    renderButton,
    resetClickDetection,
    updateMouseState,
} from "./render/button";
import { TextRenderer } from "./render/text";
import { fadeInLoop, fadeOut } from "./render/fade";

initializeCanvas(document.querySelector("#app") as HTMLDivElement);
setCanvasWidth(1920);
autoResizeCanvas();
listenInput();

await preloadVideo(titleBgUrl);
await preloadVideo(hallwayUrl);
await preloadVideo(redhandsUrl);
await preloadVideo(door1Url);
await preloadVideo(door1RevUrl);
await preloadVideo(door2Url);
await preloadVideo(door2RevUrl);
await preloadVideo(door3Url);
await preloadVideo(door3RevUrl);
await preloadVideo(impostorUrl);
await preloadVideo(mriUrl);

AudioManager.load("mainbg", mainMusicUrl, "music", true);
AudioManager.load("hospitalbg", musicUrl, "music", true);
AudioManager.load("anatomybg", anatomyMusicUrl, "music", true);
AudioManager.load("radiologybg", radiologyMusicUrl, "music", true);
AudioManager.load("surgerybg", surgeryMusicUrl, "music", true);

AudioManager.load("door_open", doorOpenUrl);
AudioManager.load("door_close", doorCloseUrl);
AudioManager.load("click", clickUrl);
AudioManager.load("tick", tickUrl);
AudioManager.load("reverse_tick", reverseTickUrl);
AudioManager.load("rush", rushEntityUrl);
AudioManager.load("footsteps", footstepsUrl);
AudioManager.load("impostor_scream", impostorScreamUrl);
AudioManager.load("mri_spinning", mriSpinningUrl);
AudioManager.load("hypnosis_droning", hypnosisDroningUrl);

const title = await ImageManager.preload(titleUrl);
const oproom1Bg = await ImageManager.preload(op1Url);
const radiologyBg = await ImageManager.preload(radiologyUrl);
const oproom2Bg = await ImageManager.preload(op2Url);
const oproom2Hypnosis = await ImageManager.preload(hypnosisUrl);

alert("autoplay is required for audio to be played!");
AudioManager.playMusic("mainbg");

{
    const mainMenu = renderLoop(async () => {
        resetClickDetection();

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);

        //ctx.drawImage(
        //    redBg,
        //    -canvas.width / 2,
        //    -400,
        //    canvas.width,
        //    canvas.width * redBg.height / redBg.width,
        //);
        await playVideo(
            titleBgUrl,
            {},
        );
        ctx.drawImage(title, -title.width / 2, -title.height / 2);

        const playButton = renderButton(
            ctx,
            {
                x: 0,
                y: 300,
                width: 300,
                height: 150,
                fontSize: 100,
                text: "START",
                fontFamily: "Ringus",
                fillStyle: "#0000",
                hoverFillStyle: "#fff1",
                textFillStyle: "#FFF",
            },
        );
        if (playButton) mainMenu.stop();

        ctx.restore();
        updateMouseState();
    });
    await mainMenu.finish;
    await fadeOut(2_000);
}

const CASE_LABEL = {
    x: 0,
    y: -400,
    fontSize: 150,
    fontFamily: "Ringus",
    fillStyle: "white",
    textAlign: "center",
    textBaseline: "middle",
} as const;

const BACK_BUTTON = {
    x: -850,
    y: -320,
    width: 80,
    height: 40,
    fontSize: 35,
    fontFamily: "Ringus",
    borderRadius: 4,
    fillStyle: "#666",
    hoverFillStyle: "#888",
    textFillStyle: "white",
    text: "Back",
};

const ANOMALY_LABEL = {
    x: -710,
    y: 0,
    fontSize: 50,
    fontFamily: "Ringus",
    fillStyle: "white",
    textAlign: "center",
    textBaseline: "middle",
} as const;

const PLUS_BUTTON = {
    x: -550,
    y: 0,
    width: 50,
    height: 40,
    fontSize: 80,
    fontFamily: "Ringus",
    borderRadius: 4,
    fillStyle: "green",
    hoverFillStyle: "lightgreen",
    textFillStyle: "white",
    text: "+",
};

const MINUS_BUTTON = {
    x: -880,
    y: 0,
    width: 50,
    height: 40,
    fontSize: 80,
    fontFamily: "Ringus",
    borderRadius: 4,
    fillStyle: "red",
    hoverFillStyle: "lightcoral",
    textFillStyle: "white",
    text: "-",
};

const CONTINUE_LABEL = {
    x: 0,
    y: 400,
    width: 800,
    height: 180,
    fontSize: 160,
    fontFamily: "Ringus",
    borderRadius: 4,
    fillStyle: "green",
    hoverFillStyle: "lightgreen",
    textFillStyle: "white",
    text: "Continue?",
};

for (let caseNum = 11; caseNum <= 10;) {
    const player = new Player();
    //player.location = "oproom1";
    //player.location = "radiology";
    //player.location = "oproom2";

    const anatomyMinigame = await (async () => {
        let oddity1 = 0,
            oddity2 = 0,
            anomolyCount = caseNum == 1 ? 0 : Math.floor(Math.random() * 3);
        let img = "normalAnatomy";
        if (caseNum != 1) {
            switch (anomolyCount) {
                case 1:
                    oddity1 = 1 + Math.floor(Math.random() * 8);
                    img = "operation" + oddity1;
                    break;
                case 2:
                    oddity1 = 1 + Math.floor(Math.random() * 7);
                    oddity2 = oddity1 + 1 +
                        Math.floor(Math.random() * (8 - oddity1));
                    img = "operation" + oddity1 + oddity2;
                    break;
                case 0:
                default:
                    break;
            }
        }
        console.log(img);
        return {
            oddity1,
            oddity2,
            img,
            chosenImg: await ImageManager.preload("/op1/" + img + ".png"),
            anomolyCount,
            oddityToText: {
                1: "Heart on wrong side",
                2: "Extra humerus on the leg",
                3: "Liver on the palm",
                4: "Two Diaphragms",
                5: "Humerus is TINY",
                6: "Pancreas upside-down",
                7: "Oversized intestines",
                8: "Kidneys are missing",
            },
        };
    })();

    const radiologyMinigame = await (async () => {
        let oddity1 = 0,
            oddity2 = 0,
            anomolyCount = caseNum == 1 ? 0 : Math.floor(Math.random() * 3);
        let img = "normalRadiology1";
        if (caseNum != 1) {
            switch (anomolyCount) {
                case 1:
                    oddity1 = 1 + Math.floor(Math.random() * 6);
                    img = "radio" + oddity1;
                    break;
                case 2:
                    const combos = [
                        [1, 2],
                        [1, 3],
                        [1, 5],
                        [2, 3],
                        [2, 4],
                        [2, 5],
                        [3, 5],
                    ];
                    const combo =
                        combos[Math.floor(Math.random() * combos.length)];
                    oddity1 = combo[0];
                    oddity2 = combo[1];
                    img = "radio" + oddity1 + oddity2;
                    break;
                case 0:
                default:
                    img = "normalRadiology" +
                        (1 + Math.floor(Math.random() * 3));
                    break;
            }
        }
        console.log(img);
        return {
            oddity1,
            oddity2,
            img,
            chosenImg: await ImageManager.preload("/radio2/" + img + ".png"),
            anomolyCount,
            oddityToText: {
                1: "Cardiomegaly (big heart)",
                2: "Broken ribs",
                3: "Pnuemothorax (too much air in lungs)",
                4: "Blunting of costophrenic angle",
                5: "Lung cancer",
                6: "Hydropneumothorax",
            },
        };
    })();

    const instrumentMinigame = await (async () => {
        let oddity1 = 0,
            oddity2 = 0,
            anomolyCount = caseNum == 1 ? 0 : Math.floor(Math.random() * 3);
        let img = "normalSurgery";
        if (caseNum != 1) {
            switch (anomolyCount) {
                case 1:
                    oddity1 = 1 + Math.floor(Math.random() * 2);
                    img = "surgery" + oddity1;
                    break;
                case 2:
                    oddity1 = 1;
                    oddity2 = 2;
                    img = "surgery" + oddity1 + oddity2;
                    break;
                case 0:
                default:
                    break;
            }
        }
        console.log(img);
        return {
            oddity1,
            oddity2,
            img,
            chosenImg: await ImageManager.preload("/op3/" + img + ".png"),
            anomolyCount,
            oddityToText: {
                1: "The hemostat is replaced by a bone saw",
                2: "The forceps could be replaced by a Foley Catheter",
            },
        };
    })();

    let anomalyCount1 = 0,
        anomalyCount2 = 0,
        anomalyCount3 = 0;

    let currentHallwayVideo = hallwayUrl,
        doorTransitionActive = false,
        doorTransition = -1,
        doorInOrOut: "in" | "out" = "in",
        hallwayTime = 0;
    const flickerTimer = runTimerRand(
        () => {
            hallwayTime = 0.001;
        },
        10000,
        40000,
    );

    let alive = true;
    let monster: "redhands" | "impostor" | "mri" | "tv" | null = null;
    const mTimer = runTimerRand(
        () => {
            if (caseNum == 1) return;
            // @ts-ignore
            const m = [
                "redhands",
                "impostor",
                "mri",
                "tv",
            ][Math.floor(Math.random() * 4)];
            switch (m) {
                case "redhands":
                    AudioManager.play("rush");
                    setTimeout(() => {
                        monster = "redhands";
                        if (player.location == "hallway") {
                            setTimeout(() => {
                                alive = false;
                                game.stop();
                            }, 1_000);
                        } else {
                            monster = null;
                        }
                    }, 10_000);
                    break;
                case "impostor":
                    AudioManager.play("footsteps");
                    setTimeout(() => {
                        monster = "impostor";
                        setTimeout(() => {
                            if (player.location == "oproom1") {
                                AudioManager.play("impostor_scream");
                                alive = false;
                                game.stop();
                            } else {
                                monster = null;
                            }
                        }, 3_000);
                    }, 7_000);
                    break;
                case "mri":
                    AudioManager.play("mri_spinning");
                    monster = "mri";
                    setTimeout(() => {
                        if (player.location == "radiology") {
                            alive = false;
                            game.stop();
                        } else {
                            monster = null;
                        }
                    }, 9_000);
                    break;
                case "tv":
                    AudioManager.play("hypnosis_droning");
                    monster = "tv";
                    setTimeout(() => {
                        if (player.location == "oproom2") {
                            alive = false;
                            game.stop();
                        } else {
                            monster = null;
                        }
                    }, 7_500);
                    break;
            }
        },
        25000,
        55000,
        1,
    );

    let start = performance.now();
    const game = renderLoop(async (dt) => {
        resetClickDetection();

        switch (player.location) {
            case "hallway":
                if (monster != "redhands") {
                    AudioManager.playMusic("hospitalbg");
                }

                if (!doorTransitionActive) {
                    if (keys.has("ArrowLeft") || keys.has("a")) {
                        player.x -= 300 * dt;
                        player.right = false;
                        player.sprite.setAnimation("walk");
                    }
                    if (keys.has("ArrowRight") || keys.has("d")) {
                        player.x += 300 * dt;
                        player.right = true;
                        player.sprite.setAnimation("walk");
                    }
                    if (
                        !keys.has("ArrowLeft") && !keys.has("a") &&
                        !keys.has("ArrowRight") && !keys.has("d")
                    ) {
                        player.sprite.setAnimation("default");
                    }
                }

                if (player.x > 1000) {
                    game.stop();
                    return;
                }
                if (player.x < -1000) player.x = -1000;

                ctx.clearRect(0, 0, canvas.width, canvas.height);

                ctx.save();
                ctx.translate(canvas.width / 2, canvas.height / 2);

                ctx.save();
                if (doorTransitionActive) {
                    player.sprite.setAnimation("default");
                    await playVideo(
                        currentHallwayVideo,
                        {},
                    );
                } else {
                    if (monster == "redhands") {
                        await playVideo(redhandsUrl, {});
                    } else {
                        await renderVideoFrame(hallwayUrl, hallwayTime, {});
                    }
                }

                if (hallwayTime != 0 && hallwayTime != 2) {
                    if (hallwayTime > 2) {
                        hallwayTime = 2;
                    } else {
                        hallwayTime += dt;
                    }
                }

                ctx.restore();

                TextRenderer.draw(
                    ctx,
                    `Case ${caseNum == 10 ? "X" : caseNum}`,
                    CASE_LABEL,
                );
                if (monster != "redhands") player.render(dt);

                ctx.save();
                //ctx.fillStyle = "aqua";
                //ctx.fillRect(-850, -50, 100, 100);
                //ctx.fillRect(-50, -50, 100, 100);
                //ctx.fillRect(700, -50, 100, 100);

                if (keys.has("e") && !doorTransitionActive) {
                    if (player.x > -850 && player.x < -750) {
                        currentHallwayVideo = door1Url;
                        getVideo(currentHallwayVideo)!.currentTime = 0;
                        doorTransitionActive = true;
                        doorTransition = performance.now() + 1_000;
                        doorInOrOut = "out";
                        setTimeout(() => {
                            player.setLocation("oproom1");
                            currentHallwayVideo = hallwayUrl;
                            doorTransitionActive = false;
                            start = performance.now();
                        }, 2000);
                        AudioManager.play("door_open");
                    } else if (player.x > -50 && player.x < 50) {
                        currentHallwayVideo = door2Url;
                        getVideo(currentHallwayVideo)!.currentTime = 0;
                        doorTransitionActive = true;
                        doorTransition = performance.now() + 1_000;
                        doorInOrOut = "out";
                        setTimeout(() => {
                            player.setLocation("radiology");
                            currentHallwayVideo = hallwayUrl;
                            doorTransitionActive = false;
                            start = performance.now();
                        }, 2000);
                        AudioManager.play("door_open");
                    } else if (player.x > 700 && player.x < 800) {
                        currentHallwayVideo = door3Url;
                        getVideo(currentHallwayVideo)!.currentTime = 0;
                        doorTransitionActive = true;
                        doorTransition = performance.now() + 1_000;
                        doorInOrOut = "out";
                        setTimeout(() => {
                            player.setLocation("oproom2");
                            currentHallwayVideo = hallwayUrl;
                            doorTransitionActive = false;
                            start = performance.now();
                        }, 2000);
                        AudioManager.play("door_open");
                    }
                }
                ctx.restore();

                ctx.restore();

                if (doorTransitionActive) {
                    fadeInLoop(doorTransition, 1_000, doorInOrOut);
                }
                fadeInLoop(start, 2_000);
                break;
            case "oproom1":
                AudioManager.playMusic("anatomybg");
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                ctx.save();
                ctx.translate(canvas.width / 2, canvas.height / 2);

                ctx.save();
                ctx.translate(
                    -oproom1Bg.width / 2,
                    -oproom1Bg.height / 2 - 80,
                );
                if (monster == "impostor") {
                    await playVideo(impostorUrl, {
                        x: 0,
                        y: 0,
                        width: oproom1Bg.width,
                        height: oproom1Bg.height,
                    });
                } else {
                    ctx.drawImage(
                        oproom1Bg,
                        0,
                        0,
                        oproom1Bg.width,
                        oproom1Bg.height,
                    );
                }
                ctx.restore();

                if (monster != "impostor") {
                    ctx.save();
                    ctx.translate(
                        -anatomyMinigame.chosenImg.width / 4,
                        -anatomyMinigame.chosenImg.height / 4,
                    );
                    ctx.drawImage(
                        anatomyMinigame.chosenImg,
                        0,
                        0,
                        anatomyMinigame.chosenImg.width / 2,
                        anatomyMinigame.chosenImg.height / 2,
                    );
                    ctx.restore();
                }

                const backButton1 = renderButton(ctx, BACK_BUTTON);
                if (backButton1) {
                    player.setLocation("hallway");
                    currentHallwayVideo = door1RevUrl;
                    getVideo(currentHallwayVideo)!.currentTime = 0;
                    doorTransitionActive = true;
                    start = performance.now();
                    doorInOrOut = "in";
                    setTimeout(() => {
                        currentHallwayVideo = hallwayUrl;
                        doorTransitionActive = false;
                    }, 2000);
                    AudioManager.play("door_close");
                }

                TextRenderer.draw(
                    ctx,
                    `Anomalies: ${anomalyCount1 >= 0 ? anomalyCount1 : "?"}`,
                    ANOMALY_LABEL,
                );

                const increaseButton = renderButton(ctx, PLUS_BUTTON);
                const decreaseButton = renderButton(ctx, MINUS_BUTTON);
                if (increaseButton) {
                    anomalyCount1 = Math.min(2, anomalyCount1 + 1);
                }
                if (decreaseButton) {
                    anomalyCount1 = Math.max(0, anomalyCount1 - 1);
                }

                ctx.restore();
                fadeInLoop(start, 2_000);
                break;
            case "radiology":
                AudioManager.playMusic("radiologybg");
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                ctx.save();
                ctx.translate(canvas.width / 2, canvas.height / 2);

                ctx.save();
                ctx.translate(
                    -radiologyBg.width / 2,
                    -radiologyBg.height / 2 - 80,
                );
                if (monster == "mri") {
                    await playVideo(mriUrl, { x: 0, y: 0 });
                } else {
                    ctx.drawImage(
                        radiologyBg,
                        0,
                        0,
                        radiologyBg.width,
                        radiologyBg.height,
                    );
                }
                ctx.restore();

                ctx.save();
                ctx.translate(
                    -anatomyMinigame.chosenImg.width / 4,
                    -anatomyMinigame.chosenImg.height / 4,
                );
                ctx.drawImage(
                    radiologyMinigame.chosenImg,
                    0,
                    0,
                    anatomyMinigame.chosenImg.width / 2,
                    anatomyMinigame.chosenImg.height / 2,
                );
                ctx.restore();

                const backButton2 = renderButton(ctx, BACK_BUTTON);
                if (backButton2) {
                    player.setLocation("hallway");
                    currentHallwayVideo = door2RevUrl;
                    getVideo(currentHallwayVideo)!.currentTime = 0;
                    doorTransitionActive = true;
                    start = performance.now();
                    doorInOrOut = "in";
                    setTimeout(() => {
                        currentHallwayVideo = hallwayUrl;
                        doorTransitionActive = false;
                    }, 2000);
                    AudioManager.play("door_close");
                }

                TextRenderer.draw(
                    ctx,
                    `Anomalies: ${anomalyCount2 >= 0 ? anomalyCount2 : "?"}`,
                    ANOMALY_LABEL,
                );

                const increaseButton2 = renderButton(ctx, PLUS_BUTTON);
                const decreaseButton2 = renderButton(ctx, MINUS_BUTTON);
                if (increaseButton2) {
                    anomalyCount2 = Math.min(2, anomalyCount2 + 1);
                }
                if (decreaseButton2) {
                    anomalyCount2 = Math.max(0, anomalyCount2 - 1);
                }

                ctx.restore();
                fadeInLoop(start, 2_000);
                break;
            case "oproom2":
                AudioManager.playMusic("surgerybg");
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                ctx.save();
                ctx.translate(canvas.width / 2, canvas.height / 2);

                ctx.save();
                ctx.translate(-oproom2Bg.width / 2, -oproom2Bg.height / 2 - 80);
                ctx.drawImage(
                    monster == "tv" ? oproom2Hypnosis : oproom2Bg,
                    0,
                    0,
                    oproom2Bg.width,
                    oproom2Bg.height,
                );
                ctx.restore();

                ctx.save();
                ctx.translate(
                    -anatomyMinigame.chosenImg.width / 3 - 150,
                    -anatomyMinigame.chosenImg.height / 7,
                );
                ctx.drawImage(
                    instrumentMinigame.chosenImg,
                    0,
                    0,
                    anatomyMinigame.chosenImg.width,
                    anatomyMinigame.chosenImg.height / 3.5,
                );
                ctx.restore();

                const backButton3 = renderButton(ctx, BACK_BUTTON);
                if (backButton3) {
                    player.setLocation("hallway");
                    currentHallwayVideo = door3RevUrl;
                    getVideo(currentHallwayVideo)!.currentTime = 0;
                    doorTransitionActive = true;
                    start = performance.now();
                    doorInOrOut = "in";
                    setTimeout(() => {
                        currentHallwayVideo = hallwayUrl;
                        doorTransitionActive = false;
                    }, 2000);
                    AudioManager.play("door_close");
                }

                TextRenderer.draw(
                    ctx,
                    `Anomalies: ${anomalyCount3 >= 0 ? anomalyCount3 : "?"}`,
                    ANOMALY_LABEL,
                );

                const increaseButton3 = renderButton(ctx, PLUS_BUTTON);
                const decreaseButton3 = renderButton(ctx, MINUS_BUTTON);
                if (increaseButton3) {
                    anomalyCount3 = Math.min(2, anomalyCount3 + 1);
                }
                if (decreaseButton3) {
                    anomalyCount3 = Math.max(0, anomalyCount3 - 1);
                }

                ctx.restore();
                fadeInLoop(start, 2_000);
                break;
        }

        updateMouseState();
    });

    // game.stop();
    await game.finish;
    flickerTimer.stop();
    mTimer.stop();

    if (alive) {
        start = performance.now();
        const caseTransition = renderLoop(async () => {
            resetClickDetection();
            const time = performance.now() - start;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            ctx.save();
            ctx.translate(canvas.width / 2, canvas.height / 2);

            ctx.save();
            await renderVideoFrame(hallwayUrl, hallwayTime, {});
            fadeInLoop(start, 2_000, "out");
            ctx.restore();

            {
                ctx.save();
                const percentage = Math.min(1, time / 2_000);
                ctx.translate(0, 400 * percentage * percentage);
                const stuff = Object.create(CASE_LABEL);
                stuff.fontSize += CASE_LABEL.fontSize * percentage * percentage;
                TextRenderer.draw(
                    ctx,
                    `Case ${caseNum == 10 ? "X" : caseNum}`,
                    stuff,
                );
                ctx.restore();
            }

            let continueButton = false;
            if (time > 2_000) {
                ctx.save();
                const percentage = Math.min(1, (time - 2_000) / 1_000);
                const label = Object.create(CONTINUE_LABEL);
                label.fillStyle = `rgba(255, 255, 255, ${percentage})`;
                label.textFillStyle = `rgba(0, 0, 0, ${percentage})`;
                continueButton = renderButton(ctx, label);
                ctx.restore();
            }

            ctx.restore();
            updateMouseState();

            if (continueButton) {
                ctx.restore();
                await fadeOut();
                caseTransition.stop();
            }
        });

        await caseTransition.finish;

        const op1Right = anatomyMinigame.anomolyCount == anomalyCount1;
        const radioRight = radiologyMinigame.anomolyCount == anomalyCount2;
        const op2Right = instrumentMinigame.anomolyCount == anomalyCount3;

        if (op1Right && radioRight && op2Right) {
            caseNum++;
            AudioManager.play("tick");
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            ctx.save();
            ctx.translate(canvas.width / 2, canvas.height / 2);
            {
                ctx.translate(0, 400);
                const stuff = Object.create(CASE_LABEL);
                stuff.fontSize += CASE_LABEL.fontSize;
                stuff.fillStyle = "green";
                TextRenderer.draw(
                    ctx,
                    `Case ${Math.min(10, caseNum) == 10 ? "X" : caseNum}`,
                    stuff,
                );
            }
            ctx.restore();

            const wait = runTimer(() => {}, 1_000, 2);
            await wait.finish;
        } else {
            caseNum = Math.max(1, caseNum - 1);
            AudioManager.play("reverse_tick");
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            ctx.save();
            ctx.translate(canvas.width / 2, canvas.height / 2);
            {
                ctx.translate(0, 400);
                const stuff = Object.create(CASE_LABEL);
                stuff.fontSize += CASE_LABEL.fontSize;
                stuff.fillStyle = "red";
                await TextRenderer.draw(
                    ctx,
                    `Case ${caseNum == 10 ? "X" : caseNum}`,
                    stuff,
                );
            }
            ctx.restore();

            // text for each anomalty the player got wrong
            /// for op room 1
            const mistakes = [] as string[];

            if (!op1Right) {
                if (anomalyCount1 == -1) {
                    mistakes.push(
                        "Operating Room #1 (Anatomy): Never logged a number",
                    );
                } else if (anatomyMinigame.oddity1 != 0) {
                    mistakes.push(
                        // @ts-ignore
                        "Operating Room #1 (Anatomy): " + anatomyMinigame
                            .oddityToText[anatomyMinigame.oddity1],
                    );
                    if (anatomyMinigame.oddity2 != 0) {
                        mistakes.push(
                            // @ts-ignore
                            "Operating Room #1 (Anatomy): " + anatomyMinigame
                                .oddityToText[anatomyMinigame.oddity2],
                        );
                    }
                } else {
                    mistakes.push(
                        "Operating Room #1 (Anatomy): No anomalies, mistakenly flagged " +
                            anomalyCount1,
                    );
                }
            }

            if (!radioRight) {
                if (anomalyCount2 == -1) {
                    mistakes.push(
                        "Radiology Room (Xray): Never logged a number",
                    );
                } else if (radiologyMinigame.oddity1 != 0) {
                    mistakes.push(
                        // @ts-ignore
                        "Radiology Room (Xray): " + radiologyMinigame
                            .oddityToText[radiologyMinigame.oddity1],
                    );
                    if (radiologyMinigame.oddity2 != 0) {
                        mistakes.push(
                            // @ts-ignore
                            "Radiology Room (Xray): " + radiologyMinigame
                                .oddityToText[radiologyMinigame.oddity2],
                        );
                    }
                } else {
                    mistakes.push(
                        "Radiology Room (Xray): No anomalies, mistakenly flagged " +
                            anomalyCount2,
                    );
                }
            }

            if (!op2Right) {
                if (anomalyCount3 == -1) {
                    mistakes.push(
                        "Operating Room #2 (Surgical Tools): Never logged a number",
                    );
                } else if (instrumentMinigame.oddity1 != 0) {
                    mistakes.push(
                        "Operating Room #2 (Surgical Tools): " +
                            // @ts-ignore
                            instrumentMinigame
                                .oddityToText[instrumentMinigame.oddity1],
                    );
                    if (instrumentMinigame.oddity2 != 0) {
                        mistakes.push(
                            "Operating Room #2 (Surgical Tools): " +
                                // @ts-ignore
                                instrumentMinigame
                                    .oddityToText[instrumentMinigame.oddity2],
                        );
                    }
                } else {
                    mistakes.push(
                        "Operating Room #2 (Surgical Tools): No anomalies, mistakenly flagged " +
                            anomalyCount3,
                    );
                }
            }

            await TextRenderer.typeText(ctx, mistakes.join("\n"), {
                fillStyle: "red",
                fontFamily: "Ringus",
                fontSize: 40,
                x: canvas.width / 2 - 400,
                y: canvas.height / 2 + 100,
            });

            const wait = runTimer(() => {}, 1_000, 2);
            await wait.finish;
        }
    } else {
        AudioManager.play("reverse_tick");
        caseNum = Math.max(1, caseNum - 1);
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        {
            ctx.translate(0, 400);
            const stuff = Object.create(CASE_LABEL);
            stuff.fontSize += CASE_LABEL.fontSize;
            stuff.fillStyle = "red";
            await TextRenderer.draw(
                ctx,
                `Case ${caseNum == 10 ? "X" : caseNum}`,
                stuff,
            );
        }
        ctx.restore();

        let deathText = "You died.";
        switch (monster!) {
            case "redhands":
                deathText += "\nThe red handsgot you in the hallway.";
                break;
            case "impostor":
                deathText += "\nThe impostor in the operating room got you.";
                break;
            case "mri":
                deathText += "\nThe MRI machine in the radiology room got you.";
                break;
            case "tv":
                deathText +=
                    "\nThe hypnotic TV in the second operating room got you.";
                break;
        }

        await TextRenderer.typeText(ctx, deathText, {
            fillStyle: "red",
            fontFamily: "Ringus",
            fontSize: 40,
            x: canvas.width / 2 - 400,
            y: canvas.height / 2 + 100,
        });

        const wait = runTimer(() => {}, 1_000, 2);
        await wait.finish;
    }

    await fadeOut();
}

alert(
    "Thanks for playing! This game was made in <72 hours for the JPS Hackathon 2026 by Aryan, Swarup, Arshdeep, and Ailesh! We hope you enjoyed it!",
);

clearVideoCache();
import endSceneVideo from "./assets/endscene.mov";
await preloadVideo(endSceneVideo);
setCanvasWidth(4096);
autoResizeCanvas();
renderLoop(async () => {
    ctx.clearRect(0, 0, canvas.width / 2, canvas.height / 2);
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    await playVideo(
        endSceneVideo,
        {},
    );
    ctx.restore();
});
