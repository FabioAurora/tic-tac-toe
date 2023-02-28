
// Module pattern for the gameboard
const Gameboard = (() => {
  const _board = ['', '', '', '', '', '', '', '', ''];

  const getBoard = () => _board;

  const updateBoard = (index, mark) => {
    _board[index] = mark;
  };

  const resetBoard = () => {
    _board.fill("");
  };

  return { getBoard, resetBoard, updateBoard, }
})();

// Factory function for players object
const PlayerFactory = (name, mark) => {
  return { name, mark };
};

// Module pattern for game display
const Game = (() => {
  const player1 = PlayerFactory('fabio', "X");
  const player2 = PlayerFactory('zoe', "O");
  let currentPlayer, currentPlayerName, gameOver;
  const tiles = document.querySelectorAll('.gameboard__tiles');
  const _board = Gameboard.getBoard();
  const _boardUpdate = Gameboard.updateBoard();


  const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  const startNewGame = () => {
    Gameboard.resetBoard();
    currentPlayer = player1.mark;
    currentPlayerName = player1.name
    gameOver = false;
    render();
  };


  const checkWin = (board, mark) => {
    return winningCombinations.some(combination =>
      combination.every(index => board[index] === mark)
    );
  };

  const checkTie = board => {
    return board.every(square => square !== "");
  };

  const switchPlayer = () => {
    currentPlayer = currentPlayer === player1.mark ? player2.mark : player1.mark;
  };

  const checkWinnerName = () => {
    currentPlayerName = currentPlayerName === player1.name ? player2.name : player1.name;
  }
  

  const handleMove = event => {
    const index = event.target.getAttribute("data-index");
    if (_board[index] === "" && !gameOver) {
      Gameboard.updateBoard(index, currentPlayer);
      if (checkWin(_board, currentPlayer)) {
        gameOver = true;
        render(`Congratulations ${currentPlayerName}, you won!`);
      } else if (checkTie(Gameboard.getBoard())) {
        gameOver = true;
        render("It's a tie!");
      } else {
        switchPlayer();
        checkWinnerName();
        render();
      }
    }
  };

  const render = (status = "") => {
    tiles.forEach((tile, index) => {
      tile.textContent = Gameboard.getBoard()[index];
    });
    if (status) {
      console.log(status); // or display it somewhere else on the screen
    }
    tiles.forEach(tile => {
      tile.addEventListener('click', handleMove);
    });
  }

  return { startNewGame }
})();


Game.startNewGame();