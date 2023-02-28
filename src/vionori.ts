import { range } from 'd3';
import { voronoi } from 'd3-voronoi';
import './style.css';

const canvas = document.querySelector<HTMLCanvasElement>('#myCanvas')!
const refreshButton = document.querySelector<HTMLButtonElement>('#draw--button')!
const ctx: CanvasRenderingContext2D | null = canvas.getContext("2d");
let points: ArrayLike<[number, number]> | any = [];
let octagonPoints: any = [];

export function drawBoundingBox() {
  if (!ctx) return;
  const side = Math.min(canvas.width, canvas.height);
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const radius = side / 2;

  ctx.beginPath();
  ctx.moveTo(centerX + radius, centerY);
  for (let i = 1; i <= 7; i++) {
    const angle = i * Math.PI / 4;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    octagonPoints.push([x, y])
    ctx.lineTo(x, y);
  }
  ctx.strokeStyle = 'white';
  ctx.lineWidth = 0.7;
  ctx.closePath();
  ctx.stroke();
  drawRandomRoadPattern();
}

export function drawRandomRoadPattern() {
  if (!ctx) return;

  // Define the number of regions to generate
  const numRegions = 50;

  // Get the point where the octagon's two lines touch
  const octagonCenter = [
    (octagonPoints[0][0] + octagonPoints[4][0]) / 2,
    (octagonPoints[0][1] + octagonPoints[4][1]) / 2
  ];

  // Generate random regions of the canvas
  const regions = range(numRegions).map(() => [
    [Math.random() * canvas.width, Math.random() * canvas.height],
    [Math.random() * canvas.width, Math.random() * canvas.height]
  ]);

  // Generate points within each region, with half starting at the octagon center
  const pointsPerRegion = 1;
  points = ([] as [number, number][] | any).concat(
    ...regions.map(([start, end]) => {
      const regionWidth = Math.abs(end[0] - start[0]);
      const regionHeight = Math.abs(end[1] - start[1]);
      const pointsInRegion = range(pointsPerRegion).map(() => [
        start[0] + Math.random() * regionWidth / 2,
        start[1] + Math.random() * regionHeight / 2
      ]);
      const numPointsAtCenter = pointsPerRegion - pointsInRegion.length;
      const pointsAtCenter = range(numPointsAtCenter).map(() => octagonCenter);
      return pointsInRegion.concat(pointsAtCenter);
    })
  ).filter((point: [number, number]) => pointInPolygon(point, octagonPoints));

  // Shuffle the points so that the ones at the center are randomly distributed
  shuffleArray(points);

  // Create a Voronoi diagram from the points
  const voronoiDiagram = voronoi().extent([[0, 0], [canvas.width, canvas.height]])(points);

  // Draw the Voronoi diagram
  ctx.strokeStyle = "pink";
  ctx.lineWidth = 0.5;
  ctx.beginPath();
  voronoiDiagram.edges.forEach((edge: { left: any; right: any; }) => {
    const start = edge.left;
    const end = edge.right;
    if (!start || !end) return;
    ctx.moveTo(start[0], start[1]);
    ctx.lineTo(end[0], end[1]);
  });
  ctx.closePath();
  ctx.stroke();
}

function shuffleArray(array: any) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
  
  function pointInPolygon(point: [number, number], polygonPoints: [number, number][]): boolean {
    const [x, y] = point;
    let inside = false;
    const n = polygonPoints.length;
  for (let i = 0, j = n - 1; i < n; j = i++) {
    const [xi, yi] = polygonPoints[i];
    const [xj, yj] = polygonPoints[j];
    const intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

const main = () => drawBoundingBox();
main();
refreshButton.addEventListener("click", (_evt) => {
    main();
})