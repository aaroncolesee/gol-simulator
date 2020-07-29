import React, { useState, useCallback, useRef } from "react";
import produce from "immer";

const numRows = 30;
const numCols = 40;

const operations = [
  [0, 1],
  [0, -1],
  [1, -1],
  [-1, 1],
  [1, 1],
  [-1, -1],
  [1, 0],
  [-1, 0],
];

const generateGrid = () => {
  const grid = Array(numRows).fill(Array(numCols).fill(0));
  return grid;
};

function App() {
  const [grid, setGrid] = useState(generateGrid());
  const [running, setRunning] = useState(false);
  const [speed, setSpeed] = useState(550);
  const [isPressed, setIsPressed] = useState(false);

  const runningRef = useRef(running);
  runningRef.current = running;

  const speedRef = useRef(speed);
  speedRef.current = speed;

  const isPressedRef = useRef(isPressed);
  isPressedRef.current = isPressed;

  const runSimulation = useCallback(() => {
    if (!runningRef.current) {
      return;
    }

    setGrid((grid) => {
      return produce(grid, (gridCopy) => {
        for (let x = 0; x < numRows; x++) {
          for (let y = 0; y < numCols; y++) {
            let neighbors = 0;
            operations.forEach(([i, j]) => {
              const newX = x + i;
              const newY = y + j;
              if (newX >= 0 && newX < numRows && newY >= 0 && newY < numCols) {
                neighbors += grid[newX][newY];
              }
            });
            if (grid[x][y] === 1 && neighbors < 2) {
              gridCopy[x][y] = 0;
            } else if (
              grid[x][y] === 1 &&
              (neighbors === 2 || neighbors === 3)
            ) {
              gridCopy[x][y] = 1;
            } else if (grid[x][y] === 1 && neighbors > 3) {
              gridCopy[x][y] = 0;
            } else if (grid[x][y] === 0 && neighbors === 3) {
              gridCopy[x][y] = 1;
            }
          }
        }
      });
    });

    setTimeout(runSimulation, speedRef.current);
  }, []);

  return (
    <div
      style={{
        display: "grid",
        gridTemplate: "auto 1fr auto",
        placeItems: "center",
      }}
    >
      <div
        className="header"
        style={{
          fontSize: "3rem",
        }}
      >
        Game of Life
      </div>
      <div
        className="board"
        style={{
          margin: "20px 0 20px 0",
          display: "grid",
          gridTemplateColumns: `repeat(${numCols}, 20px)`,
        }}
      >
        {grid.map((rows, x) =>
          rows.map((col, y) => (
            <div
              key={`${x}-${y}`}
              onClick={() => {
                if (!isPressed) {
                  const newGrid = produce(grid, (gridCopy) => {
                    gridCopy[x][y] = gridCopy[x][y] ? 0 : 1;
                  });
                  setGrid(newGrid);
                }
                setIsPressed(!isPressed);
              }}
              onMouseEnter={() => {
                if (isPressed) {
                  const newGrid = produce(grid, (gridCopy) => {
                    gridCopy[x][y] = gridCopy[x][y] ? 0 : 1;
                  });
                  setGrid(newGrid);
                }
              }}
              style={{
                height: 20,
                width: 20,
                backgroundColor: grid[x][y] ? "turquoise" : undefined,
                border: "solid 1px black",
              }}
            />
          ))
        )}
      </div>
      <div className="controls">
        <div className="slide-container">
          <input
            type="range"
            list="ticks"
            value={speedRef.current}
            min="100"
            max="1000"
            step="450"
            className="slider"
            onChange={(event) => {
              console.log(event.target.value);
              setSpeed(event.target.value);
            }}
          />
          <datalist id="ticks">
            <option value="100" />
            <option value="550" />
            <option value="1000" />
          </datalist>
        </div>
        <button
          onClick={() => {
            setRunning(false);
            setGrid(generateGrid());
          }}
        >
          Reset
        </button>
        <button
          onClick={() => {
            setRunning(!running);
            if (!running) {
              runningRef.current = true;
              runSimulation();
            }
          }}
        >
          {running ? "Stop" : "Start"}
        </button>
      </div>
    </div>
  );
}
export default App;
