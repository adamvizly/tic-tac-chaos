from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import json
from game_logic import process_move

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change this to specific frontend domain if needed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Store active games {game_id: game_state}
games = {}

# Store connected players {game_id: [player1_ws, player2_ws]}
active_connections = {}

@app.websocket("/ws/{game_id}/{player_id}")
async def websocket_endpoint(websocket: WebSocket, game_id: str, player_id: str):
    await websocket.accept()
    
    if game_id not in active_connections:
        active_connections[game_id] = []
    active_connections[game_id].append(websocket)
    
    if game_id not in games:
        games[game_id] = {
            "board": [["" for _ in range(9)] for _ in range(9)], 
            "turn": None,  # Use player_id for turn
            "players": {},
            "special_pieces": {},
        }
    
    # Assign "X" or "O" to the player
    if len(games[game_id]["players"]) == 0:
        games[game_id]["players"][player_id] = "X"
        games[game_id]["turn"] = player_id  # First player to join gets the first turn
    elif len(games[game_id]["players"]) == 1:
        games[game_id]["players"][player_id] = "O"
    
    games[game_id]["special_pieces"][player_id] = None
    
    # Send the initial game state to the newly connected player
    initial_state = {
        "board": games[game_id]["board"],
        "turn": games[game_id]["turn"],
        "special_pieces": games[game_id]["special_pieces"],
        "players": games[game_id]["players"]
    }
    await websocket.send_text(json.dumps(initial_state))
    
    try:
        while True:
            data = await websocket.receive_text()
            move = json.loads(data)
            print(move)
            # Process the move
            response = process_move(game_id, move, games)
            
            # Update the turn to the next player
            current_turn = games[game_id]["turn"]
            next_turn = next(pid for pid in games[game_id]["players"] if pid != current_turn)
            games[game_id]["turn"] = next_turn
            
            # Send updated game state to both players
            for ws in active_connections[game_id]:
                await ws.send_text(json.dumps(response))
    
    except WebSocketDisconnect:
        active_connections[game_id].remove(websocket)
        if not active_connections[game_id]:
            del active_connections[game_id]
            del games[game_id]
        print(f"Client {player_id} disconnected")


@app.get("/matchmaking")
def matchmaking():
    """Handles basic matchmaking, returning an available game or creating a new one."""
    available_game = next((gid for gid in games if len(games[gid]["players"]) < 2), None)
    
    if available_game:
        return {"game_id": available_game}
    
    new_game_id = str(len(games) + 1)
    games[new_game_id] = {
        "board": [["" for _ in range(9)] for _ in range(9)],
        "turn": None,
        "players": {},
        "special_pieces": {},
        "activeBigCell": None
    }
    return {"game_id": new_game_id}
