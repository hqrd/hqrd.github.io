var canvas = document.getElementById("canvas");
canvas.width = 300;
canvas.height = 600;
var ctx = canvas.getContext("2d");

var x = canvas.width / 2;
var y = canvas.height - 30;
var dx = 2;
var dy = -2;
var ballRadius = 20; // Deux fois plus grand
var ballImage = new Image();
ballImage.src = "ball.png";
var rotationAngle = 0;
var rotationSpeed = 0.1;

var paddleWidth = 120;
var paddleHeight = 10;
var paddleY = canvas.height - paddleHeight;
var paddleAngle1 = Math.PI / 6; // 30 degrés en radians
var paddleAngle2 = -Math.PI / 6; // 30 degrés en radians
var rotateStep = Math.PI / 4; // 45 degrés en radians

var obstacleRadius = 50; // Rayon de l'obstacle
var obstacleX = canvas.width / 2; // Position horizontale de l'obstacle
var obstacleY = canvas.height / 2; // Position verticale de l'obstacle

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
    if (e.key === "ArrowLeft") {
        paddleAngle1 = -rotateStep;
    } else if (e.key === "ArrowRight") {
        paddleAngle2 = rotateStep;
    }
}

function keyUpHandler(e) {
    if (e.key === "ArrowLeft") {
        paddleAngle1 = Math.PI / 6; // 30 degrés en radians
    } else if (e.key === "ArrowRight") {
        paddleAngle2 = -Math.PI / 6; // 30 degrés en radians
    }
}

function drawBall() {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotationAngle);
    ctx.drawImage(ballImage, -ballRadius, -ballRadius, ballRadius * 2, ballRadius * 2); // Deux fois plus grande
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

function drawObstacle() {
    ctx.beginPath();
    ctx.arc(obstacleX, obstacleY, obstacleRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#FF0000";
    ctx.fill();
    ctx.closePath();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    drawPaddle(0, paddleY - paddleHeight, paddleAngle1);
    drawPaddle(canvas.width - paddleWidth, paddleY - paddleHeight, paddleAngle2);
    drawObstacle();

    rotationAngle += rotationSpeed;

    // Gestion de la vitesse de la balle en fonction de la direction
    if (dy < 0) {
        dy -= 0.1; // Diminuer la vitesse lorsqu'elle monte
    } else {
        dy += 0.1; // Augmenter la vitesse lorsqu'elle descend
    }

    // Vérification de collision avec l'obstacle
    var distance = Math.sqrt((x - obstacleX) ** 2 + (y - obstacleY) ** 2);
    if (distance < ballRadius + obstacleRadius) {
        dy = -dy; // Inverser la direction de la balle
    }

    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }

    if (y + dy < ballRadius) {
        dy = -dy;
    } else if (y + dy > canvas.height - ballRadius) {
        if ((x > 0 - ballRadius && x < paddleWidth + ballRadius) ||
            (x > canvas.width - paddleWidth - ballRadius && x < canvas.width + ballRadius)) {
            dy = -dy;
        } else {
            // Alert "Game Over"
            alert("Game Over");

            // Reset the ball position and direction
            x = canvas.width / 2;
            y = canvas.height - 30;
            dx = 2;
            dy = -2;
        }
    }

    x += dx;
    y += dy;

    requestAnimationFrame(draw);
}

draw();
