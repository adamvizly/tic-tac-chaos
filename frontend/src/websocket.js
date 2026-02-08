const API_URL = 'http://localhost:8000';
const WS_URL = API_URL.replace('https', 'wss').replace('http', 'ws');

export function connectWebSocket(gameId, playerId, setGameState) {
    const socket = new WebSocket(`${WS_URL}/ws/${gameId}/${playerId}`);
  
    socket.onopen = () => {
      console.log("WebSocket connected to:", `${WS_URL}/ws/${gameId}/${playerId}`);
    };
  
    socket.onmessage = (event) => {
      try {
        const gameState = JSON.parse(event.data);
        console.log("Game state received:", gameState);
  
        if (typeof setGameState === "function") {
          setGameState(gameState);
        } else {
          console.error("setGameState is not a function:", setGameState);
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };
  
    socket.onclose = () => {
      console.log("WebSocket disconnected");
    };
  
    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };
  
    return socket;
  }
