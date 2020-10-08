import React, { useContext, useCallback } from "react";
import { Circle } from "@visx/shape";

import ChartContext from "../../context/ChartContext";
import withRegisteredData from "../../enhancers/withRegisteredData";
import { isValidNumber } from "../../utils/chartUtils";
import useRegisteredData from "../../../../hooks/useRegisteredData";
import findNearestDatumX from "../../utils/findNearestDatumX";
import findNearestDatumY from "../../utils/findNearestDatumY";

function PointSeries({
  data: _,
  xAccessor: __,
  yAccessor: ___,
  elAccessor: ____,
  dataKey,
  mouseEvents,
  horizontal = false,
  ...lineProps
}) {
  const {
    xScale,
    yScale,
    colorScale,
    handleClick,
    currentSelectionIds,
    // showPoints,
    // showLabels,
    // theme,
    // formatValue,
  } = useContext(ChartContext);
  const { data, xAccessor, yAccessor, elAccessor } =
    useRegisteredData(dataKey) || {};

  const getScaledX = useCallback(
    (d) => {
      const x = xScale(xAccessor?.(d));
      return isValidNumber(x) ? x + (xScale.bandwidth?.() ?? 0) / 2 : null;
    },
    [xScale, xAccessor]
  );

  const getScaledY = useCallback(
    (d) => {
      const y = yScale(yAccessor?.(d));
      return isValidNumber(y) ? y + (yScale.bandwidth?.() ?? 0) / 2 : null;
    },
    [yScale, yAccessor]
  );

  const getElemNumber = useCallback((d) => elAccessor(d), [elAccessor]);

  if (!data || !xAccessor || !yAccessor || !elAccessor) return null;

  const color = colorScale(dataKey) ?? "#222";

  // console.log(dataKey);

  // const x = (d) => d[1].qNum;
  // const y = (d) => d[2].qNum;

  // const { scatter } = theme;
  // console.log(scatter);

  return (
    <g className="visx-group line-series">
      {data.map((point, i) => (
        <Circle
          key={`point-${point[0]}-${i}`}
          className="dot"
          cx={getScaledX(point)}
          cy={getScaledY(point)}
          r={3}
          fill="#f6c431"
          fill={color}
          style={{ cursor: "pointer " }}
          onClick={() => {
            const selectionId = getElemNumber(point);
            const selections = currentSelectionIds.includes(selectionId)
              ? currentSelectionIds.filter(function(value) {
                  return value !== selectionId;
                })
              : [...currentSelectionIds, selectionId];
            handleClick(selections);
          }}
        />
      ))}
    </g>
  );
}

export default withRegisteredData(PointSeries, {
  legendShape: () => "rect",
  findNearestDatum: ({ horizontal }) =>
    horizontal ? findNearestDatumY : findNearestDatumX,
});
