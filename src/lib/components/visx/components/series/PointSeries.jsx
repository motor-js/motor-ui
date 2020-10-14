import React, { useContext, useCallback, useState } from "react";
import { Circle } from "@visx/shape";
import { localPoint } from "@visx/event";
import { Text } from "@visx/text";

import ChartContext from "../../context/ChartContext";
import TooltipContext from "../../context/TooltipContext";
import withRegisteredData from "../../enhancers/withRegisteredData";
import { isValidNumber, valueIfUndefined } from "../../utils/chartUtils";
import useRegisteredData from "../../../../hooks/useRegisteredData";
import findNearestDatumX from "../../utils/findNearestDatumX";
import findNearestDatumY from "../../utils/findNearestDatumY";
import { isEmpty, isString } from "../../../../utils";

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
    multiColor,
    theme,
    findNearestData,
    size,
    // showPoints,
    showLabels,
    valueLabelStyle,
  } = useContext(ChartContext);

  const { showTooltip, hideTooltip } = useContext(TooltipContext) || {};
  const [hoverId, setHoverId] = useState();

  const { data, xAccessor, yAccessor, elAccessor } =
    useRegisteredData(dataKey) || {};

  const getScaledX = useCallback(
    (d) => {
      const x = xScale(xAccessor?.(d));
      return isValidNumber(x) ? x + (xScale.bandwidth?.() ?? 0) / 2 : null;
    },
    [xScale, xAccessor]
  );

  const { scatter, valueLabelStyles, selection, nonSelection, hover } = theme;

  const labelProps = {
    ...valueLabelStyles,
    fontSize: valueLabelStyles.fontSize[size],
    ...valueLabelStyle,
  };

  const getScaledY = useCallback(
    (d) => {
      const y = yScale(yAccessor?.(d));
      return isValidNumber(y) ? y + (yScale.bandwidth?.() ?? 0) / 2 : null;
    },
    [yScale, yAccessor]
  );

  const getElemNumber = useCallback((d) => elAccessor(d), [elAccessor]);

  if (!data || !xAccessor || !yAccessor || !elAccessor) return null;

  const getColor = (d, i) =>
    valueIfUndefined(
      d[0].qAttrExps.qValues[2].qText,
      colorScale(multiColor ? d[0].qText : dataKey)
    );

  const getLabel = (d) => d[0].qText;

  const getStyle = (selectionId) => {
    return isEmpty(currentSelectionIds) && hoverId === selectionId
      ? { ...hover, ...scatter.style }
      : isEmpty(currentSelectionIds) ||
        currentSelectionIds.includes(selectionId)
      ? { ...selection, ...scatter.style }
      : { ...nonSelection, ...scatter.style };
  };

  const onMouseMoveDatum = (event, point, color) => {
    const { x: svgMouseX, y: svgMouseY } = localPoint(event) || {};

    const closestDatum = {};
    closestDatum.key = dataKey;
    closestDatum.datum = point;
    closestDatum.color = color;

    if (point && showTooltip) {
      showTooltip({
        tooltipData: { closestDatum, svgMouseX, svgMouseY, colorScale },
      });
    }
  };

  // const onMouseMove = useCallback(
  //   (event) => {
  //     const nearestData = findNearestData(event);
  //     // console.log(nearestData);
  //     if (nearestData.closestDatum && showTooltip) {
  //       showTooltip({ tooltipData: { ...nearestData } });
  //     }
  //   },
  //   [findNearestData, showTooltip]
  // );

  return (
    <g className="visx-group line-series">
      {data.map((point, i) => (
        <g key={`area-glyph-${i}`}>
          <Circle
            key={`point-${point[0]}-${i}`}
            className="dot"
            cx={getScaledX(point)}
            cy={getScaledY(point)}
            r={scatter.size}
            fill={getColor(point, i)}
            // style={{ cursor: "pointer " }}
            style={getStyle(getElemNumber(point))}
            // style={{ cursor: "pointer" }}
            // style={{ ...scatter.style }}
            onClick={() => {
              const selectionId = getElemNumber(point);
              const selections = currentSelectionIds.includes(selectionId)
                ? currentSelectionIds.filter(function(value) {
                    return value !== selectionId;
                  })
                : [...currentSelectionIds, selectionId];
              handleClick(selections);
            }}
            // onMouseMove={onMouseMove}
            onMouseMove={(e) => onMouseMoveDatum(e, point, getColor(point, i))}
            onMouseEnter={() => setHoverId(getElemNumber(point))}
            onMouseLeave={() => {
              hideTooltip();
              setHoverId(null);
            }}
          />
          {showLabels && (
            <Text
              {...labelProps}
              key={`line-label-${i}`}
              x={getScaledX(point)}
              y={getScaledY(point)}
              dx={horizontal ? "0.5em" : 0}
              dy={horizontal ? 0 : "-0.74em"}
            >
              {getLabel(point)}
            </Text>
          )}
        </g>
      ))}
    </g>
  );
}

export default withRegisteredData(PointSeries, {
  legendShape: () => "rect",
  findNearestDatum: ({ horizontal }) =>
    horizontal ? findNearestDatumY : findNearestDatumX,
});
