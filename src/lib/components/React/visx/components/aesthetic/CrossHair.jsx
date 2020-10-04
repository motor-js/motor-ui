import React, { useContext } from "react";
import PropTypes from "prop-types";
import { extent } from "d3-array";

import { Group } from "@visx/group";
import { Line } from "@visx/shape";

import ChartContext from "../../context/ChartContext";
import TooltipContext from "../../context/TooltipContext";
import { callOrValue, isDefined } from "../../utils/chartUtils";
import { selectColor } from "../../../../../utils";

const GROUP_STYLE = { pointerEvents: "none" };

const propTypes = {
  fullHeight: PropTypes.bool,
  fullWidth: PropTypes.bool,
  circleSize: PropTypes.oneOfType([PropTypes.func, PropTypes.number]),
  circleFill: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  circleClosestFill: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  circleClosestStroke: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
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
  highlightClosetsCircle: PropTypes.bool,
  stroke: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  strokeDasharray: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  strokeWidth: PropTypes.oneOfType([PropTypes.func, PropTypes.number]),
  circleStrokeWidth: PropTypes.oneOfType([PropTypes.func, PropTypes.number]),
};

function CrossHair({
  circleFill,
  circleClosestFill,
  circleClosestStroke,
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
  circleStrokeWidth,
  highlightClosetsCircle,
  horizontal,
}) {
  const {
    xScale,
    yScale,
    theme,
    colorScale,
    dataKeys,
    measureInfo,
    dimensionInfo,
    chartType,
  } = useContext(ChartContext) || {};

  const { tooltipData } = useContext(TooltipContext) || {};

  const { closestDatum } = tooltipData || {};

  const stackedChart =
    chartType.includes("stackedbar") || chartType.includes("stackedarea");

  // accessors
  const getX = (d) => d && d.qText;
  const getY = (d) => d && (!stackedChart ? d.qNum : d.qNumCumulative);

  const getScaledX = (d) =>
    xScale(getX(d) || 0) + (xScale.bandwidth ? xScale.bandwidth() / 2 : 0);
  const getScaledY = (d) =>
    yScale(getY(d) || 0) + (yScale.bandwidth ? yScale.bandwidth() / 2 : 0);

  // early return if there's no tooltip
  if (!xScale || !yScale || !closestDatum) return null;

  let cumulativeSum = 0;
  if (stackedChart) {
    closestDatum.datum.map((d, i) => {
      cumulativeSum = i !== 0 ? (cumulativeSum += d.qNum) : cumulativeSum;

      d.qNumCumulative = cumulativeSum;
    });
  }

  const [xMin, xMax] = extent(xScale.range());
  const [yMin, yMax] = extent(yScale.range());

  const circles = dataKeys || measureInfo.map((d) => d.qFallbackTitle);

  const circlePositions = circles.map((d, i) => {
    return {
      closest: d === closestDatum.key,
      x: getScaledX(closestDatum.datum[0]),
      y: getScaledY(closestDatum.datum[i + 1]),
    };
  });

  const closestCircle = circlePositions.filter((d) => d.closest);

  const circleColor = (highlightCloset, closest, closestColor, color, i) => {
    if (highlightCloset) {
      if (closest) {
        return closestColor === "multi" ? colorScale(circles[i]) : closestColor;
      } else {
        return color === "multi" ? colorScale(circles[i]) : color;
      }
    }
    return color === "multi" ? colorScale(circles[i]) : color;
  };

  return (
    <Group style={GROUP_STYLE}>
      {showHorizontalLine &&
        !showMultipleCircles &&
        isDefined(closestCircle[0].y) && (
          <Line
            from={{ x: xMin, y: closestCircle[0].y }}
            to={{
              x: fullWidth ? xMax : closestCircle[0].x,
              y: closestCircle[0].y,
            }}
            style={lineStyles}
            stroke={
              stroke === "multi"
                ? colorScale(closestDatum.key)
                : selectColor(stroke, theme) ?? "#868e96"
            }
            strokeDasharray={strokeDasharray}
            strokeWidth={strokeWidth}
          />
        )}
      {showVerticalLine && isDefined(closestCircle[0].x) && (
        <Line
          from={{ x: closestCircle[0].x, y: yMax }}
          to={{
            x: closestCircle[0].x,
            y: fullHeight ? yMin : closestCircle[0].y,
          }}
          style={lineStyles}
          stroke={
            stroke === "multi"
              ? colorScale(closestDatum.key)
              : selectColor(stroke, theme) ?? "#868e96"
          }
          strokeDasharray={strokeDasharray}
          strokeWidth={strokeWidth}
        />
      )}

      {(showCircle || showMultipleCircles) &&
        circles.map((d, i) => {
          const { x, y, closest } = circlePositions[i];
          const fill = circleColor(
            highlightClosetsCircle,
            closest,

            selectColor(circleClosestFill, theme),
            selectColor(circleFill, theme),
            i
          );
          const stroke = circleColor(
            highlightClosetsCircle,
            closest,

            selectColor(circleClosestStroke, theme),
            selectColor(circleStroke, theme),
            i
          );
          // circleStroke === "multi" ? colorScale(circles[i]) : circleStroke;

          if (!showMultipleCircles && d !== closestDatum.key) return null;

          return (
            isDefined(x) &&
            isDefined(y) && (
              <circle
                key={`circle-${d.seriesKey || i}`}
                cx={x}
                cy={y}
                r={callOrValue(circleSize, d, i)}
                fill={callOrValue(fill, d, i)}
                strokeWidth={circleStrokeWidth}
                stroke={callOrValue(stroke, d, i)}
                style={callOrValue(circleStyles, d, i)}
              />
            )
          );
        })}
    </Group>
  );
}

CrossHair.propTypes = propTypes;
// CrossHair.defaultProps = defaultProps;
CrossHair.displayName = "CrossHair";

export default CrossHair;
