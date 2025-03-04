import React, { useState } from 'react';

function Matchmaking({ setGameId, setPlayerId }) {
  const [loading, setLoading] = useState(false);

  const findGame = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/matchmaking');
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
      <h2>Tic-Tac-Chaos</h2>
      <button onClick={findGame} disabled={loading}>
        {loading ? "Finding game..." : "Find Match"}
      </button>
    </div>
  );
}

export default Matchmaking;
