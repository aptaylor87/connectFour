/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const width = 7;
const height = 6;

let currPlayer = 1; // active player: 1 or 2
const board = []; // array of rows, each row is array of cells  (board[y][x])
let gameOver = false; // this value swtiches to true when the game ends and stops additional clicks.

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

function makeBoard() {
  for (let i = 0; i < height; i++) {
    let arr = [];
    arr.length = width;
    arr.fill(undefined);
    board.push(arr);
  }
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
  // This grabs the element with id of board from the html and assigns it to a variable.
  const htmlBoard = document.getElementById('board')
  // This creates a new top row for the board and creates the event listener for a click on squares in that row
  const top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  top.addEventListener("click", handleClick);
  // this gives ids of 0-width for the top rop
  for (let x = 0; x < width; x++) {
    const headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    top.append(headCell);
  }
  htmlBoard.append(top);

  // This creates the rows and columns in the grid and gives them location ids
  for (let y = 0; y < height; y++) {
    const row = document.createElement("tr");
    for (let x = 0; x < width; x++) {
      const cell = document.createElement("td");
      cell.setAttribute("id", `${y}-${x}`);
      row.append(cell);
    }
    htmlBoard.append(row);
  }
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {
  // TODO: write the real version of this, rather than always returning 0
  if (board.every(function(row) {
    return row[x] === undefined;
  })) {
    return (height - 1);
  } else if (board.every(function(row) {
    return row[x] !== undefined;
  })) {
    return null;
  } else {
    return board.findIndex(function(row) {
      return row[x] !== undefined;
    }) - 1
  }
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
  // TODO: make a div and insert into correct table cell
  const correctCell = document.getElementById(`${y}-${x}`)
  const newDiv = document.createElement("div");
  newDiv.classList.add('piece');
  newDiv.classList.add(`p${currPlayer}`);
  correctCell.append(newDiv)

}

/** endGame: announce game end */

function endGame(msg) {
  alert(msg);
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  // get x from ID of clicked cell
  const x = +evt.target.id;
  // get next spot in column (if none, ignore click)
  const y = findSpotForCol(x);
  if (y === null) {
    return;
  } else if (gameOver === true) {
    return endGame("Refresh your browser to play again");
  } else {
  // place piece in board and add to HTML table
  // TODO: add line to update in-memory board
  placeInTable(y, x);
  board[y][x] = currPlayer;
  // check for win
  if (checkForWin()) {
    gameOver = true;
    return endGame(`Player ${currPlayer} won!`);
  }
  //check for tie
  if (board.every(function(row) {
    return row.every(function(cell) {
      return cell !== undefined;
    })
  })) {
    gameOver = true;
    return endGame("This game is a tie, try again!");
  }
  // switch players
  // TODO: switch currPlayer 1 <-> 2
  currPlayer = (currPlayer !== 1) ? 1 : 2
  }
}



/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < height &&
        x >= 0 &&
        x < width &&
        board[y][x] === currPlayer
    );
  }

  // TODO: read and understand this code. Add comments to help you.

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}


makeBoard();
makeHtmlBoard();
