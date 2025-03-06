
def is_board_playable(mini_board):
    """
    Check if a mini-board (a 3x3 list) is playable.
    It's playable if it is not won and at least one cell is empty.
    """
    # First check if the board is won
    win_patterns = [
        # Rows
        [(0,0), (0,1), (0,2)],
        [(1,0), (1,1), (1,2)],
        [(2,0), (2,1), (2,2)],
        # Columns
        [(0,0), (1,0), (2,0)],
        [(0,1), (1,1), (2,1)],
        [(0,2), (1,2), (2,2)],
        # Diagonals
        [(0,0), (1,1), (2,2)],
        [(0,2), (1,1), (2,0)]
    ]

    # Check for wins
    for pattern in win_patterns:
        values = [mini_board[i][j] for i, j in pattern]
        if values[0] != "" and values[0] == values[1] == values[2]:
            return False  # Board is won, not playable
    # if any cell is empty and not won, assume board is playable.
    for row in mini_board:
        for cell in row:
            if cell == "":
                return True
    return False


def process_move(game_id: str, move: dict, games: dict):
    """Handles game logic, special piece effects, and updates the board."""
    game = games[game_id]
    x, y = move["x"], move["y"]
    player_id = move["player"]
    player = games[game_id]["players"][player_id]
    piece_type = move.get("piece_type", "normal")

    # Enforce active board rule if set:
    if game.get("activeBigCell") is not None:
        active = game["activeBigCell"]
        # Extract the active mini-board
        active_mini_board = []
        for i in range(3):
            row = []
            for j in range(3):
                row.append(game["board"][active["row"] * 3 + i][active["col"] * 3 + j])
            active_mini_board.append(row)

        # Only enforce active board rule if the board is playable
        if is_board_playable(active_mini_board):
            # Determine which big cell the move is in
            move_big_row, move_big_col = x // 3, y // 3
            if move_big_row != active["row"] or move_big_col != active["col"]:
                return {
                    "error": f"Invalid move. You must play in board ({active['row']}, {active['col']}).",
                    "board": game["board"],
                    "turn": player_id,
                    "activeBigCell": game["activeBigCell"],
                    "players": game["players"]
                }
        else:
            game["activeBigCell"] = None
    
    # Check if move is valid based on piece type
    if piece_type == "stacker":
        # Stacker can be placed on empty cells or opponent's pieces
        if game["board"][x][y] == "" or game["board"][x][y] != player:
            game["board"][x][y] = player
        else:
            return {
                "error": "Invalid move. Stacker can't be placed on your own piece.",
                "board": game["board"],
                "turn": player_id,
                "activeBigCell": game["activeBigCell"],
                "players": game["players"]
            }
    else:
        # Other pieces can only be placed on empty cells
        if game["board"][x][y] != "":
            return {
                "error": "Invalid move. Cell is not empty.",
                "board": game["board"],
                "turn": player_id,
                "activeBigCell": game["activeBigCell"],
                "players": game["players"]
            }
        game["board"][x][y] = player
        
        # Handle special pieces
        if piece_type == "phantom":
            apply_phantom_ability(game, player, x, y)
        elif piece_type == "crusher":
            apply_crusher_ability(game, x, y)
        
        game["turn"] = next(pid for pid in games[game_id]["players"] if pid != player_id)
        
        # Determine new active big cell based on the mini cell coordinates:
        new_active_row = x % 3  # mini row within the big cell
        new_active_col = y % 3  # mini col within the big cell

        # Extract the target mini-board from the overall board:
        target_mini_board = []
        for i in range(3):
            row = []
            for j in range(3):
                row.append(game["board"][new_active_row * 3 + i][new_active_col * 3 + j])
            target_mini_board.append(row)

        # If the target mini-board is playable, set it as active; otherwise allow play anywhere.
        if is_board_playable(target_mini_board):
            game["activeBigCell"] = {"row": new_active_row, "col": new_active_col}
        else:
            game["activeBigCell"] = None
    
    return {
        "board": game["board"],
        "turn": game["turn"],
        "activeBigCell": game["activeBigCell"],
        "players": game["players"]
    }


def apply_phantom_ability(game, player, x, y):
    """"Phantom ability: Swap with opponent's first piece to left or right."""
    # First try to find an opponent's piece to the right
    right_index = None
    left_index = None
    for j in range(y + 1, 9):
        if game["board"][x][j] != "" and game["board"][x][j] != player:
            right_index = j
    
    # If no piece found to the right, try to find one to the left
    for j in range(y - 1, -1, -1):
        if game["board"][x][j] != "" and game["board"][x][j] != player:
            left_index = j
            
    if right_index is not None and left_index is None:
        game["board"][x][y], game["board"][x][right_index] = game["board"][x][right_index], game["board"][x][y]
    elif left_index is not None and right_index is None:
        game["board"][x][y], game["board"][x][left_index] = game["board"][x][left_index], game["board"][x][y]
    elif right_index is not None and left_index is not None:
        game["board"][x][y], game["board"][x][min(right_index, left_index)] = game["board"][x][min(right_index, left_index)], game["board"][x][y]
    else:
        return

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
