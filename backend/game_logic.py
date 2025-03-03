def process_move(game_id: str, move: dict, games: dict):
    """Handles game logic, special piece effects, and updates the board."""
    game = games[game_id]
    x, y = move["x"], move["y"]
    player = move["player"]
    piece_type = move.get("piece_type", "normal")
    
    if game["board"][x][y] == "":  # If the cell is empty
        game["board"][x][y] = player
        
        # Handle special pieces
        if piece_type == "phantom":
            apply_phantom_ability(game, player, x, y)
        elif piece_type == "crusher":
            apply_crusher_ability(game, x, y)
        elif piece_type == "stacker":
            apply_stacker_ability(game, x, y)
        
        game["turn"] = "O" if player == "X" else "X"  # Switch turn
    
    return {"board": game["board"], "turn": game["turn"]}


def apply_phantom_ability(game, player, x, y):
    """Phantom ability: Swap with opponent's next piece down."""
    for i in range(x + 1, 9):
        if game["board"][i][y] != "":
            game["board"][x][y], game["board"][i][y] = game["board"][i][y], game["board"][x][y]
            break


def apply_crusher_ability(game, x, y):
    """Crusher ability: Push adjacent (not diagonal) pieces one spot away."""
    directions = [(0, 1), (0, -1), (1, 0), (-1, 0)]
    for dx, dy in directions:
        nx, ny = x + dx, y + dy
        if 0 <= nx < 9 and 0 <= ny < 9 and game["board"][nx][ny] != "":
            nnx, nny = nx + dx, ny + dy
            if 0 <= nnx < 9 and 0 <= nny < 9 and game["board"][nnx][nny] == "":
                game["board"][nnx][nny] = game["board"][nx][ny]
                game["board"][nx][ny] = ""


def apply_stacker_ability(game, x, y):
    """Stacker ability: Allows stacking on top of other pieces."""
    pass  # Handled by default rules, just allows stacking
