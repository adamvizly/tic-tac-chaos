import React, { useState } from 'react';

function Matchmaking({ setGameId, setPlayerId }) {
  const [loading, setLoading] = useState(false);

  const findMatch = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/matchmaking');
      const data = await response.json();
      setGameId(data.game_id);
      setPlayerId(Math.random().toString(36).substring(7)); // Generate random player ID
    } catch (error) {
      console.error('Error finding match:', error);
    }
    setLoading(false);
  };

  return (
    <div className="matchmaking-container">
      <h2>Tic-Tac-Chaos</h2>
      <button onClick={findMatch} disabled={loading}>
        {loading ? 'Finding match...' : 'Find Match'}
      </button>
    </div>
  );
}

export default Matchmaking;
