import React, { useContext, useCallback } from "react";
import PropTypes from "prop-types";
import { extent } from "d3-array";

import { Group } from "@visx/group";
import { Line } from "@visx/shape";

import ChartContext from "../context/ChartContext";
import TooltipContext from "../context/TooltipContext";
import { callOrValue, isDefined } from "../utils/chartUtils";
import isValidNumber from "../typeguards/isValidNumber";

const GROUP_STYLE = { pointerEvents: "none" };

const propTypes = {
  fullHeight: PropTypes.bool,
  fullWidth: PropTypes.bool,
  circleSize: PropTypes.oneOfType([PropTypes.func, PropTypes.number]),
  circleFill: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  circleStroke: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  circleStyles: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.objectOf(
      PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    ),
  ]),
  lineStyles: PropTypes.objectOf(
    PropTypes.oneOfType([PropTypes.number, PropTypes.string])
  ),
  showCircle: PropTypes.bool,
  showMultipleCircles: PropTypes.bool,
  showHorizontalLine: PropTypes.bool,
  showVerticalLine: PropTypes.bool,
  stroke: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  strokeDasharray: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  strokeWidth: PropTypes.oneOfType([PropTypes.func, PropTypes.number]),
};

const defaultProps = {
  circleSize: 4,
  circleFill: "#495057",
  circleStroke: "#ffffff",
  circleStyles: {
    pointerEvents: "none",
  },
  lineStyles: {
    pointerEvents: "none",
  },
  fullHeight: false,
  fullWidth: false,
  showCircle: true,
  showMultipleCircles: false,
  showHorizontalLine: true,
  showVerticalLine: true,
  stroke: "#868e96",
  strokeDasharray: "5,2",
  strokeWidth: 1,
};

function CrossHair({
  circleFill,
  circleSize,
  circleStroke,
  circleStyles,
  fullHeight,
  fullWidth,
  lineStyles,
  showHorizontalLine,
  showCircle,
  showMultipleCircles,
  showVerticalLine,
  stroke,
  strokeDasharray,
  strokeWidth,
}) {
  const { xScale, yScale, dataRegistry } = useContext(ChartContext) || {};

  const { tooltipData } = useContext(TooltipContext) || {};

  // early return if there's no tooltip
  const {
    closestDatum,
    svgMouseX,
    svgMouseY,
    pageX,
    pageY,
    svgOriginX,
    svgOriginY,
  } = tooltipData || {};

  // if (!xScale || !yScale || !getScaledX || !getScaledY) return null;
  // if (!xScale || !yScale) return null;

  if (
    !xScale ||
    !yScale ||
    !closestDatum ||
    svgMouseX == null ||
    svgMouseY == null
  )
    return null;

  //  const { data, xAccessor, yAccessor } = useRegisteredData(dataKey) || {};
  const { xAccessor, yAccessor } = dataRegistry[closestDatum.key];
  console.log(closestDatum, closestDatum.key);

  // accessors
  const getX = (d) => d && d[0].qText;
  const getY = (d) => d && d.y;
  //  const getX = (d) => {
  //    console.log(d);
  //    return d && d[0].qText;
  //  };
  // const getX = (d) => 100;
  // const getY = (d) => 150;

  // const getScaledX = (d) =>
  //   xScale(getX(d) || 0) + (xScale.bandwidth ? xScale.bandwidth() / 2 : 0);
  // const getScaledY = (d) =>
  //   yScale(getY(d) || 0) + (yScale.bandwidth ? yScale.bandwidth() / 2 : 0);

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

  const [xMin, xMax] = extent(xScale.range());
  const [yMin, yMax] = extent(yScale.range());

  const circleData = [closestDatum.datum];

  const circlePositions = circleData.map((d) => ({
    x: getScaledX(d),
    y: getScaledY(d),
  }));

  console.log(circlePositions[0].y);

  return (
    <Group style={GROUP_STYLE}>
      {showHorizontalLine &&
        !showMultipleCircles &&
        isDefined(circlePositions[0].y) && (
          <Line
            from={{ x: xMin, y: circlePositions[0].y }}
            to={{
              x: fullWidth ? xMax : circlePositions[0].x,
              y: circlePositions[0].y,
            }}
            style={lineStyles}
            stroke={stroke}
            strokeDasharray={strokeDasharray}
            strokeWidth={strokeWidth}
          />
        )}
      {showVerticalLine && isDefined(circlePositions[0].x) && (
        <Line
          from={{ x: circlePositions[0].x, y: yMax }}
          to={{
            x: circlePositions[0].x,
            y: fullHeight ? yMin : circlePositions[0].y,
          }}
          style={lineStyles}
          stroke={stroke}
          strokeDasharray={strokeDasharray}
          strokeWidth={strokeWidth}
        />
      )}

      {(showCircle || showMultipleCircles) &&
        circleData.map((d, i) => {
          const { x, y } = circlePositions[i];

          return (
            isDefined(x) &&
            isDefined(y) && (
              <circle
                key={`circle-${d.seriesKey || i}`}
                cx={x}
                cy={y}
                r={callOrValue(circleSize, d, i)}
                fill={callOrValue(circleFill, d, i)}
                strokeWidth={1}
                stroke={callOrValue(circleStroke, d, i)}
                style={callOrValue(circleStyles, d, i)}
              />
            )
          );
        })}
    </Group>
  );
}

CrossHair.propTypes = propTypes;
CrossHair.defaultProps = defaultProps;
CrossHair.displayName = "CrossHair";

export default CrossHair;
