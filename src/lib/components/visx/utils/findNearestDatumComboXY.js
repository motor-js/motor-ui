import findNearestDatumSingleDimension from "./findNearestDatumSingleDimension";

export default function findNearestDatumComboXY({
  xScale,
  yScale,
  xAccessor,
  yAccessor,
  svgMouseX,
  svgMouseY,
  data,
}) {
  const { datum, distance: distanceX, index } =
    findNearestDatumSingleDimension({
      scale: xScale,
      accessor: xAccessor,
      mouseCoord: svgMouseX,
      data,
    }) ?? {};

  const { distance: distanceY } =
    findNearestDatumSingleDimension({
      scale: yScale,
      accessor: yAccessor,
      mouseCoord: svgMouseY,
      data,
    }) ?? {};

  return datum ? { datum, index, distanceX, distanceY } : null;
}
