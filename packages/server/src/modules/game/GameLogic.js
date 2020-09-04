import { isDefined } from '@c4/shared';
import { v4 as uuid } from 'uuid';

export class GameLogic {
  ROWS = 6;
  COLUMNS = 7;
  PLAYER_ONE = 'a';
  PLAYER_TWO = 'b';

  initializeState(playerIds = [], initialState = {}) {
    return {
      id: uuid(),
      playerIds,
      board: this.createBoard(),
      winner: null,
      rows: this.ROWS,
      columns: this.COLUMNS,
      currentPlayer: playerIds[Math.round(Math.random())],
      ...initialState
    };
  }

  createBoard() {
    const board = [];
    for (let i = 0; i < this.COLUMNS; i++) {
      board.push(new Array(this.ROWS).fill(null));
    }
    return board;
  }

  handleGameAction(state, column) {
    return this.updateCurrentPlayer(this.updateWinner(this.updateBoard(state, column)));
  }

  updateBoard(state, colIndex) {
    if (state.board[colIndex].every(Boolean)) return state;

    state.board.forEach((column, i) => {
      if (i === colIndex) {
        column[column.indexOf(null)] = {
          player: state.currentPlayer
        };
      }
    });

    return state;
  }

  updateCurrentPlayer(state) {
    if (state.currentPlayer === state.playerIds[0]) {
      state.currentPlayer = state.playerIds[1];
    } else {
      state.currentPlayer = state.playerIds[0];
    }

    return state;
  }

  updateWinner(state) {
    const boardState = state.board;
    const areEqual = (...values) => {
      return (
        isDefined(values[0]) &&
        values.every(val => val?.player === values[0].player)
      );
    };

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

    const checkVerticalLine = (colStart, rowStart) => {
      return checkLine(
        boardState[colStart][rowStart],
        boardState[colStart][rowStart + 1],
        boardState[colStart][rowStart + 2],
        boardState[colStart][rowStart + 3]
      );
    };

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
    for (let col = 0; col < state.columns; col++) {
      for (let row = 0; row < state.rows; row++) {
        if (hasWinner) break;
        if (col <= state.columns - 4) {
          hasWinner = checkHorizontalLine(col, row);
          if (hasWinner) break;
        }
        if (row <= state.columns - 4) {
          hasWinner = checkVerticalLine(col, row);
          if (hasWinner) break;
        }
        if (row <= state.rows - 4 && col <= state.columns - 4) {
          hasWinner = checkDiagonalLineUp(col, row);
          if (hasWinner) break;
        }
        if (row >= state.rows - 4 && col <= state.columns - 4) {
          hasWinner = checkDiagonalLineDown(col, row);
          if (hasWinner) break;
        }
      }
    }

    if (hasWinner) {
      state.winner = state.currentPlayer;
    }

    return state;
  }
}
