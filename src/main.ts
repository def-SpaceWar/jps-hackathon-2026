import { keys, listenInput } from "./input";
import { renderLoop } from "./loop";
import {
    autoResizeCanvas,
    canvas,
    ctx,
    initializeCanvas,
    setCanvasWidth,
} from "./render/canvas";
import "./style.css";
import hallwayUrl from "./assets/hallway/bg.mp4";
import op1Url from "./assets/op1/bg.jpg";
import radiologyUrl from "./assets/radio2/bg.jpg";
import op2Url from "./assets/op3/bg.jpg";
import musicUrl from "./assets/music/hospitalbg.mp3";
import { Player } from "./player";
import { AudioManager } from "./audio";
import { preloadVideo, renderVideoFrame } from "./video";
import { ImageManager } from "./image";

initializeCanvas(document.querySelector("#app") as HTMLDivElement);
autoResizeCanvas();
listenInput();

await preloadVideo(hallwayUrl);

AudioManager.load("bgm", musicUrl, "music", true);
AudioManager.play("bgm");

const oproom1Bg = await ImageManager.preload(op1Url);
const radiologyBg = await ImageManager.preload(radiologyUrl);
const oproom2Bg = await ImageManager.preload(op2Url);

const player = new Player();
//player.location = "oproom1";
player.location = "radiology";
//player.location = "oproom2";

const anatomyMinigame = await (async () => {
    let oddity1 = 0, oddity2 = 0, anomolyCount = Math.floor(Math.random() * 3);
    let img = "normalAnatomy";
    switch (anomolyCount) {
        case 1:
            oddity1 = 1 + Math.floor(Math.random() * 8);
            img = "operation" + oddity1;
            break;
        case 2:
            oddity1 = 1 + Math.floor(Math.random() * 7);
            oddity2 = oddity1 + 1 + Math.floor(Math.random() * (8 - oddity1));
            img = "operation" + oddity1 + oddity2;
            break;
        case 0:
        default:
            break;
    }
    console.log(img);
    return {
        oddity1,
        oddity2,
        img,
        chosenImg: await ImageManager.preload("/op1/" + img + ".png"),
        anomolyCount,
    };
})();

const radiologyMinigame = await (async () => {
    let oddity1 = 0, oddity2 = 0, anomolyCount = Math.floor(Math.random() * 3);
    let img = "normalRadiology1";
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
            const combo = combos[Math.floor(Math.random() * combos.length)];
            oddity1 = combo[0];
            oddity2 = combo[1];
            img = "radio" + oddity1 + oddity2;
            break;
        case 0:
        default:
            img = "normalRadiology" + (1 + Math.floor(Math.random() * 3));
            break;
    }
    console.log(img);
    return {
        oddity1,
        oddity2,
        img,
        chosenImg: await ImageManager.preload("/radio2/" + img + ".png"),
        anomolyCount,
    };
})();

renderLoop(async (dt) => {
    switch (player.location) {
        case "hallway":
            if (keys.has("ArrowLeft") || keys.has("a")) player.x -= 500 * dt;
            if (keys.has("ArrowRight") || keys.has("d")) player.x += 500 * dt;

            setCanvasWidth(1920);

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            ctx.save();
            ctx.translate(canvas.width / 2, canvas.height / 2);

            ctx.save();
            await renderVideoFrame(hallwayUrl, 0, {});
            ctx.restore();

            player.render(dt);

            ctx.restore();
            break;
        case "oproom1":
            setCanvasWidth(1920);

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            ctx.save();
            ctx.translate(canvas.width / 2, canvas.height / 2);

            ctx.save();
            ctx.translate(-oproom1Bg.width / 2, -oproom1Bg.height / 2 - 80);
            ctx.drawImage(oproom1Bg, 0, 0, oproom1Bg.width, oproom1Bg.height);
            ctx.restore();

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

            ctx.restore();
            break;
        case "radiology":
            setCanvasWidth(1920);

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            ctx.save();
            ctx.translate(canvas.width / 2, canvas.height / 2 - 80);

            ctx.save();
            ctx.translate(-radiologyBg.width / 2, -radiologyBg.height / 2);
            ctx.drawImage(
                radiologyBg,
                0,
                0,
                radiologyBg.width,
                radiologyBg.height,
            );
            ctx.restore();

            ctx.save();
            ctx.translate(
                -radiologyMinigame.chosenImg.width / 4,
                -radiologyMinigame.chosenImg.height / 4,
            );
            ctx.drawImage(
                radiologyMinigame.chosenImg,
                0,
                0,
                radiologyMinigame.chosenImg.width / 2,
                radiologyMinigame.chosenImg.height / 2,
            );
            ctx.restore();

            ctx.restore();
            break;
        case "oproom2":
            setCanvasWidth(1920);

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            ctx.save();
            ctx.translate(canvas.width / 2, canvas.height / 2 - 80);

            ctx.save();
            ctx.translate(-oproom2Bg.width / 2, -oproom2Bg.height / 2);
            ctx.drawImage(oproom2Bg, 0, 0, oproom2Bg.width, oproom2Bg.height);
            ctx.restore();

            ctx.restore();
            break;
    }
});
