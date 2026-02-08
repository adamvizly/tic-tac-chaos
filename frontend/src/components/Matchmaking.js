import React, { useState } from 'react';

function Matchmaking({ setGameId, setPlayerId }) {
  const [loading, setLoading] = useState(false);

  const findGame = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://tic-tac-chaos-production.up.railway.app/matchmaking');
      const data = await response.json();

      if (data.game_id) {
        setGameId(data.game_id);
        setPlayerId(Math.random().toString(36).substr(2, 5)); // Generate random player ID
      }
    } catch (error) {
      console.error('Error finding game:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="matchmaking">
      <h1>Tic-Tac-Chaos</h1>
      <div className="game-rules">
        <h3>How to Play</h3>
        <p>
          Welcome to Tic-Tac-Chaos, an exciting twist on Ultimate Tic-tac-toe! 
          The game consists of 9 small tic-tac-toe boards arranged in a 3x3 grid.
        </p>
        
        <h4>Basic Rules:</h4>
        <ul>
          <li>Your move in a small board determines which big board your opponent must play in next</li>
          <li>Win three small boards in a row to win the game</li>
          <li>If sent to a completed board, you can play in any available board</li>
        </ul>

        <h4>Special Pieces:</h4>
        <ul>
          <li>🌀 <strong>Phantom</strong>: Can swap positions with an opponent's piece to the left or right</li>
          <li>💥 <strong>Crusher</strong>: Pushes adjacent pieces one space away (but not diagonally)</li>
          <li>📦 <strong>Stacker</strong>: Can be placed on top of existing pieces (but not your own)</li>
        </ul>
        <p>Each player gets one of each special piece per game - use them wisely!</p>
      </div>
      <button onClick={findGame} disabled={loading}>
        {loading ? "Finding game..." : "Find Match"}
      </button>
    </div>
  );
}

export default Matchmaking;
