document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');

  const box = 20;
  let snake = [{ x: 10 * box, y: 10 * box }];
  let food = { x: Math.floor(Math.random() * 20) * box, y: Math.floor(Math.random() * 20) * box };
  let score = 0;
  let d = 'RIGHT'; // Initialize the direction

  document.addEventListener('keydown', direction);

  function direction(event) {
    const key = event.key;

    if (key.startsWith('Arrow')) {
      const dir = key.slice(5).toUpperCase();
      if (dir !== oppositeDirection(d)) {
        d = dir;
      }
    }
  }

  function oppositeDirection(dir) {
    const opposites = { LEFT: 'RIGHT', RIGHT: 'LEFT', UP: 'DOWN', DOWN: 'UP' };
    return opposites[dir];
  }

  function collision(head, array) {
    return array.slice(1).some(segment => head.x === segment.x && head.y === segment.y);
  }

  function drawSnakePart(x, y, isHead = false) {
    ctx.fillStyle = isHead ? 'green' : 'white';
    ctx.fillRect(x, y, box, box);
    ctx.strokeStyle = 'black';
    ctx.strokeRect(x, y, box, box);
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    snake.forEach(({ x, y }, index) => drawSnakePart(x, y, index === 0));

    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, box, box);

    const snakeX = snake[0].x + (d === 'LEFT' ? -box : d === 'RIGHT' ? box : 0);
    const snakeY = snake[0].y + (d === 'UP' ? -box : d === 'DOWN' ? box : 0);

    if (snakeX === food.x && snakeY === food.y) {
      score++;
      updateHighscore(score);
      food = { x: Math.floor(Math.random() * 20) * box, y: Math.floor(Math.random() * 20) * box };
    } else {
      snake.pop();
    }

    const newHead = { x: snakeX, y: snakeY };

    if (collision(newHead, snake) || isOutOfBounds(newHead)) {
      clearInterval(game);
    }

    snake.unshift(newHead);

    ctx.fillStyle = 'blue';
    ctx.font = '45px Changa One';
    //ctx.fillText(score, 2 * box, 1.6 * box);
    document.getElementById('score').innerText = score;
  }

  function isOutOfBounds({ x, y }) {
    return x < 0 || x >= canvas.width || y < 0 || y >= canvas.height;
  }

  const game = setInterval(draw, 100);
});

function restartGame() {
  location.reload();
}

function updateHighscore(score) {
  let highscoreValue = localStorage.getItem('highscore');

  if (highscoreValue !== null) {
    highscoreValue = parseInt(highscoreValue, 10);
    if (isNaN(highscoreValue)) {
      highscoreValue = 0;
    }
    if (score > highscoreValue) {
      localStorage.setItem('highscore', score);
      highscoreValue = score;
    }
  } else {
    localStorage.setItem('highscore', score);
    highscoreValue = score;
  }
  document.getElementById('highscore').textContent = highscoreValue;
}

updateHighscore();
