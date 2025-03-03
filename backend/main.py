from fastapi import FastAPI, WebSocket, WebSocketDisconnect
import json

app = FastAPI()

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
            "turn": "X", 
            "players": {},
            "special_pieces": {"X": None, "O": None},
        }
    
    games[game_id]["players"][player_id] = websocket
    
    try:
        while True:
            data = await websocket.receive_text()
            move = json.loads(data)
            
            # Process the move
            response = process_move(game_id, move)
            
            # Send updated game state to both players
            for ws in active_connections[game_id]:
                await ws.send_text(json.dumps(response))
    
    except WebSocketDisconnect:
        active_connections[game_id].remove(websocket)
        if not active_connections[game_id]:
            del active_connections[game_id]
            del games[game_id]


@app.get("/matchmaking")
def matchmaking():
    """Handles basic matchmaking, returning an available game or creating a new one."""
    available_game = next((gid for gid in games if len(games[gid]["players"]) < 2), None)
    
    if available_game:
        return {"game_id": available_game}
    
    new_game_id = str(len(games) + 1)
    games[new_game_id] = {
        "board": [["" for _ in range(9)] for _ in range(9)],
        "turn": "X",
        "players": {},
        "special_pieces": {"X": None, "O": None},
    }
    return {"game_id": new_game_id}
