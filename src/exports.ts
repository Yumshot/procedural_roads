export const colorPalette = [
    '#F3EFE0',
    "#434242",
    "#222222",
    "#22A39F",
    "#222831",
    "#393E46",
    "#00ADB5",
    "#EEEEEE",

];

export const drawLineAcrossSquare = (ctx: { strokeStyle: string; beginPath: () => void; moveTo: (arg0: any, arg1: any) => void; lineTo: (arg0: any, arg1: any) => void; stroke: () => void; }, gridOffsetX: any, gridSize: any, gridOffsetY: number, cellSize: number, grid: number[]) => {
    if (!ctx) return;
    const startX = gridOffsetX;
    const endX = gridOffsetX + gridSize;
    const startY = gridOffsetY + cellSize * Math.floor(Math.random() * grid[1]);
    const endY = gridOffsetY + cellSize * Math.floor(Math.random() * grid[1]);
    ctx.strokeStyle = colorPalette[5];
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();
}