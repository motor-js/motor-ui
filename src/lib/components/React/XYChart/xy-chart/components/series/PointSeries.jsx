import React, { useContext, useCallback } from "react";
import { Circle } from "@vx/shape";

import ChartContext from "../../context/ChartContext";
import withRegisteredData from "../../enhancers/withRegisteredData";
import isValidNumber from "../../typeguards/isValidNumber";
import useRegisteredData from "../../hooks/useRegisteredData";
import findNearestDatumX from "../../util/findNearestDatumX";
import findNearestDatumY from "../../util/findNearestDatumY";

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
    showPoints,
    showLabels,
    theme,
    formatValue,
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

  // const x = (d) => d[1].qNum;
  // const y = (d) => d[2].qNum;

  return (
    <g className="vx-group line-series">
      {data.map((point, i) => (
        <Circle
          key={`point-${point[0]}-${i}`}
          className="dot"
          // cx={xScale(x(point))}
          // cy={yScale(y(point))}
          cx={getScaledX(point)}
          cy={getScaledY(point)}
          // selectionId={getElemNumber(point)}
          // r={i % 3 === 0 ? 2 : 3}
          r={3}
          // fill={tooltipData === point ? "white" : "#f6c431"}
          fill="#f6c431"
          style={{ cursor: "pointer " }}
          onClick={() => {
            // setSelectedBar(isSelected ? null : letter);
            point.selectionId = getElemNumber(point);
            console.log(point);
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
