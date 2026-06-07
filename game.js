const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = 1000;
canvas.height = 500;

let score = 0;

const scoreText = document.getElementById("score");

// IMÁGENES
const marioImg = new Image();
marioImg.src = "assets/mario.png";

const goombaImg = new Image();
goombaImg.src = "assets/goomba.png";

const coinImg = new Image();
coinImg.src = "assets/coin.png";

const blockImg = new Image();
blockImg.src = "assets/block.png";

const backgroundImg = new Image();
backgroundImg.src = "assets/background.png";

const flagImg = new Image();
flagImg.src = "assets/flag.png";

// MARIO
const mario = {
    x: 100,
    y: 350,
    width: 50,
    height: 60,
    speed: 5,
    dx: 0,
    dy: 0,
    grounded: false
};

// ENEMIGO
const goomba = {
    x: 700,
    y: 380,
    width: 50,
    height: 50,
    speed: 2,
    dir: -1
};

// MONEDA
const coin = {
    x: 500,
    y: 220,
    width: 35,
    height: 35,
    collected: false
};

// BANDERA
const flag = {
    x: 920,
    y: 150,
    width: 50,
    height: 250
};

// PLATAFORMAS
const platforms = [
    { x: 0, y: 430, width: 1000, height: 70 },
    { x: 250, y: 320, width: 120, height: 40 },
    { x: 450, y: 260, width: 120, height: 40 }
];

// CONTROLES
const keys = {
    left: false,
    right: false
};

document.addEventListener("keydown", function(e) {

    if (e.code === "ArrowLeft") {
        keys.left = true;
    }

    if (e.code === "ArrowRight") {
        keys.right = true;
    }

    if (e.code === "Space") {
        e.preventDefault();

        if (mario.grounded) {
            mario.dy = -18;
            mario.grounded = false;
        }
    }
});

document.addEventListener("keyup", function(e) {

    if (e.code === "ArrowLeft") {
        keys.left = false;
    }

    if (e.code === "ArrowRight") {
        keys.right = false;
    }

    document.addEventListener("keydown", function(e){
    console.log(e.code);
    
});
});

// COLISIÓN
function collision(a, b) {
    return (
        a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y
    );
}

// ACTUALIZAR
function update() {

    // Movimiento horizontal
    if (keys.right) {
        mario.dx = mario.speed;
    } else if (keys.left) {
        mario.dx = -mario.speed;
    } else {
        mario.dx = 0;
    }

    mario.x += mario.dx;

    // Gravedad
    mario.dy += 0.8;
    mario.y += mario.dy;

    mario.grounded = false;

    // Suelo principal
    if (mario.y + mario.height >= 430) {
        mario.y = 430 - mario.height;
        mario.dy = 0;
        mario.grounded = true;
    }

    // Plataformas
    platforms.forEach(platform => {

        if (
            mario.x + mario.width > platform.x &&
            mario.x < platform.x + platform.width &&
            mario.y + mario.height >= platform.y &&
            mario.y + mario.height <= platform.y + 20 &&
            mario.dy >= 0
        ) {
            mario.y = platform.y - mario.height;
            mario.dy = 0;
            mario.grounded = true;
        }

    });

    // Movimiento Goomba
    goomba.x += goomba.speed * goomba.dir;

    if (goomba.x < 600 || goomba.x > 850) {
        goomba.dir *= -1;
    }

    // Moneda
    if (collision(mario, coin) && !coin.collected) {
        coin.collected = true;
        score++;
        scoreText.textContent = score;
    }

    // Enemigo
    if (collision(mario, goomba)) {
        alert("GAME OVER");
        location.reload();
    }

    // Victoria
    if (collision(mario, flag)) {
        alert("¡GANASTE!");
        location.reload();
    }
}

// DIBUJAR
function draw() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (backgroundImg.complete) {
        ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);
    }

    platforms.forEach(platform => {

        if (blockImg.complete) {
            ctx.drawImage(
                blockImg,
                platform.x,
                platform.y,
                platform.width,
                platform.height
            );
        } else {
            ctx.fillStyle = "brown";
            ctx.fillRect(
                platform.x,
                platform.y,
                platform.width,
                platform.height
            );
        }
    });

    if (marioImg.complete) {
        ctx.drawImage(
            marioImg,
            mario.x,
            mario.y,
            mario.width,
            mario.height
        );
    }

    if (goombaImg.complete) {
        ctx.drawImage(
            goombaImg,
            goomba.x,
            goomba.y,
            goomba.width,
            goomba.height
        );
    }

    if (!coin.collected && coinImg.complete) {
        ctx.drawImage(
            coinImg,
            coin.x,
            coin.y,
            coin.width,
            coin.height
        );
    }

    if (flagImg.complete) {
        ctx.drawImage(
            flagImg,
            flag.x,
            flag.y,
            flag.width,
            flag.height
        );
    }
}

// LOOP
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();