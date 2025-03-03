
const socket = new WebSocket('ws://localhost:8000/ws/game/'); // Change URL to match your FastAPI endpoint

// WebSocket connection established
socket.onopen = () => {
  console.log('Connected to the server');
};

// WebSocket connection closed
socket.onclose = () => {
  console.log('Disconnected from the server');
};

// Error handling
socket.onerror = (error) => {
  console.error('WebSocket Error: ', error);
};

// Function to send move data
function sendMove(playerId, x, y, specialPiece = null) {
  const moveData = {
    type: 'move',
    player_id: playerId,
    x: x,
    y: y,
    special_piece: specialPiece, // can be 'phantom', 'crusher', or 'stacker'
  };
  socket.send(JSON.stringify(moveData));
}

// Function to receive game state updates
socket.onmessage = (event) => {
  const data = JSON.parse(event.data);

  switch (data.type) {
    case 'game_state':
      updateGameState(data.state); // Update the board and game state
      break;
    case 'player_turn':
      handlePlayerTurn(data.player_id); // Indicate whose turn it is
      break;
    case 'special_move':
      handleSpecialMove(data.special_move); // Handle the special move effects (e.g., Phantom, Crusher, Stacker)
      break;
    case 'error':
      showError(data.message); // Show any errors from the server
      break;
    default:
      console.log('Unknown message type:', data);
  }
};

// Function to update the game board (to be implemented on the frontend)
function updateGameState(state) {
  // Update the visual representation of the board and pieces
  console.log('Game state:', state);
  // Implement your logic here to render the updated game board
}

// Function to indicate whose turn it is
function handlePlayerTurn(playerId) {
  // Update UI to show whose turn it is
  console.log('Player ' + playerId + '\'s turn');
}

// Function to handle special move effects (e.g., Phantom, Crusher, Stacker)
function handleSpecialMove(specialMove) {
  // Show visual effects for the special piece abilities
  console.log('Special move:', specialMove);
  // Implement visual effects or animations based on the special move type
}

// Function to handle errors (e.g., invalid move, game state error)
function showError(message) {
  alert(message); // Display an alert with the error message
}

// Example usage for sending a move (you will need to call this with the correct parameters in your game logic)
sendMove('player1', 1, 1, 'phantom');
