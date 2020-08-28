import React, { useContext, useCallback } from "react";
import { animated, useSpring } from "react-spring";
import LinePath from "@vx/shape/lib/shapes/LinePath";
import ChartContext from "../../context/ChartContext";
import withRegisteredData from "../../enhancers/withRegisteredData";
import isValidNumber from "../../typeguards/isValidNumber";
import useRegisteredData from "../../hooks/useRegisteredData";

function LineSeries({
  data: _,
  xAccessor: __,
  yAccessor: ___,
  dataKey,
  mouseEvents,
  ...lineProps
}) {
  const { xScale, yScale, colorScale } = useContext(ChartContext);
  const { data, xAccessor, yAccessor } = useRegisteredData(dataKey) || {};

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

  if (!data || !xAccessor || !yAccessor) return null;

  const color = colorScale(dataKey) ?? "#222";

  return (
    <g>
      <LinePath data={data} x={getScaledX} y={getScaledY} {...lineProps}>
        {({ path }) => (
          <AnimatedPath stroke={color} {...lineProps} d={path(data) || ""} />
        )}
      </LinePath>
    </g>
  );
}

/** Separate component so that we don't use the `useSpring` hook in a render function callback. */
function AnimatedPath({ d, ...lineProps }) {
  const tweenedPath = useSpring({ d, config: { precision: 0.01 } });
  return <animated.path d={tweenedPath.d} fill="transparent" {...lineProps} />;
}

export default React.memo(
  withRegisteredData(LineSeries, {
    legendShape: ({ strokeDasharray }) =>
      strokeDasharray ? "dashed-line" : "line",
  })
);
