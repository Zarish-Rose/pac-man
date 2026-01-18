// Dark/Light Theme Toggle
const themeToggle = document.getElementById('theme-toggle');

themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('light-theme');

  // Save preference
  const isLight = document.body.classList.contains('light-theme');
  localStorage.setItem('theme', isLight ? 'light' : 'dark');
});

// Load saved theme
if (localStorage.getItem('theme') === 'light') {
  document.body.classList.add('light-theme');
}

// Grid layout

const grid = document.querySelector('.grid');
const scoreDisplay = document.getElementById('score');
let score = 0;
const width = 20; // 20x20 grid

// 0 = pac-dot, 1 = wall, 2 = ghost-lair, 3 = power-pellet, 4 = empty
const layout = [
  1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
  1,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,1,
  1,0,1,1,1,0,0,1,0,1,1,1,0,1,0,1,1,1,0,1,
  1,0,0,0,1,0,0,0,0,1,0,0,0,1,0,0,0,1,0,1,
  1,1,1,0,1,1,1,1,0,1,0,1,1,1,0,1,1,1,0,1,
  1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,
  1,0,1,1,1,1,1,1,0,1,0,1,1,1,1,1,1,1,0,1,
  1,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,1,
  1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
  // add more rows to make it 20x20
];

const squares = [];

function createBoard() {
  for (let i = 0; i < layout.length; i++) {
    const square = document.createElement('div');
    grid.appendChild(square);
    squares.push(square);

    if (layout[i] === 0) {
      square.classList.add('pac-dot');
    } else if (layout[i] === 1) {
      square.classList.add('wall');
    } else if (layout[i] === 3) {
      square.classList.add('power-pellet');
    }
  }
}

createBoard();

// Pac-Man and movement using arrow keys

let pacmanCurrentIndex = 21; // pick a valid index (not a wall)

squares[pacmanCurrentIndex].classList.add('pacman');

document.addEventListener('keydown', movePacman);

function movePacman(e) {
  squares[pacmanCurrentIndex].classList.remove('pacman');

  switch (e.key) {
    case 'ArrowLeft':
      if (
        pacmanCurrentIndex % width !== 0 &&
        !squares[pacmanCurrentIndex - 1].classList.contains('wall')
      ) {
        pacmanCurrentIndex -= 1;
      }
      break;
    case 'ArrowRight':
      if (
        pacmanCurrentIndex % width < width - 1 &&
        !squares[pacmanCurrentIndex + 1].classList.contains('wall')
      ) {
        pacmanCurrentIndex += 1;
      }
      break;
    case 'ArrowUp':
      if (
        pacmanCurrentIndex - width >= 0 &&
        !squares[pacmanCurrentIndex - width].classList.contains('wall')
      ) {
        pacmanCurrentIndex -= width;
      }
      break;
    case 'ArrowDown':
      if (
        pacmanCurrentIndex + width < width * width &&
        !squares[pacmanCurrentIndex + width].classList.contains('wall')
      ) {
        pacmanCurrentIndex += width;
      }
      break;
  }

  eatPacDot();
  squares[pacmanCurrentIndex].classList.add('pacman');
  checkForWin();
}

function eatPacDot() {
  if (squares[pacmanCurrentIndex].classList.contains('pac-dot')) {
    squares[pacmanCurrentIndex].classList.remove('pac-dot');
    score += 10;
    scoreDisplay.textContent = score;
  }
}


// Ghosts

class Ghost {
  constructor(className, startIndex, speed) {
    this.className = className;
    this.startIndex = startIndex;
    this.currentIndex = startIndex;
    this.speed = speed;
    this.timerId = null;
  }
}

const ghosts = [
  new Ghost('blinky', 110, 300),
  new Ghost('pinky', 150, 350),
];

ghosts.forEach(ghost => {
  squares[ghost.currentIndex].classList.add(ghost.className, 'ghost');
  moveGhost(ghost);
});

function moveGhost(ghost) {
  const directions = [-1, +1, -width, +width];
  let direction = directions[Math.floor(Math.random() * directions.length)];

  ghost.timerId = setInterval(() => {
    if (
      !squares[ghost.currentIndex + direction].classList.contains('wall') &&
      !squares[ghost.currentIndex + direction].classList.contains('ghost')
    ) {
      squares[ghost.currentIndex].classList.remove(ghost.className, 'ghost');
      ghost.currentIndex += direction;
      squares[ghost.currentIndex].classList.add(ghost.className, 'ghost');
    } else {
      direction = directions[Math.floor(Math.random() * directions.length)];
    }

    checkGameOver();
  }, ghost.speed);
}

// Game-over condition

function checkGameOver() {
  if (squares[pacmanCurrentIndex].classList.contains('ghost')) {
    document.removeEventListener('keydown', movePacman);
    ghosts.forEach(ghost => clearInterval(ghost.timerId));
    alert('Game Over');
  }
}

// Win condition

function checkForWin() {
  // If there are no pac-dots or pellets left, player wins
  const remainingDots = document.querySelectorAll('.pac-dot, .power-pellet');

  if (remainingDots.length === 0) {
    ghosts.forEach(ghost => clearInterval(ghost.timerId));
    document.removeEventListener('keydown', movePacman);
    alert('You Win!');
  }
}