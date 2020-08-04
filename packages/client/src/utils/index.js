export const getFocusableChildren = node =>
  node.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );

export const keys = {
  ESCAPE: 27
};

export const createUrl = (route, params) =>
  Object.entries(params).reduce(
    (path, [param, value]) => path.replace(`:${param}`, value),
    route
  );

export const isGameOver = boardState => {
  const ROWS = 6;
  const COLUMNS = 7;

  const areEqual = (...values) => {
    for (let i = 1; i < values.length; i++) {
      if (values[i] === null || values[i] !== values[i - 1]) return false;
    }
    return true;
  };
  const checkHorizontalLine = (colStart, rowStart) =>
    areEqual(
      boardState[colStart][rowStart],
      boardState[colStart + 1][rowStart],
      boardState[colStart + 2][rowStart],
      boardState[colStart + 3][rowStart]
    ) && boardState[colStart][rowStart];

  const checkVerticalLine = (colStart, rowStart) =>
    areEqual(
      boardState[colStart][rowStart],
      boardState[colStart][rowStart + 1],
      boardState[colStart][rowStart + 2],
      boardState[colStart][rowStart + 3]
    ) && boardState[colStart][rowStart];

  const checkDiagonalLineDown = (colStart, rowStart) =>
    areEqual(
      boardState[colStart][rowStart],
      boardState[colStart + 1][rowStart - 1],
      boardState[colStart + 2][rowStart - 2],
      boardState[colStart + 3][rowStart - 3]
    ) && boardState[colStart][rowStart];

  const checkDiagonalLineUp = (colStart, rowStart) =>
    areEqual(
      boardState[colStart][rowStart],
      boardState[colStart + 1][rowStart + 1],
      boardState[colStart + 2][rowStart + 2],
      boardState[colStart + 3][rowStart + 3]
    ) && boardState[colStart][rowStart];

  let winner = null;

  for (let col = 0; col < COLUMNS; col++) {
    for (let row = 0; row < ROWS; row++) {
      if (col <= COLUMNS - 4) {
        if (checkHorizontalLine(col, row)) winner = checkHorizontalLine(col, row);
      }
      if (row <= ROWS - 4) {
        if (checkVerticalLine(col, row)) winner = checkVerticalLine(col, row);
      }
      if (row <= ROWS - 4 && col <= COLUMNS - 4) { 
        if (checkDiagonalLineUp(col, row)) winner = checkDiagonalLineUp(col, row);
      }
      if (row >= ROWS - 4 && col <= COLUMNS - 4) { 
        if (checkDiagonalLineDown(col, row)) winner = checkDiagonalLineDown(col, row);
      }
    }
  }

  return winner
};