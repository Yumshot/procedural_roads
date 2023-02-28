export function setupCounter(element: HTMLButtonElement) {
  let counter = 0
  const setCounter = (count: number) => {
    counter = count
    element.innerHTML = `count is ${counter}`
  }
  element.addEventListener('click', () => setCounter(counter + 1))
  setCounter(0)
}


import './style.css';
import { Delaunay } from 'd3';

const canvas = document.querySelector<HTMLCanvasElement>('#myCanvas')!
const ctx: CanvasRenderingContext2D | null = canvas.getContext("2d");

const points:  [number, number][] = [];

// Add points within the bounding box
for (let i = 0; i < 10; i++) {
  const x = Math.floor(Math.random() * 1280);
  const y = Math.floor(Math.random() * 720);
  points.push([x, y]);
}

const delaunay = Delaunay.from(points);

export function drawBoundingBox() {
  if (!ctx) return;
  ctx.strokeStyle = 'white';
  ctx.lineWidth = 0.7;

  // Draw the bounding box
  ctx.strokeRect(0, 0, 1280, 720);

  // Draw Delaunay triangulation
  ctx.beginPath();
  const { triangles } = delaunay;
  const outerPoints: any = [    
    [0, 0],
    [0, 720],
    [1280, 720],
    [1280, 0]
  ];
  const convexHull = Delaunay.from(outerPoints).hull;
  triangles.forEach((triangle: any) => {
    let outsidePoints = 0;
    let p1 = null;
    let p2 = null;
    if (!triangle) {
      return;
    }
    for (let i = 0; i < 3; i++) {
     const [x, y] = points[i];
      if (x < 0 || x > 1280 || y < 0 || y > 720) {
        outsidePoints++;
        if (!p1) {
          p1 = [x, y];
        } else {
          p2 = [x, y];
        }
      }
    }
    if (outsidePoints === 1) {
      ctx.moveTo(p1![0], p1![1]);
      ctx.lineTo(outerPoints[convexHull[0]][0], outerPoints[convexHull[0]][1]);
      ctx.stroke();
    } else if (outsidePoints === 2) {
      ctx.moveTo(p1![0], p1![1]);
      ctx.lineTo(p2![0], p2![1]);
      ctx.stroke();
    }
  });
}



function main() {
  drawBoundingBox();
}

main();
