
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
/* ********************************************* */

// Factory function for players object
const PlayerFactory = (name, mark) => {
  return { name, mark };
};
/* ********************************************* */

// Sounds
const audioModule = (() => {
  const _audio = new Audio('assets/audio/click.wav');
  const _victory = new Audio('assets/audio/victory.mp3');

  const victory = () => {
    _victory.currentTime = 0;
    _victory.play();
  }

  const getAudio = () => {
    _audio.currentTime = 0;
    _audio.play();
  };

  return { getAudio, victory };
})()
/* ************************************** */

// Module pattern for game display
const Game = (() => {
  // DOM Cache
  //players:
  const player1Display = document.querySelector('#player1-name');
  const player2Display = document.querySelector('#player2-name');
  const playerX = document.querySelector('#playerX');
  const playerO = document.querySelector('#playerO');
  let playerXName;
  let playerOName;
  let player1;
  let player2;
  let currentPlayer, currentPlayerName, gameOver;
  // player score
  const player1Score = document.querySelector('[data-score="1"]');
  const player2Score = document.querySelector('[data-score="2"]');
  let player1Count = 0;
  let player2Count = 0;
  // other elements
  const startGameModal = document.querySelector('.start__game-ctn');
  const form = document.querySelector('.form');
  const tiles = document.querySelectorAll('.gameboard__tiles');
  const _board = Gameboard.getBoard();
  const roundOver = document.querySelector('#roundOver');
  const winner = document.querySelector('.winner');
  // Buttons
  const startGameBTN = document.querySelector('#start-game-btn');
  const restartBtn = document.querySelector('#restart-btn');
  const newGameBTN = document.querySelector('#newGame-btn')


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

  const restartGame = () => {
    Gameboard.resetBoard();
    currentPlayer = player1.mark;
    currentPlayerName = player1.name
    roundOver.style.display = 'none';
    gameOver = false;
    render();

  };

  const startNewGame = () => {
    Gameboard.resetBoard();
    currentPlayer = player1.mark;
    currentPlayerName = player1.name
    roundOver.style.display = 'none';
    startGameModal.style.display = 'flex';
    newGameBTN.style.display = 'none';
    gameOver = false;
    player1Count = 0;
    player2Count = 0;
    playerX.value = '';
    playerO.value = '';
    render();
    submitForm()
  }


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

  const isGameOver = () => {
    if ((player1Count === 5 && player2Count < player1Count) ||
      (player2Count === 5 && player1Count < player2Count)) {
      gameOver = true;
      render(`${currentPlayerName[0].toUpperCase() + currentPlayerName.substring(1)}, won the game!`);
      restartBtn.style.display = 'none';
      newGameBTN.style.display = 'block'
    } else return
  }

  const updatePlayers = () => {
    player1Display.textContent = playerX.value;
    player2Display.textContent = playerO.value;
    player1Score.textContent = player1Count;
    player2Score.textContent = player2Count;
    playerXName = playerX.value;
    playerOName = playerO.value;
    isGameOver();
  }

  const submitForm = () => {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      updatePlayers();
      player1 = PlayerFactory(playerXName, "X"); // move player1 creation here
      player2 = PlayerFactory(playerOName, "O");
      restartGame();
      render();
      startGameModal.style.display = 'none';
      restartBtn.style.display = 'block';
    })
  }


  const handleMove = event => {
    audioModule.getAudio();
    const index = event.target.getAttribute("data-index");
    if (_board[index] === "" && !gameOver) {
      Gameboard.updateBoard(index, currentPlayer);
      if (checkWin(_board, currentPlayer)) {
        roundOver.style.display = 'flex';
        render(`Congratulations ${currentPlayerName[0].toUpperCase() + currentPlayerName.substring(1)}, you won this round!`);
        audioModule.victory();
        if (currentPlayerName === player1.name) {
          player1Count++
          updatePlayers();
        } else {
          player2Count++
          updatePlayers();
        }
      } else if (checkTie(Gameboard.getBoard())) {
        roundOver.style.display = 'flex';
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
      tile.textContent = _board[index];
    });
    if (status) {
      winner.textContent = status; // display message on screen
    }
    tiles.forEach(tile => {
      tile.addEventListener('click', handleMove);
    });

  }
  restartBtn.addEventListener('click', restartGame)
  newGameBTN.addEventListener('click', startNewGame);
  startGameBTN.addEventListener('click', submitForm)

})();