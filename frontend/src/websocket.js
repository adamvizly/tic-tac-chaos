export function connectWebSocket(gameId, playerId, setGameState) {
    const socket = new WebSocket(`ws://localhost:8000/ws/${gameId}/${playerId}`);
  
    socket.onopen = () => {
      console.log("WebSocket connected");
    };
  
    socket.onmessage = (event) => {
      try {
        const gameState = JSON.parse(event.data);
        console.log("Game state received:", gameState);
  
        if (typeof setGameState === "function") {
          setGameState(gameState);  // Ensure it's a function before calling
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
  