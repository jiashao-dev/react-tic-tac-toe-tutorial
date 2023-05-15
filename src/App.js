import React, { useState } from "react";

// Game component
export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const currentSquares = history[currentMove];
  const xIsNext = currentMove % 2 === 0;

  const moves = history.map((squares, move) => {
    let description = move > 0 ? "Go to move #" + move : "Go to game start";
    return (
      <li key={move}>
        {
          move === currentMove ? 
            <p>{`You are at move #${move}`}</p> :
            <p><button onClick={() => jumpTo(move)}>{description}</button></p>
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

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  )
}

// Board component
function Board({ xIsNext, squares, onPlay }) {
  const winner = calculateWinner(squares);

  let status = winner ? "Winner: " + winner : "Next player: " + (xIsNext ? "X" : "O");

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
      row.push(
        <Square key={i * 3 + j} value={squares[i * 3 + j]} onSquareClick={() => handleClick(i * 3 + j)} />
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
function Square({ value, onSquareClick }) {
  return <button className="square" onClick={onSquareClick}>{value}</button>
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
      return squares[a];
    }
  }

  return null;
}