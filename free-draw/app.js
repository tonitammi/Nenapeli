const canvas = document.getElementById("canvas");
const video = document.getElementById("video");
const ctx = canvas.getContext("2d");
const menu = document.getElementById("start-menu");
const display = document.getElementById("display");
const frame = document.getElementById("frame");
const gameMenu = document.getElementById("game-menu");
const gameDisplay = document.getElementById("close-game");
let times = 0, closed = true, interval;

const gestureController = new GestureController(canvas, video, 10, true);

gestureController.start();

const moveAmount = 20;
const canvasHeight = 800;
const canvasWidth = 1200;
canvas.height = canvasHeight;
canvas.width = canvasWidth;

let lastX = canvasWidth / 2;
let lastY = canvasHeight / 2;
let closeGame = 0;
let drawing = false;

gestureController.on("controllerloaded", function() {      
    game.init();
    gestureController.on("mouthopen", () => {
        if(closed) {
            times++;
            display.textContent = times;
            closed = false;
        }
        if(times >= 2) { 
            startGame();
            addEndGameListener();
            return;
        }
    });
    gestureController.on("mouthclosed", () => {
        if(!closed) closed = true;
    });
});

const addEndGameListener = () => {
    gestureController.on("mouthopen", () => {
        if(closed) {
            times++;
            closed = false;
        }
        if(times >= 2) { 
            endGame();
            return;
        }
    });
    gestureController.on("mouthclosed", () => {
        if(!closed) closed = true;
    });
}

const startGame = () => {
    display.textContent = "Drawing starting..";
    setTimeout(() => {
        menu.style.display = "none";
        game.init();
        game.start();
        drawing = true;
        times = 0;
        display.textContent = 0;
        gameDisplay.textContent = 0;
    }, 2000);
}

const game = {
    start: () => {
        frame.style.display = "block";
        gameMenu.style.display = "block";
        draw();
    },
    gameover: () => {
        frame.style.display = "none";
        gameMenu.style.display = "none";
        menu.style.display = "block";
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        this.init();
        interval = setInterval(() => {
            checkMouthOpens();
        }, 800);
    },
    init: () => {
        console.log("init");
        lastX = canvasWidth / 2;
        lastY = canvasHeight / 2;
        drawing = false;
        closeGame = 0;
    }
}

const checkOutOfMap = () =>{
    if (lastX >= canvasWidth - moveAmount) {
        lastX = canvasWidth - moveAmount;
    };

    if (lastX <= -moveAmount) { lastX = 0; };

    if (lastY >= canvasHeight - moveAmount) {
        lastY = canvasHeight - moveAmount;
    };

    if (lastY <= -moveAmount) { lastY = 0; }; 
}
const draw = () => {
    if (!drawing) return;
    checkOutOfMap();
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.fillRect(lastX, lastY, moveAmount , moveAmount );
}
const endGame = () => {
    if(gestureController.mouthOpen) {
        closeGame += 1;
        gameDisplay.textContent = closeGame;
    }
    if(closeGame == 2) {
        gameDisplay.textContent = "Drawing ending..";
        setTimeout(() => {
            game.gameover();
        }, 2000)
    }
}

gestureController.on("left", () => {
    console.log("left");
    lastX -= moveAmount;
    draw();
});
gestureController.on("right", () => {
    console.log("right");
    lastX += moveAmount;
    draw();
});
gestureController.on("up", () => {
    console.log("up");
    lastY -= moveAmount;
    draw();
});
gestureController.on("down", () => {
    console.log("down");
    lastY += moveAmount;
    draw();
});
// gestureController.on("mouthopen", () => {
//     console.log("mouthopen");
//     endGame();
// });

document.addEventListener('keydown', (event) => {
    if (event.key === "ArrowLeft") {
      lastX -= moveAmount;
    }
    else if (event.key === "ArrowUp") {
      lastY -= moveAmount;
    }
    else if (event.key === "ArrowRight") {
      lastX += moveAmount;
    }
    else if(event.key === "ArrowDown") {
      lastY += moveAmount;
    }
    else if(event.key === "a") {
        times += 1;
    }
    else if(event.key === " ") {
        closeGame += 1;
        gameDisplay.textContent = closeGame;
        if(closeGame >= 2) { game.gameover(); };
    }
        event.preventDefault();
        draw();
});