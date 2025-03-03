import React from 'react';

function Cell({ value, onClick }) {
  return (
    <div className={`cell ${value}`} onClick={onClick}>
      {value === "X" && <span className="cross">X</span>}
      {value === "O" && <span className="circle">O</span>}
      {value === "phantom" && <span className="phantom">🌀</span>}
      {value === "crusher" && <span className="crusher">💥</span>}
      {value === "stacker" && <span className="stacker">📦</span>}
    </div>
  );
}

export default Cell;