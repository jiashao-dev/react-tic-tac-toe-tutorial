import React, { useState } from "react";

function findDifference(currentBoard, prevBoard) {
  for (let i = 0; i < 9; i++) {
    if (currentBoard[i] !== prevBoard[i]) {
      return i;
    }
  }
}

// Game component
export default function Game() {
  const [sortAscending, setSortAscending] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const currentSquares = history[currentMove];
  const xIsNext = currentMove % 2 === 0;

  const moves = history.map((squares, move) => {
    const isCurrentMove = move === currentMove;
    const isGameStart = move === 0;
    const squareBePlayed = isGameStart ? findDifference(squares, Array(9).fill(null)) : findDifference(squares, history[move - 1]);
    const [x, y] = [Math.floor(squareBePlayed / 3), Math.floor(squareBePlayed % 3)]
    const currentText = `You are at move #${move} ${isGameStart ? "" : `(${x}, ${y})`}`;
    const buttonText = move > 0 ? `Go to move #${move} (${x}, ${y})` : "Go to game start";

    return (
      <li key={move}>
        {
          isCurrentMove ?
            <p>{currentText}</p> :
            <p><button onClick={() => jumpTo(move)}>{buttonText}</button></p>
        }
      </li>
    )
  })

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  function handleSort() {
    setSortAscending(!sortAscending);
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <button onClick={handleSort}>Sort {sortAscending ? 'Descending' : 'Ascending'}</button>
        <ol>{sortAscending ? moves : moves.reverse()}</ol>
      </div>
    </div>
  )
}

// Board component
function Board({ xIsNext, squares, onPlay }) {
  const winner = calculateWinner(squares);

  let status;
  if (!squares.includes(null) && !winner) {
    status = "It is a draw!"
  } else if (!winner) {
    status = "Next player: " + (xIsNext ? "X" : "O");
  } else {
    status = `Winner: ${squares[winner[0]]}`
  }

  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) {
      return;
    }

    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? "X" : "O";
    onPlay(nextSquares);
  }

  const rows = [];

  // use for loops to draw the tic tac toe board
  for (let i = 0; i < 3; i++) {
    const row = [];

    for (let j = 0; j < 3; j++) {
      const squareID = i * 3 + j;

      row.push(
        <Square key={squareID} value={squares[squareID]} onSquareClick={() => handleClick(squareID)} isWinnerSquare={winner && winner.includes(squareID)} />
      )
    }

    rows.push(
      <div key={i} className="board-row">{row}</div>
    )
  }


  return (
    <React.Fragment>
      <div className="status">{status}</div>
      {rows}
    </React.Fragment>
  );
}

// Square children component
function Square({ value, onSquareClick, isWinnerSquare }) {
  return <button className={`square ${isWinnerSquare ? "winner-square" : null}`} onClick={onSquareClick}>{value}</button>
}

// To calculate the winner
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return lines[i];
    }
  }

  return null;
}