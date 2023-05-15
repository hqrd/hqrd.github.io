var canvas = document.getElementById("canvas");
canvas.width = 300;
canvas.height = 600;
var ctx = canvas.getContext("2d");

let score = 0; // Score initial
var x = canvas.width / 2;
var y = canvas.height - 30;
var dx = 0; // Modification : la vitesse initiale est de 0
var dy = 0; // Modification : la vitesse initiale est de 0
var ballRadius = 22;
var ballImage = new Image();
ballImage.src = "ball.png";
var rotationAngle = 0;
var rotationSpeed = 0.05;
var maxSpeed = 7;

var paddleWidth = 100;
var paddleHeight = 20;
var paddleY = canvas.height - paddleHeight;
var paddleAngle1 = Math.PI / 6; // 30 degrés en radians
var paddleAngle2 = -Math.PI / 6; // 30 degrés en radians
var rotateStep = Math.PI / 4; // 45 degrés en radians
var paddleDown1 = 0;
var paddleDown2 = 0;

var obstacles = [{
    radius: 26,
    x: 90,
    y: 172,
}, {
    radius: 26,
    x: 185,
    y: 172,
}, {
    radius: 26,
    x: 140,
    y: 265,
}]

var isBallLaunched = false; // Variable pour suivre l'état du lancement de la balle

// Ajout de la musique de fond
var audio = new Audio("background_music.mp3");
audio.loop = true;
audio.volume = 0.02; // Réglez le volume à 50% (0.0 à 1.0)

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
    if (e.key === "ArrowLeft") {
        paddleAngle1 = -rotateStep;
        paddleDown1 = -50;
    } else if (e.key === "ArrowRight") {
        paddleAngle2 = rotateStep;
        paddleDown2 = -50;
    } else if (e.key === " ") { // Barre d'espace pour lancer la balle
        if (!isBallLaunched) {
            dx = Math.random() * 9 - 4;
            dy = -3;
            isBallLaunched = true;
            audio.play();
        }
    }
}

function keyUpHandler(e) {
    if (e.key === "ArrowLeft") {
        paddleAngle1 = Math.PI / 6; // 30 degrés en radians
        paddleDown1 = 0;
    } else if (e.key === "ArrowRight") {
        paddleAngle2 = -Math.PI / 6; // 30 degrés en radians
        paddleDown2 = 0;
    }
}


function drawBall() {
    ctx.save();
    ctx.translate(x, y);
    if (isBallLaunched)
        ctx.rotate(rotationAngle);
    ctx.drawImage(ballImage, -ballRadius, -ballRadius, ballRadius * 2, ballRadius * 2);
    ctx.restore();
}

function drawPaddle(x, y, angle) {
    ctx.save();
    ctx.translate(x + paddleWidth / 2, y + paddleHeight / 2);
    ctx.rotate(angle);
    ctx.fillStyle = "#0095DD";
    ctx.fillRect(-paddleWidth / 2, -paddleHeight / 2, paddleWidth, paddleHeight);
    ctx.restore();
}

function drawObstacle(x1, y1, radius) {
    ctx.beginPath();
    ctx.arc(x1, y1, radius, 0, Math.PI * 2);
    ctx.fillStyle = "#FF0000";
    ctx.fill();
    ctx.closePath();
}

function checkCollision() {
    for (let obstacle of obstacles) {
        var distance = Math.sqrt((x - obstacle.x) ** 2 + (y - obstacle.y) ** 2);
        if (distance < ballRadius + obstacle.radius) {
            // Calculer la position relative de la balle par rapport à l'obstacle
            var relativeX = x - obstacle.x;
            var relativeY = y - obstacle.y;

            // Vérifier si la balle est plutôt en haut ou en bas de l'obstacle
            if (relativeY < 0) {
                // Balle en haut de l'obstacle
                dy = -Math.abs(dy); // Inverser la direction verticale vers le bas
            } else {
                // Balle en bas de l'obstacle
                dy = Math.abs(dy); // Inverser la direction verticale vers le haut
            }

            // Vérifier si la balle est plutôt à gauche ou à droite de l'obstacle
            if (relativeX < 0) {
                // Balle à gauche de l'obstacle
                dx = -Math.abs(dx); // Inverser la direction horizontale vers la gauche
            } else {
                // Balle à droite de l'obstacle
                dx = Math.abs(dx); // Inverser la direction horizontale vers la droite
            }

            // Ajouter un peu d'aléatoire à l'angle de rebond
            var randomAngle = Math.random() * Math.PI / 4 - Math.PI / 8; // Angle aléatoire entre -pi/8 et pi/8
            var newDirection = rotateVector(dx, dy, randomAngle);
            dx = newDirection.x;
            dy = newDirection.y;
        }
    }
}

// Fonction utilitaire pour faire pivoter un vecteur
function rotateVector(x, y, angle) {
    var newX = x * Math.cos(angle) - y * Math.sin(angle);
    var newY = x * Math.sin(angle) + y * Math.cos(angle);
    return {x: newX, y: newY};
}


function draw() {
    // Effacer le canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dessiner la balle
    drawBall();

    // Dessiner les barres
    drawPaddle(0, paddleDown1 + paddleY - paddleHeight, paddleAngle1);
    drawPaddle(canvas.width - paddleWidth, paddleDown2 + paddleY - paddleHeight, paddleAngle2);

    // Dessiner les obstacles
    for (let obstacle of obstacles) {
        drawObstacle(obstacle.x, obstacle.y, obstacle.radius);
    }

    rotationAngle += rotationSpeed;

    // Gestion de la vitesse de la balle en fonction de la direction
    if (dy < 0) {
        dy += 0.01; // monte
    } else if (dy > 0) {
        dy += 0.2; // descend
    }

    // Vérification de collision avec l'obstacle
    checkCollision();

    score++; // Incrémenter le score de 1

    // Vérification des rebonds sur les bords du canvas
    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }

    if (y + dy < ballRadius) {
        // haut du tableau
        dy = -dy;
    } else if (isBallLaunched && y + dy > canvas.height - ballRadius) {
        // bas du tableau
        // Vérification de collision avec les barres
        if ((x > 0 - ballRadius && x < paddleWidth + ballRadius) ||
            (x > canvas.width - paddleWidth - ballRadius && x < canvas.width + ballRadius)) {
            dy = -dy;
        } else {
            // Alert "Game Over"
            alert("Game Over, score=" + score);

            // Réinitialisation de la position et de la direction de la balle
            x = canvas.width / 2;
            y = canvas.height - 30;
            dx = 0;
            dy = 0;
            isBallLaunched = false;
            audio.pause();
            audio.currentTime = 0;
        }
    }

    if (dx > maxSpeed) dx = maxSpeed;
    if (dx < -maxSpeed) dx = -maxSpeed;
    if (dy > maxSpeed) dy = maxSpeed;
    if (dy < -maxSpeed) dy = -maxSpeed;

    // Mise à jour de la position de la balle
    x += dx;
    y += dy;

    // Appel récursif de la méthode draw après un délai de 10 millisecondes
    setTimeout(draw, 10);
}


draw();
