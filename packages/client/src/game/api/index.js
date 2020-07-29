import { isDefined, isUndefined } from '@c4/shared';

const ROWS = 6;
const COLUMNS = 7;
const PLAYER_ONE = 'a';
const PLAYER_TWO = 'b';


class GameApi {
  constructor() {
    this.listeners = {};
    this.rows = ROWS;
    this.columns = COLUMNS;
    this.state = {
      board: new Array(COLUMNS).fill(new Array(ROWS).fill(null)),
      currentPlayer: PLAYER_ONE,
      winner: null
    };
  }

  addChecker(column) {
    this.updateBoard(column);
    this.updateWinner();
    if (!this.state.winner) {
      this.updateCurrentPlayer();
    }
    this.fireEvent('update', this.state);
  }

  updateCurrentPlayer() {
    if (this.state.currentPlayer === PLAYER_ONE) {
      this.state.currentPlayer = PLAYER_TWO;
    } else {
      this.state.currentPlayer = PLAYER_ONE;
    }
  }

  updateBoard(colIndex) {
    if (this.state.board[colIndex].every(Boolean)) return;
    this.state.board = this.state.board.map((column, i) => {
      // we create a new column otherwise react does sme weird stuff
      const newColumn = column.slice();
      if (i === colIndex) {
        newColumn[newColumn.indexOf(null)] = {
          player: this.state.currentPlayer
        };
      }
      return newColumn;
    });
  }

  updateWinner() {
    const boardState = this.state.board;
    const areEqual = (...values) => {
      return isDefined(values[0]) && values.every(val => val?.player === values[0].player)
    }

    const checkLine = (...cells) => {
      if (areEqual(...cells)) {
        cells.forEach(cell => {
          cell.isWinningCell = true;
        });
        return true;
      }
    };

    const checkHorizontalLine = (colStart, rowStart) => 
      checkLine(
        boardState[colStart][rowStart],
        boardState[colStart + 1][rowStart],
        boardState[colStart + 2][rowStart],
        boardState[colStart + 3][rowStart]
      );

    const checkVerticalLine = (colStart, rowStart) =>
      checkLine(
        boardState[colStart][rowStart],
        boardState[colStart][rowStart + 1],
        boardState[colStart][rowStart + 2],
        boardState[colStart][rowStart + 3]
      );

    const checkDiagonalLineDown = (colStart, rowStart) =>
      checkLine(
        boardState[colStart][rowStart],
        boardState[colStart + 1][rowStart - 1],
        boardState[colStart + 2][rowStart - 2],
        boardState[colStart + 3][rowStart - 3]
      );

    const checkDiagonalLineUp = (colStart, rowStart) =>
      checkLine(
        boardState[colStart][rowStart],
        boardState[colStart + 1][rowStart + 1],
        boardState[colStart + 2][rowStart + 2],
        boardState[colStart + 3][rowStart + 3]
      );

    let hasWinner = false;
    for (let col = 0; col < this.columns; col++) {
      for (let row = 0; row < this.rows; row++) {
        if (hasWinner) break;
        if (col <= this.columns - 4) {
          hasWinner = checkHorizontalLine(col, row);
          if (hasWinner) break;
        }
        if (row <= this.columns - 4) {
          hasWinner = checkVerticalLine(col, row);
          if (hasWinner) break;
        }
        if (row <= this.rows - 4 && col <= this.columns - 4) {
          hasWinner = checkDiagonalLineUp(col, row);
          if (hasWinner) break;
        }
        if (row >= this.rows - 4 && col <= this.columns - 4) {
          hasWinner = checkDiagonalLineDown(col, row);
          if (hasWinner) break;
        }
      }
    }

    if (hasWinner) {
      this.state.winner = this.state.currentPlayer;
    }
  }

  on(eventName, cb) {
    if (isUndefined(this.listeners[eventName])) {
      this.listeners[eventName] = [];
    }
    this.listeners[eventName].push(cb);

    return () => this.off(eventName, cb);
  }

  once(eventName, cb) {
    if (isUndefined(this.listeners[eventName])) {
      this.listeners[eventName] = [];
    }
    const actualCb = (...args) => {
      this.off(eventName, actualCb);
      return cb(...args);
    };
    this.listeners[eventName].push(actualCb);

    return () => this.off(eventName, actualCb);
  }

  off(eventName, cb) {
    this.listeners[eventName] = this.listeners[eventName].filter(x => x !== cb);
  }

  fireEvent(eventName, ...params) {
    if (isUndefined(this.listeners[eventName])) return params;
    this.listeners[eventName].forEach(handler => handler(...params));
  }
}

export const gameApi = new GameApi();
