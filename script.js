const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const box = 20;
const rows = canvas.height / box;
const cols = canvas.width / box;

let snake = [{ x: 9 * box, y: 9 * box }];
let food = spawnFood();
let direction = 'RIGHT'; // Start moving right
let score = 0;

// Listen to key presses
document.addEventListener('keydown', changeDirection);

function changeDirection(e) {
    const key = e.key;

    if (key === 'ArrowLeft' && direction !== 'RIGHT') {
        direction = 'LEFT';
    } else if (key === 'ArrowUp' && direction !== 'DOWN') {
        direction = 'UP';
    } else if (key === 'ArrowRight' && direction !== 'LEFT') {
        direction = 'RIGHT';
    } else if (key === 'ArrowDown' && direction !== 'UP') {
        direction = 'DOWN';
    }
}

function spawnFood() {
    return {
        x: Math.floor(Math.random() * cols) * box,
        y: Math.floor(Math.random() * rows) * box
    };
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw snake
    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = i === 0 ? 'lime' : 'green';
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
    }

    // Draw food
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, box, box);

    // Move snake
    let head = {...snake[0] };
    if (direction === 'LEFT') head.x -= box;
    if (direction === 'RIGHT') head.x += box;
    if (direction === 'UP') head.y -= box;
    if (direction === 'DOWN') head.y += box;

    // Check wall collision (fixed)
    if (
        head.x < 0 || head.x >= cols * box ||
        head.y < 0 || head.y >= rows * box
    ) {
        endGame();
        return;
    }

    // Check self collision
    if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        endGame();
        return;
    }

    snake.unshift(head);

    // Check if eating food
    if (head.x === food.x && head.y === food.y) {
        score++;
        document.getElementById('score').innerText = 'Score: ' + score;
        food = spawnFood();
    } else {
        snake.pop(); // Remove tail
    }
}

function endGame() {
    clearInterval(gameLoop);
    alert('Game Over! Your score was: ' + score);
    document.location.reload();
}

const gameLoop = setInterval(draw, 100);