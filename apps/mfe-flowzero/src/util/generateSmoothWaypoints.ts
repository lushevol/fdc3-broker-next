/**
 * Generate smooth waypoints for a cubic Bezier curve
 * @param sourceX Start X
 * @param sourceY Start Y
 * @param targetX End X
 * @param targetY End Y
 * @returns Array of waypoints {x, y}
 */
export function generateSmoothWaypoints(
  sourceX: number,
  sourceY: number,
  targetX: number,
  targetY: number
): { x: number; y: number }[] {
  // Calculate a point on a cubic Bezier curve
  function calculateBezierPoint(
    x0: number,
    y0: number,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    x3: number,
    y3: number,
    t: number
  ) {
    const mt = 1 - t;
    const mt2 = mt * mt;
    const mt3 = mt2 * mt;
    const t2 = t * t;
    const t3 = t2 * t;
    const x = mt3 * x0 + 3 * mt2 * t * x1 + 3 * mt * t2 * x2 + t3 * x3;
    const y = mt3 * y0 + 3 * mt2 * t * y1 + 3 * mt * t2 * y2 + t3 * y3;
    return { x: Math.round(x), y: Math.round(y) };
  }
  // Calculate distance and control points
  const dx = targetX - sourceX;
  const dy = targetY - sourceY;
  const distance = Math.sqrt(dx * dx + dy * dy);
  const controlOffset = Math.min(distance * 0.4, 150);
  const cp1X = sourceX + controlOffset;
  const cp1Y = sourceY;
  const cp2X = targetX - controlOffset;
  const cp2Y = targetY;
  // Sample every 4px, min 5 points, max 100 points
  const pointsPerUnit = 4;
  const numPoints =
    distance < 50
      ? 1
      : Math.max(5, Math.min(100, Math.ceil(distance / pointsPerUnit)));
  const waypoints: { x: number; y: number }[] = [];
  for (let i = 0; i <= numPoints; i++) {
    const t = i / numPoints;
    const pt =
      distance < 50
        ? {
            x: Math.round(sourceX + (targetX - sourceX) * t),
            y: Math.round(sourceY + (targetY - sourceY) * t),
          }
        : calculateBezierPoint(
            sourceX,
            sourceY,
            cp1X,
            cp1Y,
            cp2X,
            cp2Y,
            targetX,
            targetY,
            t
          );
    waypoints.push(pt);
  }
  return waypoints;
}
