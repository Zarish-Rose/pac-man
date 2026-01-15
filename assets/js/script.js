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