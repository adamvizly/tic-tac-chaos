import React, { useState, useEffect } from 'react';
import Matchmaking from './components/Matchmaking';
import GameBoard from './components/GameBoard';
import { connectWebSocket } from './websocket';

function App() {
  const [gameId, setGameId] = useState(null);
  const [playerId, setPlayerId] = useState(null);
  const [socket, setSocket] = useState(null);
  const [gameState, setGameState] = useState(null);

  useEffect(() => {
    if (gameId && playerId) {
      const ws = connectWebSocket(gameId, playerId, setGameState);
      setSocket(ws);
    }
  }, [gameId, playerId]);

  useEffect(() => {
    console.log("Updated gameState:", gameState); // Debugging line
  }, [gameState]);

  return (
    <div className="app-container">
      {!gameId ? (
        <Matchmaking setGameId={setGameId} setPlayerId={setPlayerId} />
      ) : (
        <GameBoard gameState={gameState} playerId={playerId} socket={socket} />
      )}
    </div>
  );
}

export default App;
