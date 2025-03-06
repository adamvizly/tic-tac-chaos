import React from "react";
import Cell from "./Cell";

function GameBoard({ gameState, playerId, socket }) {
  if (!gameState || !Array.isArray(gameState.board)) {
    return <div>Loading game...</div>;
  }
  
  const { board, turn, activeBigCell } = gameState;

  // Sends a move to the backend.
  // Converts mini-board indices into overall board indices using your mapping.
  const handleCellClick = (bigRow, bigCol, miniRow, miniCol, piece_type = "normal") => {
    console.log("handleCellClick", bigRow, bigCol, miniRow, miniCol);
    // Using your mapping (note: adjust as needed if mapping needs to be flipped)
    const overallRow = bigRow * 3 + miniCol;
    const overallCol = bigCol * 3 + miniRow;
    console.log(overallRow, overallCol);
    if (socket && turn === playerId) {
      console.log("sending move", overallRow, overallCol, playerId, piece_type);
      const move = {
        x: overallRow,
        y: overallCol,
        player: playerId,
        piece_type: piece_type,
      };
      socket.send(JSON.stringify(move));
    }
  };

  // Helper: extract the 9 cells for a mini-board.
  const getMiniBoardCells = (bigRow, bigCol) => {
    let miniCells = [];
    for (let miniRow = 0; miniRow < 3; miniRow++) {
      for (let miniCol = 0; miniCol < 3; miniCol++) {
        const overallRow = bigRow * 3 + miniCol;
        const overallCol = bigCol * 3 + miniRow;
        miniCells.push(board[overallRow][overallCol]);
      }
    }
    return miniCells;
  };

  // Helper function to check if a mini-board (flat array of 9 cells) is won.
  const cellIsWon = (miniCells) => {
    if (!Array.isArray(miniCells) || miniCells.length !== 9) return null;
    const winPatterns = [
      [0, 1, 2], // rows
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6], // columns
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8], // diagonals
      [2, 4, 6],
    ];
    for (const pattern of winPatterns) {
      const [a, b, c] = pattern;
      if (miniCells[a] && miniCells[a] === miniCells[b] && miniCells[a] === miniCells[c]) {
        return miniCells[a]; // Return 'X' or 'O'
      }
    }
    return null;
  };

  // Function to check if the game is won
  const isGameWon = () => {
    // Check each row, column, and diagonal of the big board
    const bigBoard = Array(3).fill().map(() => Array(3).fill(null));
    
    // Fill the big board with mini-board winners
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const miniCells = getMiniBoardCells(i, j);
        bigBoard[i][j] = cellIsWon(miniCells);
      }
    }
    
    // Check if any player has won the big board
    return cellIsWon(bigBoard.flat());
  };

  const winner = isGameWon();
  const playerSymbol = gameState.players?.[playerId];

  // Get status message
  let statusMessage;
  if (winner) {
    statusMessage = winner === playerSymbol ? "You Won!" : "You Lost!";
  } else {
    statusMessage = turn === playerId ? "It's Your Turn" : "It's Opponent's Turn";
  }

  return (
    <div>
      <h2 className="game-status">{statusMessage}</h2>
      <div className="game-board big">
        {/* Loop over 3 big rows */}
        {[0, 1, 2].map((bigRow) => (
          <div key={bigRow} className="big-row">
            {/* Loop over 3 big columns */}
            {[0, 1, 2].map((bigCol) => {
              const miniCells = getMiniBoardCells(bigRow, bigCol);
              const winner = cellIsWon(miniCells);
              // Check if this big cell is the active board.
              const isActive = activeBigCell && activeBigCell.row === bigRow && activeBigCell.col === bigCol;
              return (
                <div
                  key={`${bigRow}-${bigCol}`}
                  className={`big-cell ${isActive ? "active-big-cell" : ""}`}
                >
                  <div className="mini-board">
                    {[0, 1, 2].map((miniRow) => (
                      <div key={miniRow} className="mini-row">
                        {[0, 1, 2].map((miniCol) => (
                          <Cell
                            key={`${bigRow}-${bigCol}-${miniRow}-${miniCol}`}
                            value={board[bigRow * 3 + miniCol][bigCol * 3 + miniRow]}
                            onClick={() =>
                              handleCellClick(bigRow, bigCol, miniRow, miniCol)
                            }
                          />
                        ))}
                      </div>
                    ))}
                  </div>
                  {winner && (
                    <div className={`board-overlay ${winner}`}>
                      {winner}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameBoard;
