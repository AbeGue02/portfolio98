import React, { useState, useEffect, useCallback } from 'react';

interface Cell {
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  neighborCount: number;
}

const Minesweeper: React.FC = () => {
  const ROWS = 9;
  const COLS = 9;
  const MINES = 10;

  const [board, setBoard] = useState<Cell[][]>([]);
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost'>('playing');
  const [mineCount, setMineCount] = useState(MINES);
  const [time, setTime] = useState(0);
  const [timerActive, setTimerActive] = useState(false);

  const createEmptyBoard = (): Cell[][] => {
    return Array(ROWS).fill(null).map(() =>
      Array(COLS).fill(null).map(() => ({
        isMine: false,
        isRevealed: false,
        isFlagged: false,
        neighborCount: 0,
      }))
    );
  };

  const placeMines = (board: Cell[][], firstClickRow: number, firstClickCol: number): Cell[][] => {
    const newBoard = board.map(row => row.map(cell => ({ ...cell })));
    let minesPlaced = 0;

    while (minesPlaced < MINES) {
      const row = Math.floor(Math.random() * ROWS);
      const col = Math.floor(Math.random() * COLS);

      // Don't place mine on first click or if already a mine
      if (!newBoard[row][col].isMine && !(row === firstClickRow && col === firstClickCol)) {
        newBoard[row][col].isMine = true;
        minesPlaced++;
      }
    }

    return newBoard;
  };

  const calculateNeighbors = (board: Cell[][]): Cell[][] => {
    const newBoard = board.map(row => row.map(cell => ({ ...cell })));

    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        if (!newBoard[row][col].isMine) {
          let count = 0;
          for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
              const newRow = row + i;
              const newCol = col + j;
              if (
                newRow >= 0 && newRow < ROWS &&
                newCol >= 0 && newCol < COLS &&
                newBoard[newRow][newCol].isMine
              ) {
                count++;
              }
            }
          }
          newBoard[row][col].neighborCount = count;
        }
      }
    }

    return newBoard;
  };

  const initializeGame = useCallback(() => {
    setBoard(createEmptyBoard());
    setGameStatus('playing');
    setMineCount(MINES);
    setTime(0);
    setTimerActive(false);
  }, []);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  useEffect(() => {
    let interval: number;
    if (timerActive && gameStatus === 'playing') {
      interval = setInterval(() => {
        setTime(time => time + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive, gameStatus]);

  const revealCell = (row: number, col: number, isFirstClick = false) => {
    if (gameStatus !== 'playing') return;

    setBoard(prevBoard => {
      let newBoard = prevBoard.map(row => row.map(cell => ({ ...cell })));

      // Initialize mines on first click
      if (isFirstClick) {
        newBoard = placeMines(newBoard, row, col);
        newBoard = calculateNeighbors(newBoard);
        setTimerActive(true);
      }

      const cell = newBoard[row][col];
      if (cell.isRevealed || cell.isFlagged) return prevBoard;

      cell.isRevealed = true;

      if (cell.isMine) {
        setGameStatus('lost');
        setTimerActive(false);
        // Reveal all mines
        newBoard.forEach(row => {
          row.forEach(cell => {
            if (cell.isMine) cell.isRevealed = true;
          });
        });
        return newBoard;
      }

      // Auto-reveal adjacent cells if no neighboring mines
      if (cell.neighborCount === 0) {
        for (let i = -1; i <= 1; i++) {
          for (let j = -1; j <= 1; j++) {
            const newRow = row + i;
            const newCol = col + j;
            if (
              newRow >= 0 && newRow < ROWS &&
              newCol >= 0 && newCol < COLS &&
              !newBoard[newRow][newCol].isRevealed
            ) {
              revealCellRecursive(newBoard, newRow, newCol);
            }
          }
        }
      }

      // Check for win condition
      const unrevealedCells = newBoard.flat().filter(cell => !cell.isRevealed).length;
      if (unrevealedCells === MINES) {
        setGameStatus('won');
        setTimerActive(false);
      }

      return newBoard;
    });
  };

  const revealCellRecursive = (board: Cell[][], row: number, col: number) => {
    const cell = board[row][col];
    if (cell.isRevealed || cell.isFlagged || cell.isMine) return;

    cell.isRevealed = true;

    if (cell.neighborCount === 0) {
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          const newRow = row + i;
          const newCol = col + j;
          if (
            newRow >= 0 && newRow < ROWS &&
            newCol >= 0 && newCol < COLS
          ) {
            revealCellRecursive(board, newRow, newCol);
          }
        }
      }
    }
  };

  const toggleFlag = (row: number, col: number, e: React.MouseEvent) => {
    e.preventDefault();
    if (gameStatus !== 'playing') return;

    setBoard(prevBoard => {
      const newBoard = prevBoard.map(row => row.map(cell => ({ ...cell })));
      const cell = newBoard[row][col];

      if (!cell.isRevealed) {
        cell.isFlagged = !cell.isFlagged;
        setMineCount(prev => cell.isFlagged ? prev - 1 : prev + 1);
      }

      return newBoard;
    });
  };

  const getCellContent = (cell: Cell) => {
    if (cell.isFlagged) return '🚩';
    if (!cell.isRevealed) return '';
    if (cell.isMine) return '💣';
    if (cell.neighborCount === 0) return '';
    return cell.neighborCount.toString();
  };

  const getCellStyle = (cell: Cell) => {
    const baseStyle = {
      width: '20px',
      height: '20px',
      border: cell.isRevealed ? '1px inset #c3c3c3' : '2px outset #c3c3c3',
      background: cell.isRevealed ? '#c3c3c3' : '#c3c3c3',
      fontSize: '12px',
      fontWeight: 'bold',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: gameStatus === 'playing' ? 'pointer' : 'default',
      userSelect: 'none' as const,
    };

    if (cell.isRevealed && cell.neighborCount > 0) {
      const colors = [
        '', '#0000ff', '#008000', '#ff0000', '#000080',
        '#800000', '#008080', '#000000', '#808080'
      ];
      return { ...baseStyle, color: colors[cell.neighborCount] };
    }

    return baseStyle;
  };

  return (
    <div style={{ padding: '8px', textAlign: 'center' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
        <div className="win98-border-inset" style={{ padding: '4px', minWidth: '40px' }}>
          {String(mineCount).padStart(3, '0')}
        </div>
        <button className="win98-button" onClick={initializeGame}>
          {gameStatus === 'won' ? '😎' : gameStatus === 'lost' ? '😵' : '🙂'}
        </button>
        <div className="win98-border-inset" style={{ padding: '4px', minWidth: '40px' }}>
          {String(time).padStart(3, '0')}
        </div>
      </div>

      <div 
        className="win98-border-inset" 
        style={{ 
          padding: '4px', 
          display: 'inline-block',
          background: '#c3c3c3'
        }}
      >
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: `repeat(${COLS}, 20px)`,
          gap: '0px'
        }}>
          {board.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                style={getCellStyle(cell)}
                onClick={() => revealCell(rowIndex, colIndex, time === 0)}
                onContextMenu={(e) => toggleFlag(rowIndex, colIndex, e)}
              >
                {getCellContent(cell)}
              </div>
            ))
          )}
        </div>
      </div>

      {gameStatus === 'won' && (
        <div style={{ marginTop: '8px', color: 'green', fontWeight: 'bold' }}>
          You Win! 🎉
        </div>
      )}
      {gameStatus === 'lost' && (
        <div style={{ marginTop: '8px', color: 'red', fontWeight: 'bold' }}>
          Game Over! 💥
        </div>
      )}
    </div>
  );
};

export default Minesweeper;
