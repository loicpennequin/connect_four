import { v4 as uuid } from 'uuid';
import { constants, isDefined } from '@c4/shared';
import { container } from '@root/container';
import { withLog } from '@root/logger';
import { wrapDecorator as wrap } from '@root/modules/core/ErrorFactory';

const { EVENTS } = constants;

export class GameRoom {
  ROWS = 6;
  COLUMNS = 7;
  PLAYER_ONE = 'a';
  PLAYER_TWO = 'b';

  constructor({ playerIds }) {
    this.websocketService = container.resolve('webSocketService');
    this.gameService = container.resolve('gameService');

    this.state = {
      id: uuid(),
      playerIds,
      board: this._createBoard(),
      winner: null,
      rows: this.ROWS,
      columns: this.COLUMNS,
      currentPlayer: playerIds[Math.round(Math.random())]
    };

    this.websocketService.emit(
      EVENTS.GAME_HAS_BEEN_CREATED,
      this.state,
      ...this.clients
    );

    this.websocketService.on(EVENTS.GAME_ACTION, this.onGameAction.bind(this));
  }

  get clients() {
    return this.state.playerIds.map(id =>
      this.websocketService.getSocketByUserId(id)
    );
  }

  @withLog()
  @wrap()
  async onGameAction(_ws, data) {
    if (data.gameId !== this.state.id) return;

    this._updateBoard(data.column);
    this._updateWinner();
    if (!this.state.winner) {
      this._updateCurrentPlayer();
      this.websocketService.emit(EVENTS.GAME_ACTION, this.state, ...this.clients);
    } else {
      this.websocketService.emit(EVENTS.GAME_ACTION, this.state, ...this.clients);
      await this.gameService.create({
        user1Id: this.state.playerIds[0],
        user2Id: this.state.playerIds[1],
        winnerId: this.state.winner
      });

      this.websocketService.emit(EVENTS.GAME_HAS_FINISHED, this.state, ...this.clients);
      this.gameService.removeGameInstance(this.state.id);
    }

  }

  _createBoard() {
    const board = [];
    for (let i = 0; i < this.COLUMNS; i++) {
      board.push(new Array(this.ROWS).fill(null));
    }
    return board;
  }

  _updateBoard(colIndex) {
    if (this.state.board[colIndex].every(Boolean)) return;
    
    this.state.board.forEach((column, i) => {
      if (i === colIndex) {
        column[column.indexOf(null)] = {
          player: this.state.currentPlayer
        };
      }
    });
  }

  _updateCurrentPlayer() {
    if (this.state.currentPlayer === this.state.playerIds[0]) {
      this.state.currentPlayer = this.state.playerIds[1];
    } else {
      this.state.currentPlayer = this.state.playerIds[0];
    }
  }

  _updateWinner() {
    const boardState = this.state.board;
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
    for (let col = 0; col < this.state.columns; col++) {
      for (let row = 0; row < this.state.rows; row++) {
        if (hasWinner) break;
        if (col <= this.state.columns - 4) {
          hasWinner = checkHorizontalLine(col, row);
          if (hasWinner) break;
        }
        if (row <= this.state.columns - 4) {
          hasWinner = checkVerticalLine(col, row);
          if (hasWinner) break;
        }
        if (row <= this.state.rows - 4 && col <= this.state.columns - 4) {
          hasWinner = checkDiagonalLineUp(col, row);
          if (hasWinner) break;
        }
        if (row >= this.state.rows - 4 && col <= this.state.columns - 4) {
          hasWinner = checkDiagonalLineDown(col, row);
          if (hasWinner) break;
        }
      }
    }

    if (hasWinner) {
      this.state.winner = this.state.currentPlayer;
    }
  }
}
