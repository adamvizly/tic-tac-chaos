# Tic-Tac-Chaos

Tic-Tac-Chaos is an exciting twist on Ultimate Tic-tac-toe, featuring special pieces and unique gameplay mechanics. This multiplayer web game combines strategic thinking with special abilities to create a dynamic and engaging experience.

## Game Rules

### Basic Rules
- The game is played on 9 small tic-tac-toe boards arranged in a 3x3 grid.
- Your move in a small board determines which big board your opponent must play in next.
- Win three small boards in a row to win the game.
- If sent to a completed board, you can play in any available board.

### Special Pieces
Each player gets one of each special piece per game:

1. 🌀 **Phantom**
   - Can swap positions with an opponent's piece to the left or right.
   - Use strategically to disrupt opponent's patterns.

2. 💥 **Crusher**
   - Pushes adjacent pieces one space away (but not diagonally).
   - Great for creating space or breaking opponent's lines.

3. 📦 **Stacker**
   - Can be placed on top of opponent's existing pieces.
   - Cannot be placed on your own pieces.
   - Perfect for capturing key positions.

## Technology Stack

- **Frontend**: React.js
- **Backend**: FastAPI (Python)
- **WebSocket**: For real-time game communication

## Running the Project with Docker

To run the Tic-Tac-Chaos game using Docker, follow these steps:

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/adamvizly/tic-tac-chaos.git
   cd tic-tac-chaos
   ```

2. **Build and Run with Docker Compose**:
   Ensure Docker and Docker Compose are installed on your machine. Then, run the following command:
   ```bash
   docker-compose up --build
   ```

3. **Access the Game**:
   - The backend will be accessible at `http://localhost:8000`.
   - The frontend will be accessible at `http://localhost:3000`.

## To-Do List

- [ ] Implement user authentication for secure player identification.
- [ ] Write unit tests for backend game logic.
- [ ] Add a leaderboard to track player scores and rankings.
- [ ] Enhance the UI with animations and sound effects.
- [ ] Implement AI opponents for single-player mode.
- [ ] Add more special pieces with unique abilities.
- [ ] Optimize performance for mobile devices.

Feel free to contribute to the project by submitting pull requests or opening issues for any bugs or feature requests.
