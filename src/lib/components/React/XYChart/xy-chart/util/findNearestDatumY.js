import findNearestDatumSingleDimension from "./findNearestDatumSingleDimension";

export default function findNearestDatumY({
  yScale: scale,
  yAccessor: accessor,
  svgMouseY: mouseCoord,
  data,
}) {
  const { datum, distance, index } =
    findNearestDatumSingleDimension({
      scale,
      accessor,
      mouseCoord,
      data,
    }) ?? {};
  return datum ? { datum, index, distanceY: distance, distanceX: 0 } : null;
}
