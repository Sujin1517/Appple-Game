const w = 800;
const h = 480;
const TimeLimit = 1000; // 1 per 0.1 second
const appleColor = "#f00"; // #4c4
const updateTime = 20;
let state = 0;
let timer = 0;
let score = 0;
let mouseDownPos = {x:-1, y:-1};
let mouseUpPos = {x:0, y:0};
let mousePos = {x:0, y:0};
let appleList = [
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
];


window.onload = () => {
    // if (!window.opener) {
    //     window.open("./apple.html", "_blank","width=798, height=476, popup=1, menubar=0, resizeable=0, scrollbars=0, status=0, toolbar=0");
    // }
    // self.statusbar = false;
    // window.resizeTo(798, 476);

    canvas = document.getElementById("canvas");
    canvas.setAttribute("width", w);
    canvas.setAttribute("height", h);
    c = canvas.getContext("2d");
    c.lineWidth = 1;


    canvas.addEventListener("mousedown", e => {
        console.log(e.offsetX, e.offsetY);
        if(state == 1) {
            mouseDownPos.x = e.offsetX;
            mouseDownPos.y = e.offsetY;
        }
    });
    canvas.addEventListener("mouseup", e => {
        if(state == 1) {
            mouseUpPos.x = e.offsetX;
            mouseUpPos.y = e.offsetY;
            checkApple();
        }
    });
    canvas.addEventListener("mouseout", e => {
        mouseDownPos.x = -1;
    });
    canvas.addEventListener("mousemove", e => {
        mousePos.x = e.offsetX;
        mousePos.y = e.offsetY;
    });
    document.addEventListener("click", e => {
        if (state == 0) {
            if (e.offsetX > 320 && e.offsetX < 480 && e.offsetY > 220 && e.offsetY < 260) {
                gameInitAndStart();
            }
        }
    });


    drawMainMenu();
}


const gameInitAndStart = () => {
    console.log("Log: start game");
    timer = TimeLimit;
    score = 0;
    for(let y=0; y<10; y++) {
        for(let x=0; x<17; x++) {
            appleList[y][x] = Math.floor(Math.random()*9+1);
        }
    }
    state = 1;
    setTimer();
    updateGame();
}
const setTimer = () => {
    timer--;
    if(timer > 0) {
        setTimeout(setTimer, 100);
    } else {
        state = 2;
        gameEnd();
        console.log("Log: game end");
    }
}


const clearCanvas = () => {
    c.fillStyle = "#fff"
    c.fillRect(0,0,w,h);
}


const drawApple = (x,y) => {
    if(appleList[(y-90)/32][(x-130)/32] == 0) return;
    
    c.beginPath();
    c.moveTo(x,y);
    c.quadraticCurveTo(x+3,y-7,x+8,y-5);
    c.quadraticCurveTo(x+15,y+3,x+5,y+15);
    c.quadraticCurveTo(x+2,y+15,x,y+13);
    c.quadraticCurveTo(x-2,y+15,x-5,y+15);
    c.quadraticCurveTo(x-15,y+3,x-8,y-5);
    c.quadraticCurveTo(x-3,y-7,x,y);

    c.fillStyle = appleColor;
    c.strokeStyle = "#000";
    c.fill();
    c.stroke();
    c.closePath();

    c.beginPath();
    c.moveTo(x,y);
    c.lineTo(x+3,y-8);
    c.lineTo(x+1,y-10);
    c.lineTo(x,y);
    c.fillStyle = "#622";
    c.fill();
    c.stroke();
    c.closePath();

    c.beginPath();
    c.fillStyle = "#fff"
    c.font = "bold 16px serif";
    c.textAlign = "center";
    c.textBaseline = "middle";
    c.fillText(appleList[(y-90)/32][(x-130)/32], x, y+5);
    c.closePath();
}
const drawGameTimer = () => {
    c.beginPath();
    c.fillStyle = "#2b2";
    c.fillRect(700, 75+(300/1000*(1000-timer)), 20, (300/1000*timer)) // (305/100*timer);
    c.closePath();
    c.beginPath();
    c.fillStyle = "#000";
    c.rect(700, 75, 20, 300);
    c.stroke();
    c.closePath();
}
const drawGameBoard = () => {
    c.fillStyle = "#ff0"
    c.globalAlpha = 0.3;
    c.fillRect(0,0,w,h);

    c.globalAlpha = 0.6;
    c.fillStyle = "#fff";
    for(let y=0; y<14; y++) {
        for(let x=0; x<21; x++){
            c.beginPath();
            c.arc(x*40+timer%40, y*40+timer%40-40, 10, 0, 2*Math.PI);
            c.fill();
            c.closePath();
        }
    }
    c.globalAlpha = 1;



    for(let y=0; y<10 ; y++) {
        for(let x=0; x<17; x++){
            drawApple(130+x*32, 90+y*32);
        }
    }
    drawGameTimer();
    c.beginPath();
    c.fillStyle = "#000"
    c.font = "bold 16px serif";
    c.textAlign = "center";
    c.textBaseline = "middle";
    c.fillText("Score: " + score, 710, 390);
    c.closePath();
}


const drawMainMenu = () => {
    c.beginPath();
    c.rect(w/2-80, h/2-20, 160, 40);
    c.strokeStyle = "#000";
    c.stroke();
    c.font = "24px serif";
    c.textAlign = "center";
    c.textBaseline = "middle";
    c.fillText("Game Start", w/2, h/2);
    console.log("Log: main menu");
}


const drawDrag = () => {
    if (mouseDownPos.x != -1) {
        c.beginPath();
        c.rect(mouseDownPos.x, mouseDownPos.y, mousePos.x - mouseDownPos.x, mousePos.y - mouseDownPos.y);
        c.strokeStyle = "#030";
        c.lineWidth = 2;
        c.globalAlpha = 0.5;
        c.stroke();
        c.closePath();
        c.lineWidth = 1;
        c.globalAlpha = 1;
    }
}
const checkApple = () => {
    let mx, mdx, my, mdy, appleSum = 0;
    if (mouseDownPos.x > mouseUpPos.x) {
        mx = mouseUpPos.x;
        mdx = mouseDownPos.x - mouseUpPos.x;
    } else {
        mx = mouseDownPos.x;
        mdx = mouseUpPos.x - mouseDownPos.x;
    }
    if (mouseDownPos.y > mouseUpPos.y) {
        my = mouseUpPos.y;
        mdy = mouseDownPos.y - mouseUpPos.y;
    } else {
        my = mouseDownPos.y;
        mdy = mouseUpPos.y - mouseDownPos.y;
    }
    for(let y=0; y<10 ; y++) {
        for(let x=0; x<17; x++){
            if(130+x*32 > mx && 130+x*32 < mx+mdx && 93+y*32 > my && 93+y*32 < my+mdy) {
                appleSum += appleList[y][x]*1;
            }
        }
    }
    console.log(appleSum);
    if(appleSum == 10) {
        for(let y=0; y<10 ; y++) {
            for(let x=0; x<17; x++){
                if (appleList[y][x] != 0){
                    if(130+x*32 > mx && 130+x*32 < mx+mdx && 93+y*32 > my && 93+y*32 < my+mdy) {
                        appleList[y][x] = 0;
                        score++;
                    }
                }
            }
        }
    }
    mouseDownPos.x = -1;
}


const updateGame = () => {
    clearCanvas();
    drawGameBoard();
    if(mouseDownPos.x != -1) drawDrag();
    if (state == 1) setTimeout(updateGame, updateTime);
}


const gameEnd = () => {
    alert("게임 끝!\nScore : " + score);
}