import React, { useContext, useCallback } from "react";
import { animated, useSpring } from "react-spring";
import { AreaClosed } from "@vx/shape";
import ChartContext from "../../context/ChartContext";
import withRegisteredData from "../../enhancers/withRegisteredData";
import isValidNumber from "../../typeguards/isValidNumber";
import useRegisteredData from "../../hooks/useRegisteredData";

// import { callOrValue, isDefined } from "../../util/chartUtils";
import { getSymbol } from "../../util/chartUtils";

function AreaSeries({
  data: _,
  xAccessor: __,
  yAccessor: ___,
  elAccessor: ____,
  dataKey,
  mouseEvents,
  horizontal = false,
  glyph,
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

  let ChartGlyph = getSymbol(
    isDefined(glyph) ? glyph.symbol : showPoints.symbol
  );

  if (!data || !xAccessor || !yAccessor || !elAccessor) return null;

  const color = colorScale(dataKey) ?? "#222";

  const {
    svgLabel: { baseLabel },
  } = theme;

  const labelProps = {
    ...baseLabel,
    pointerEvents: "none",
    stroke: "#fff",
    strokeWidth: 2,
    paintOrder: "stroke",
    fontSize: 12,
  };

  return (
    <g className="vx-group area-series">
      <AreaClosed
        data={data}
        x={getScaledX}
        y={getScaledY}
        yScale={yScale}
        {...lineProps}
      >
        {({ path }) => (
          <AnimatedPath
            stroke={color}
            fill={color}
            {...lineProps}
            d={path(data) || ""}
          />
        )}
      </AreaClosed>

      {showPoints &&
        data.map((d, i) => {
          const left = getScaledX(d);
          const top = getScaledY(d);
          d.selectionId = getElemNumber(d);
          return (
            <g key={`area-glyph-${i}`}>
              <ChartGlyph
                left={left}
                top={top}
                size={
                  isDefined(glyph)
                    ? glyph.size
                    : showPoints.size || theme.points.size
                }
                // fill={i % 2 === 0 ? primaryColor : contrastColor}
                // stroke={i % 2 === 0 ? contrastColor : primaryColor}
                fill={isDefined(glyph) ? glyph.fill : color}
                stroke={isDefined(glyph) ? glyph.stroke : color}
                strokeWidth={
                  isDefined(glyph)
                    ? glyph.strokeWidth
                    : showPoints.strokeWidth || theme.points.strokeWidth
                }
                style={{ cursor: "pointer " }}
                onClick={() => {
                  console.log(d);
                }}
              />
              {/* {showLabels && (
                <Text {...labelProps} key={`area-label-${i}`} x={left} y={top}>
                  {formatValue(d[1].qNum)}
                </Text>
              )} */}
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
