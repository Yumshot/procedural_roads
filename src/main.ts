// import './vionori';
import { colorPalette } from './exports';
import './style.css';
const canvas = document.querySelector<HTMLCanvasElement>('#myCanvas')!
const ctx: CanvasRenderingContext2D | null = canvas.getContext("2d");
const grid = [9, 9];
const gridSize = Math.min(canvas.width, canvas.height);
const cellSize = gridSize / grid[0];
// Adjust this variable to control the density of the pathways
const pathwayThreshold = 0.5;
// Adjust the Lines Drawn
const repetitons = 1;
// Calculate the position of the top-left corner of the grid
const gridOffsetX = (canvas.width - gridSize) / 2;
const gridOffsetY = (canvas.height - gridSize) / 2;

// Program Initalization
export const main = () => {
    if (!ctx) return;
    drawBoundingSquare();
}

const getStartAndEndPoints = () => {
    const startX = gridOffsetX - 0.5;
    let endX = gridOffsetX + gridSize - cellSize;
    let startY = gridOffsetY + cellSize * Math.floor(Math.random() * grid[1]);
    let endY = gridOffsetY + cellSize * Math.floor(Math.random() * grid[1]);
    if (startY === gridOffsetY || endY === gridOffsetY) {
        startY += cellSize;
        endY += cellSize;
    }
    return { startX, endX, startY, endY };
};

const updateCurrentPositionAndDirection = (currentX: number, currentY: number, currentDirection: 0 | 1 | 2 | 3, directionFunctions: {
    0: () => 1 | 3; // either right or left
    1: () => 0 | 2; // either up or down
    2: () => 1 | 3; // either right or left
    3: () => 0 | 2;
}) => {
    const { endX, endY } = getStartAndEndPoints();
    const directionFunction = directionFunctions[currentDirection];
    currentDirection = directionFunction();
    switch (currentDirection) {
        case 0: // up
            currentY -= cellSize;
            if (currentY < gridOffsetY + cellSize) {
                currentY = gridOffsetY + cellSize;
                currentX += cellSize;
                currentDirection = Math.random() < 0.5 ? 1 : 3; // either right or left
            }
            break;
        case 1: // right
            currentX += cellSize;
            if (currentX > endX) {
                currentX = endX;
                currentY += cellSize;
                currentDirection = Math.random() < 0.5 ? 0 : 2; // either up or down
            }
            break;
        case 2: // down
            currentY += cellSize;
            if (currentY > endY) {
                currentY = endY;
                currentX -= cellSize;
                currentDirection = Math.random() < 0.5 ? 1 : 3; // either right or left
            }
            break;
        case 3: // left
            currentX -= cellSize;
            if (currentX < gridOffsetX + cellSize) {
                currentX = gridOffsetX + cellSize;
                currentY -= cellSize;
                currentDirection = Math.random() < 0.5 ? 0 : 2; // either up or down
            }
            break;
    }
    return { currentX, currentY, currentDirection };
};


export const drawOneWayRoad = () => {
    if (!ctx) return;
    const { startX, endX, startY, endY } = getStartAndEndPoints();
    let currentDirection = Math.floor(Math.random() * 4) as 0 | 1 | 2 | 3; // 0: up, 1: right, 2: down, 3: left
    let currentX = startX;
    let currentY = startY;
    let counter = 0;
    const directionFunctions = {
        0: () => currentDirection = currentX === startX ? 1 : currentX === endX ? 3 : Math.random() < 0.5 ? 1 : 3,
        1: () => currentDirection = currentY === startY ? 2 : currentY === endY ? 0 : Math.random() < 0.5 ? 0 : 2,
        2: () => currentDirection = currentX === startX ? 1 : currentX === endX ? 3 : Math.random() < 0.5 ? 1 : 3,
        3: () => currentDirection = currentY === startY ? 2 : currentY === endY ? 0 : Math.random() < 0.5 ? 0 : 2,
      };

    ctx.strokeStyle = colorPalette[5];
    ctx.beginPath();
    ctx.moveTo(currentX, currentY);

    const maxIterations = 1000;

    while (currentX != endX || currentY != endY) {
        ({ currentX, currentY, currentDirection } = updateCurrentPositionAndDirection(currentX, currentY, currentDirection, directionFunctions));
        ctx.lineTo(currentX, currentY);
        counter++;
        if (counter > maxIterations) {
            console.error('Infinite loop detected in drawOneWayRoad');
            break;
        }
    }

    ctx.stroke();
};




export const drawBoundingSquare = () => {
    if (!ctx) return;
    const squareOffset = (gridSize - cellSize * grid[0]) / 2;
    ctx.strokeStyle = colorPalette[3];
    ctx.lineWidth = 2.5;
    ctx.strokeRect(gridOffsetX - squareOffset, gridOffsetY - squareOffset, gridSize + squareOffset * 2, gridSize + squareOffset * 2);
    for (let index = 0; index < repetitons; index++) {
        drawOneWayRoad();
    }
}

export const generateRoutes = () => {
    if (!ctx) return;
    ctx.strokeStyle = colorPalette[1];
    ctx.lineWidth = 2;
    for (let i = 0; i < grid[0]; i++) {
        for (let j = 0; j < grid[1]; j++) {
            if (Math.random() < pathwayThreshold) {
                const x = gridOffsetX + i * cellSize;
                const y = gridOffsetY + j * cellSize;
                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.lineTo(x + cellSize, y + cellSize);
                ctx.stroke();
            } else if (Math.random() < pathwayThreshold) {
                const x = gridOffsetX + (i + 1) * cellSize;
                const y = gridOffsetY + j * cellSize;
                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.lineTo(x - cellSize, y + cellSize);
                ctx.stroke();
            }
        }
    }
}


main();