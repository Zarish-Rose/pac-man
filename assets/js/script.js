// Dark/Light Theme Toggle
const themeToggle = document.getElementById("theme-toggle");

const savedTheme = localStorage.getItem("theme");
if (savedTheme === "light") {
  document.body.classList.add("light-theme");
}

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const isLight = document.body.classList.toggle("light-theme");
    localStorage.setItem("theme", isLight ? "light" : "dark");
  });
}


// Grid layout and game logic
const grid = document.querySelector(".grid");
const scoreDisplay = document.getElementById("score");

let score = 0;
const width = 20; // 20x20 grid

// 0 = pac-dot, 1 = wall, 2 = ghost-lair, 3 = power-pellet, 4 = empty
const layout = [
  // row 1
  1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
  // row 2
  1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
  // row 3
  1,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,1,
  // row 4
  1,0,1,1,1,0,0,1,0,1,1,1,0,0,1,1,1,0,0,1,
  // row 5
  1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
  // row 6
  1,0,1,1,1,0,0,1,0,1,1,1,0,1,0,1,1,1,0,1,
  // row 7
  1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
  // row 8
  1,0,0,0,1,0,0,0,2,2,2,0,0,1,0,0,0,1,0,1,
  // row 9
  1,1,1,0,1,1,1,1,0,1,0,1,1,1,0,1,1,1,0,1,
  // row 10
  1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
  // row 11
  1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
  // row 12
  1,1,1,0,1,1,1,1,0,1,0,1,1,1,0,1,1,1,0,1,
  // row 13
  1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
  // row 14
  1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,
  // row 15
  1,0,1,1,1,1,1,1,0,1,0,1,1,1,1,1,1,1,0,1,
  // row 16
  1,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,1,
  // row 17
  1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
  // row 18
  1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1
];

const squares = [];

function createBoard() {
  layout.forEach((cell, i) => {
    const square = document.createElement("div");
    squares.push(square);
    grid.appendChild(square);

    switch (cell) {
      case 0:
        square.classList.add("pac-dot");
        break;
      case 1:
        square.classList.add("wall");
        break;
      case 3:
        square.classList.add("power-pellet");
        break;
      // 2 = ghost-lair, 4 = empty — you can style these later
    }
  });
}

createBoard();


// Pac-Man and movement using arrow keys
let pacmanCurrentIndex = 21; // starting position (must not be a wall)
squares[pacmanCurrentIndex].classList.add("pacman");

document.addEventListener("keydown", movePacman);

function movePacman(e) {
  const key = e.key;
  const left = pacmanCurrentIndex - 1;
  const right = pacmanCurrentIndex + 1;
  const up = pacmanCurrentIndex - width;
  const down = pacmanCurrentIndex + width;

  squares[pacmanCurrentIndex].classList.remove("pacman");

  switch (key) {
    case "ArrowLeft":
      if (pacmanCurrentIndex % width !== 0 && !squares[left].classList.contains("wall")) {
        pacmanCurrentIndex = left;
      }
      break;

    case "ArrowRight":
      if (pacmanCurrentIndex % width < width - 1 && !squares[right].classList.contains("wall")) {
        pacmanCurrentIndex = right;
      }
      break;

    case "ArrowUp":
      if (up >= 0 && !squares[up].classList.contains("wall")) {
        pacmanCurrentIndex = up;
      }
      break;

    case "ArrowDown":
      if (down < width * width && !squares[down].classList.contains("wall")) {
        pacmanCurrentIndex = down;
      }
      break;
  }

  eatPacDot();
  squares[pacmanCurrentIndex].classList.add("pacman");
  checkForWin();
}

function eatPacDot() {
  const square = squares[pacmanCurrentIndex];
  if (square.classList.contains("pac-dot")) {
    square.classList.remove("pac-dot");
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
  new Ghost("blinky", 110, 300),
  new Ghost("pinky", 150, 350),
];

ghosts.forEach(ghost => {
  squares[ghost.currentIndex].classList.add(ghost.className, "ghost");
  moveGhost(ghost);
});

function moveGhost(ghost) {
  const directions = [-1, +1, -width, +width];
  let direction = directions[Math.floor(Math.random() * directions.length)];

  ghost.timerId = setInterval(() => {
    const nextIndex = ghost.currentIndex + direction;

    // If the next square is valid, move
    if (
      !squares[nextIndex].classList.contains("wall") &&
      !squares[nextIndex].classList.contains("ghost")
    ) {
      squares[ghost.currentIndex].classList.remove(ghost.className, "ghost");
      ghost.currentIndex = nextIndex;
      squares[ghost.currentIndex].classList.add(ghost.className, "ghost");
    } else {
      // Pick a new direction
      direction = directions[Math.floor(Math.random() * directions.length)];
    }

    checkGameOver();
  }, ghost.speed);
}


// Game-over condition
let gameOver = false;

function checkGameOver() {
  if (gameOver) return;

  if (squares[pacmanCurrentIndex].classList.contains("ghost")) {
    gameOver = true;

    document.removeEventListener("keydown", movePacman);
    ghosts.forEach(ghost => clearInterval(ghost.timerId));

    alert("Game Over");
  }
}


// Win condition
let gameWon = false;

function checkForWin() {
  if (gameWon) return;

  const remainingDots = document.querySelectorAll(".pac-dot, .power-pellet");

  if (remainingDots.length === 0) {
    gameWon = true;

    ghosts.forEach(ghost => clearInterval(ghost.timerId));
    document.removeEventListener("keydown", movePacman);

    alert("You Win!");
  }
}

// End of script.js