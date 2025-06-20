let currentPlayer = 'X';
let board = Array(9).fill('');
let gameActive = true;
let mode = '';
let difficulty = 'easy';
let scores = { X: 0, O: 0 };

const cells = document.querySelectorAll('.cell');
const status = document.getElementById('status');
const scoreX = document.getElementById('scoreX');
const scoreO = document.getElementById('scoreO');
const gameContainer = document.getElementById('game-container');
const celebration = document.getElementById('celebration');
const clickSound = document.getElementById('clickSound');
const winSound = document.getElementById('winSound');
const drawSound = document.getElementById('drawSound');

// Play on move
clickSound.play();

// Play on win
winSound.play();

// Play on draw
drawSound.play();



const winCombos = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

function showDifficulty() {
  document.querySelector('.difficulty-select').classList.remove('hidden');
}

function startGame(selectedMode, selectedDifficulty = 'easy') {
  mode = selectedMode;
  difficulty = selectedDifficulty;
  gameContainer.classList.remove('hidden');
  document.querySelector('.mode-select').classList.add('hidden');
  document.querySelector('.difficulty-select').classList.add('hidden');
  initGame();
}

function initGame() {
  board.fill('');
  gameActive = true;
  currentPlayer = 'X';
  celebration.classList.add('hidden');
  status.textContent = `Current Player: ${currentPlayer}`;
  cells.forEach(cell => {
    cell.textContent = '';
    cell.addEventListener('click', handleClick);
  });
}

function handleClick(e) {
  const index = e.target.dataset.index;
  if (!gameActive || board[index] !== '') return;
  makeMove(index);
  if (mode === 'vsComputer' && gameActive && currentPlayer === 'O') {
    setTimeout(() => {
      const index = getComputerMove();
      makeMove(index);
    }, 500);
  }
}

function getComputerMove() {
  if (difficulty === 'easy') {
    const empty = board.map((val, i) => val === '' ? i : null).filter(i => i !== null);
    return empty[Math.floor(Math.random() * empty.length)];
  } else if (difficulty === 'medium') {
    return Math.random() < 0.5 ? getBestMove() : getComputerMove('easy');
  } else {
    return getBestMove();
  }
}

function getBestMove() {
  let bestScore = -Infinity;
  let move;
  board.forEach((val, i) => {
    if (val === '') {
      board[i] = 'O';
      let score = minimax(board, 0, false);
      board[i] = '';
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  });
  return move;
}

function minimax(board, depth, isMaximizing) {
  if (checkWinner() === true) return isMaximizing ? -10 : 10;
  if (!board.includes('')) return 0;

  let bestScore = isMaximizing ? -Infinity : Infinity;
  for (let i = 0; i < 9; i++) {
    if (board[i] === '') {
      board[i] = isMaximizing ? 'O' : 'X';
      let score = minimax(board, depth + 1, !isMaximizing);
      board[i] = '';
      bestScore = isMaximizing ? Math.max(score, bestScore) : Math.min(score, bestScore);
    }
  }
  return bestScore;
}

function makeMove(index) {
  board[index] = currentPlayer;
  cells[index].textContent = currentPlayer;
  clickSound.play();
  if (checkWinner()) {
    status.textContent = `${currentPlayer} wins!`;
    scores[currentPlayer]++;
    updateScore();
    showCelebration();
    winSound.play();
    setTimeout(initGame, 2000);
    return;
  }
  if (!board.includes('')) {
    status.textContent = "It's a draw!";
    drawSound.play();
    setTimeout(initGame, 2000);
    return;
  }
  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  status.textContent = `Current Player: ${currentPlayer}`;
}

function checkWinner() {
  return winCombos.some(combo => {
    const [a, b, c] = combo;
    return board[a] && board[a] === board[b] && board[b] === board[c];
  });
}

function updateScore() {
  scoreX.textContent = scores.X;
  scoreO.textContent = scores.O;
}

function showCelebration() {
  celebration.classList.remove('hidden');
}
