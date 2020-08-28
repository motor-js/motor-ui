import React, { useContext, useCallback, useMemo } from "react";
import ChartContext from "../../context/ChartContext";
import { ChartContext as ChartContextType, SeriesProps } from "../../types";
import withRegisteredData from "../../enhancers/withRegisteredData";
import isValidNumber from "../../typeguards/isValidNumber";
import useRegisteredData from "../../hooks/useRegisteredData";
import findNearestDatumX from "../../util/findNearestDatumX";
import findNearestDatumY from "../../util/findNearestDatumY";
import AnimatedBars from "./AnimatedBars";

function BarSeries({
  dataKey,
  dataKeys,
  data: _,
  xAccessor: __,
  yAccessor: ___,
  mouseEvents,
  horizontal,
  barThickness: barThicknessProp,
  ...barProps
}) {
  const { theme, colorScale, xScale, yScale } = useContext(ChartContext);
  const { data, xAccessor, yAccessor } = useRegisteredData(dataKey);
  const getScaledX = useCallback((d) => xScale(xAccessor(d)), [
    xScale,
    xAccessor,
  ]);
  const getScaledY = useCallback((d) => yScale(yAccessor(d)), [
    yScale,
    yAccessor,
  ]);

  const [xMin, xMax] = xScale.range();
  const [yMax, yMin] = yScale.range();
  const innerWidth = Math.abs(xMax - xMin);
  const innerHeight = Math.abs(yMax - yMin);
  const barThickness =
    barThicknessProp ||
    (horizontal
      ? // non-bandwidth estimate assumes no missing data values
        yScale.bandwidth?.() ?? innerHeight / data.length
      : xScale.bandwidth?.() ?? innerWidth / data.length);

  // try to figure out the 0 baseline for correct rendering of negative values
  // we aren't sure if these are numeric scales or not a priori
  // @ts-ignore
  const maybeXZero = xScale(0);
  // @ts-ignore
  const maybeYZero = yScale(0);

  const xZeroPosition = isValidNumber(maybeXZero)
    ? // if maybeXZero _is_ a number, but the scale is not clamped and it's outside the domain
      // fallback to the scale's minimum
      Math.max(maybeXZero, Math.min(xMin, xMax))
    : Math.min(xMin, xMax);
  const yZeroPosition = isValidNumber(maybeYZero)
    ? Math.min(maybeYZero, Math.max(yMin, yMax))
    : Math.max(yMin, yMax);

  // const barColor = colorScale(dataKey) as string;

  const bars = useMemo(
    () =>
      data.map((datum, i) => {
        const x = getScaledX(datum);
        const y = getScaledY(datum);
        const barLength = horizontal ? x - xZeroPosition : y - yZeroPosition;

        const barColor = colorScale(dataKeys ? dataKeys[i] : dataKey);

        return {
          x: horizontal ? xZeroPosition + Math.min(0, barLength) : x,
          y: horizontal ? y : yZeroPosition + Math.min(0, barLength),
          width: horizontal ? Math.abs(barLength) : barThickness,
          height: horizontal ? barThickness : Math.abs(barLength),
          color: barColor,
        };
      }),
    [
      horizontal,
      // barColor,
      barThickness,
      data,
      xZeroPosition,
      yZeroPosition,
      getScaledX,
      getScaledY,
    ]
  );

  return (
    <g className="vx-chart bar-series">
      <AnimatedBars
        bars={bars}
        stroke={theme.baseColor ?? "white"}
        {...barProps}
      />
    </g>
  );
}

export default withRegisteredData(BarSeries, {
  legendShape: () => "rect",
  findNearestDatum: ({ horizontal }) =>
    horizontal ? findNearestDatumY : findNearestDatumX,
});
