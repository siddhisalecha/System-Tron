let PlayerTypes = {
  RED: 0,
  Yellow: 1,
  NOT_DEFINDED: -1,
};

let playerColor = ['red', 'yellow'];

let currentPlayer;
let gameBoard;
let availableCells;

let gameIsRunning = 0;

document.addEventListener('DOMContentLoaded', loadDOM);

function loadDOM() {
  document.getElementById('new-game-btn').addEventListener('click', startGame);
  startGame();
}

function startGame() {
  currentPlayer = PlayerTypes.NOT_DEFINDED;
  createBoard();
  changeCurrentPlayer();
  gameBoard = Array.from(Array(7), () => new Array(6).fill(-1));
  availableCells = 42;
  gameIsRunning = 1;
}

function createBoard() {
  let board = document.querySelector('.board');
  board.innerHTML = '';
  for (let i = 0; i < 7; i++) {
    let col = document.createElement('div');
    col.className = 'col';
    col.setAttribute('col-id', i);
    for (let j = 0; j < 6; j++) {
      let row = document.createElement('div');
      row.className = 'cell';
      row.id = i * 6 + j;
      col.appendChild(row);
    }
    col.addEventListener('click', onClick);
    board.appendChild(col);
  }
}

function changeCurrentPlayer() {
  currentPlayer = (currentPlayer + 1) % 2;
  let currentPlayerSpan = document.getElementById('current-player');
  currentPlayerSpan.style.color = playerColor[currentPlayer];
  currentPlayerSpan.innerHTML = playerColor[currentPlayer].capitalize();
}

function onClick(e) {
  if (!gameIsRunning) return;

  let col = e.target;
  if (e.target.className === 'cell') {
    col = e.target.parentElement;
  }

  let selectedCellId = colorFirstAvailableCell(col);

  if (selectedCellId != -1) {
    availableCells--;

    let x = Math.floor(selectedCellId / 6);
    let y = selectedCellId % 6;

    if (win(currentPlayer, x, y)) {
      alert(`${playerColor[currentPlayer].capitalize()} Player WON!!!`);
      gameIsRunning = 0;
    } else if (availableCells === 0) {
      alert(`DRAW!!!!!`);
      gameIsRunning = 0;
    } else {
      changeCurrentPlayer();
    }
  }
}

function colorFirstAvailableCell(column) {
  let rows = Array.from(column.children).reverse();
  for (let cell of rows) {
    if (cell.style.backgroundColor === '') {
      let selectedCell = Number(cell.id);
      cell.style.backgroundColor = playerColor[currentPlayer];
      gameBoard[Math.floor(selectedCell / 6)][selectedCell % 6] = currentPlayer;

      return Number(cell.id);
    }
  }
  return -1;
}

function win(cell, x, y) {
  let connectedCells =
    countCells(cell, x, y, 1, 0) + countCells(cell, x, y, -1, 0) - 1;
  if (connectedCells >= 4) return 1;

  connectedCells =
    countCells(cell, x, y, 0, 1) + countCells(cell, x, y, 0, -1) - 1;

  if (connectedCells >= 4) return 1;

  connectedCells =
    countCells(cell, x, y, 1, 1) + countCells(cell, x, y, -1, -1) - 1;

  if (connectedCells >= 4) return 1;

  connectedCells =
    countCells(cell, x, y, 1, -1) + countCells(cell, x, y, -1, 1) - 1;

  if (connectedCells >= 4) return 1;

  return 0;
}

function countCells(cell, x, y, dirX, dirY) {
  if (!validDir(x, y) || cell != gameBoard[x][y]) return 0;
  return 1 + countCells(cell, x + dirX, y + dirY, dirX, dirY);
}

function validDir(x, y) {
  return x >= 0 && x < 7 && y >= 0 && y < 6;
}

String.prototype.capitalize = function () {
  return this.charAt(0).toUpperCase() + this.slice(1);
};
