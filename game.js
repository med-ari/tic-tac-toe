function Gameboard() {
  const rows = 3;
  const columns = 3;
  let board = [];
  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < columns; j++) {
      board[i].push(Cell());
    }
  }

  const getBoard = () => board;
  const makeMark = (row, column, mark) => {
    const availableCells = board
      .filter((row) => row[column].getValue() === 0)
      .map((row) => row[column]);

    if (!availableCells.length) {
      return;
    }

    if (availableCells.includes(board[row][column])) {
      board[row][column].addMark(mark);
    }
  };

  const printBoard = () => {
    const boardValues = board.map((row) => row.map((cell) => cell.getValue()));
    console.log(boardValues);
  };
  const getBoardValues = () => {
    const boardValues = board.map((row) => row.map((cell) => cell.getValue()));
    return boardValues;
  };
  return { getBoard, makeMark, printBoard, getBoardValues };
}

function Cell() {
  let value = 0;
  const addMark = (player) => (value = player);
  const getValue = () => value;
  return { addMark, getValue };
}

function notNull(matrix) {
  return matrix.every((row) => row.every((cell) => cell !== 0));
}

function gameController(
  playerOneName = "Player One",
  playerTwoName = "Player Two"
) {
  const board = Gameboard();
  const players = [
    { name: playerOneName, mark: 1 },
    { name: playerTwoName, mark: 2 },
  ];
  let winner = "";
  let boardVal = board.getBoardValues();
  let activePlayer = players[0];
  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };
  const getActivePlayer = () => activePlayer;
  const printNewRound = () => {
    board.printBoard();
    if (!winner && notNull(boardVal)) {
      console.log("It's a tie");
    }
    else {

      console.log(`It's ${getActivePlayer().name}'s turn`);
    }
  };
  const getWinner = () => winner;


  const playRound = (row, column) => {
    board.makeMark(row, column, getActivePlayer().mark);
    // Check winning conditions here
    if (!winner) {
      let boardVal = board.getBoardValues();
      const boardT = Traspose(boardVal);
      const allEqual = (arr) =>
        arr.every((el) => el === getActivePlayer().mark);
      if (allEqual(boardVal[row]) || allEqual(boardT[column])) {
        winner = `The winner is ${getActivePlayer().name}`;
        console.log(`The winner is ${getActivePlayer().name}`);
      }
      if (
        row === column ||
        Math.abs(row - column) === boardVal[row].length - 1
      ) {
        const diags = Diagonals(boardVal);
        for (const element of diags) {
          if (allEqual(element)) {
            winner = `The winner is ${getActivePlayer().name}`;
            console.log(`The winner is ${getActivePlayer().name}`);
          }
        }
      }

    }
    switchPlayerTurn();
    printNewRound();

  };

  printNewRound();
  return {
    playRound,
    getActivePlayer,
    getBoard: board.getBoard,
    getWinner,
    getBoardVal: board.getBoardValues
  };
}

function Diagonals(array) {
  let diags = [[], []];
  for (let i = 0; i < array.length; i++) {
    diags[0].push(array[i][i]);
    diags[1].push(array[i][array.length - 1 - i]);
  }
  return diags;
}

function Traspose(array) {
  let tr = [];
  for (let i = 0; i < array.length; i++) {
    let col = (arr, n) => arr.map((x) => x[n]);
    tr.push(col(array, i));
  }
  return tr;
}

const numToMark = (num) => {
  switch (num) {
    case 0:
      return "";
    case 1:
      return "X";
    case 2:
      return "O";
    default:
      console.log("Not a valid mark");
      break;
  }
};

function displayController() {
  const game = gameController();
  const contain = document.querySelector(".container");
  const display = document.querySelector(".board");
  const turn = document.querySelector(".turn");
  const getGame = () => game;
  const updateScreen = () => {
    const board = game.getBoard();
    const player = game.getActivePlayer();
    const boardVal = game.getBoardVal();
    turn.textContent = `It's ${player.name}'s turn`;
    display.textContent = "";

    if (notNull(boardVal)) {
      turn.textContent = "Game over. It's a tie";

    }

    if (game.getWinner()) {
      turn.textContent = game.getWinner();

    }

    if (game.getWinner() || notNull(boardVal)) {
      const reset = document.createElement("button");
      const clearBoard = () => {
        displayController();
        reset.remove();
      };
      reset.textContent = "Reset game";
      contain.prepend(reset);
      reset.addEventListener("click", clearBoard);
    }

    board.forEach((row, rowIdx) => {
      row.forEach((cell, colIdx) => {
        const cellButton = document.createElement("button");
        cellButton.classList.add("cell");
        cellButton.dataset.row = rowIdx;
        cellButton.dataset.column = colIdx;
        cellButton.textContent = numToMark(cell.getValue());
        display.appendChild(cellButton);
      });
    });
    return { getGame };
  };

  function clickHandler(e) {
    const selectedRow = e.target.dataset.row;
    const selectedCol = e.target.dataset.column;
    if (!(selectedRow && selectedCol) || game.getWinner() || notNull(game.getBoardVal())) return;
    if (!e.target.textContent) {
      game.playRound(selectedRow, selectedCol, game.getActivePlayer().mark);
      updateScreen();
    }
  }

  display.addEventListener("click", clickHandler);
  updateScreen();
}

const disp = displayController();
