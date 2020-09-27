import { voronoi } from "@visx/voronoi";

// finds the datum nearest to svgMouseX/Y using voronoi
export default function findNearestDatumXY({
  width,
  height,
  xScale,
  yScale,
  xAccessor,
  yAccessor,
  svgMouseX,
  svgMouseY,
  data,
}) {
  const scaledX = (d) => xScale(xAccessor(d));
  const scaledY = (d) => yScale(yAccessor(d));

  // Create a voronoi with each node center points
  const voronoiInstance = voronoi({
    x: scaledX,
    y: scaledY,
    width,
    height,
  });

  const nearestDatum = voronoiInstance(data).find(svgMouseX, svgMouseY);

  if (!nearestDatum) return null;

  const { data: datum, index } = nearestDatum;
  const distanceX = Math.abs(scaledX(datum) - svgMouseX);
  const distanceY = Math.abs(scaledY(datum) - svgMouseY);

  return { datum, index, distanceX, distanceY };
}
