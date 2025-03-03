import React from 'react';
import Cell from './Cell';

function GameBoard({ gameState, playerId, socket }) {
  if (!gameState) return <p>Loading game...</p>;

  const handleMove = (x, y) => {
    if (gameState.turn !== playerId) return;
    socket.send(JSON.stringify({ player: playerId, x, y, piece_type: "normal" }));
  };

  return (
    <div className="game-board">
      {gameState.board.map((row, rowIndex) => (
        <div key={rowIndex} className="row">
          {row.map((cell, colIndex) => (
            <Cell key={colIndex} value={cell} onClick={() => handleMove(rowIndex, colIndex)} />
          ))}
        </div>
      ))}
    </div>
  );
}

export default GameBoard;