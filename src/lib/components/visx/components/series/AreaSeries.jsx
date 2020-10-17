import React, { useContext, useCallback } from "react";
import { animated, useSpring } from "react-spring";
import { AreaClosed } from "@visx/shape";
import { Text } from "@visx/text";
import ChartContext from "../../context/ChartContext";
import TooltipContext from "../../context/TooltipContext";
import withRegisteredData from "../../enhancers/withRegisteredData";
import useRegisteredData from "../../../../hooks/useRegisteredData";
import FillBackground from "../aesthetic/Gradient";

import { getSymbol, isDefined, isValidNumber } from "../../utils/chartUtils";

function AreaSeries({
  data: _,
  xAccessor: __,
  yAccessor: ___,
  elAccessor: ____,
  dataKey,
  mouseEvents,
  horizontal = false,
  glyph,
  fillStyle,
  ...lineProps
}) {
  const {
    xScale,
    yScale,
    colorScale,
    showPoints,
    showLabels,
    theme,
    size,
    formatValue,
    valueLabelStyle,
    findNearestData,
    handleClick,
    measureInfo,
    dimensionInfo,
    singleDimension,
    currentSelectionIds,
  } = useContext(ChartContext);

  const { showTooltip, hideTooltip } = useContext(TooltipContext) || {};

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

  let ChartGlyph = getSymbol(
    isDefined(glyph) ? glyph.symbol : showPoints.symbol
  );

  if (!data || !xAccessor || !yAccessor || !elAccessor) return null;

  const color = colorScale(dataKey) ?? "#222";

  const { valueLabelStyles } = theme;

  const labelProps = {
    ...valueLabelStyles,
    fontSize: valueLabelStyles.fontSize[size],
    ...valueLabelStyle,
  };

  const onMouseMove = useCallback(
    (event) => {
      const nearestData = findNearestData(event);
      if (nearestData.closestDatum && showTooltip) {
        showTooltip({ tooltipData: { ...nearestData } });
      }
    },
    [findNearestData, showTooltip]
  );

  const onClick = (event) => {
    const nearestData = findNearestData(event);
    const selectionId = nearestData.closestDatum.datum[0].qElemNumber;
    const selections = currentSelectionIds.includes(selectionId)
      ? currentSelectionIds.filter(function(value) {
          return value !== selectionId;
        })
      : [...currentSelectionIds, selectionId];
    handleClick(selections);
  };

  // const getValue = (d) => d.filter((val) => val.qText === dataKey)[0].qNum;
  const getValue = (d) => {
    if (singleDimension) {
      let measureId = null;

      measureInfo.map((d, i) => {
        if (d.qFallbackTitle === dataKey) measureId = i;
      });
      return d[dimensionInfo.length + measureId].qNum;
    } else {
      return d.filter((val) => val.qText === dataKey)[0].qNum;
    }
  };

  const areaFillStyle =
    typeof fillStyle === "string"
      ? fillStyle
      : isDefined(fillStyle.style)
      ? fillStyle.style
      : null;

  return (
    <g className="visx-group area-series">
      <FillBackground
        style={areaFillStyle}
        id="area-gradient"
        from={fillStyle.fillFrom}
        to={fillStyle.fillTo}
      />
      <AreaClosed
        data={data}
        x={getScaledX}
        y={getScaledY}
        yScale={yScale}
        {...lineProps}
      >
        {({ path }) => (
          <AnimatedPath
            onClick={onClick}
            onMouseMove={onMouseMove}
            onMouseLeave={() => {
              hideTooltip();
            }}
            stroke={areaFillStyle ? "url(#area-gradient)" : color}
            fill={areaFillStyle ? "url(#area-gradient)" : color}
            {...lineProps}
            d={path(data) || ""}
          />
        )}
      </AreaClosed>

      {(showPoints || showLabels) &&
        data.map((d, i) => {
          const left = getScaledX(d);
          const top = getScaledY(d);
          d.selectionId = getElemNumber(d);
          return (
            <g key={`area-glyph-${i}`}>
              {showPoints && (
                <ChartGlyph
                  left={left}
                  top={top}
                  size={
                    isDefined(glyph)
                      ? glyph.size
                      : showPoints.size || theme.points.size
                  }
                  fill={isDefined(glyph) ? glyph.fill : color}
                  stroke={isDefined(glyph) ? glyph.stroke : color}
                  strokeWidth={
                    isDefined(glyph)
                      ? glyph.strokeWidth
                      : showPoints.strokeWidth || theme.points.strokeWidth
                  }
                  style={{ cursor: "pointer " }}
                  onClick={() => {
                    const selections = currentSelectionIds.includes(
                      d.selectionId
                    )
                      ? currentSelectionIds.filter(function(value) {
                          return value !== d.selectionId;
                        })
                      : [...currentSelectionIds, d.selectionId];
                    handleClick(selections);
                  }}
                  onMouseMove={onMouseMove}
                  onMouseLeave={() => {
                    hideTooltip();
                  }}
                />
              )}
              {showLabels && (
                <Text
                  {...labelProps}
                  key={`line-label-${i}`}
                  x={left}
                  y={top}
                  dx={horizontal ? "0.5em" : 0}
                  dy={horizontal ? 0 : "-0.74em"}
                >
                  {formatValue(getValue(d))}
                </Text>
              )}
            </g>
          );
        })}
    </g>
  );
}

/** Separate component so that we don't use the `useSpring` hook in a render function callback. */
function AnimatedPath({ d, ...lineProps }) {
  const tweenedPath = useSpring({ d, config: { precision: 0.01 } });
  return <animated.path d={tweenedPath.d} fill="transparent" {...lineProps} />;
}

export default React.memo(
  withRegisteredData(AreaSeries, {
    legendShape: ({ strokeDasharray }) =>
      strokeDasharray ? "dashed-line" : "line",
  })
);
