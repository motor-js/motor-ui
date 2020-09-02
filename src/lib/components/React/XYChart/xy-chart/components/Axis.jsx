import React, { useContext, useMemo } from "react";
import BaseAxis from "@vx/axis/lib/axis/Axis";

import ChartContext from "../context/ChartContext";
import withDefinedContextScales from "../enhancers/withDefinedContextScales";

function Axis(props) {
  const {
    theme,
    xScale,
    yScale,
    margin,
    width,
    height,
    showAxisLine,
  } = useContext(ChartContext);
  const { orientation } = props;

  // The biggest difference between Axes is their label + tick label styles
  // we take this from props if specified, else we figure it out from the chart theme
  const themeTickStylesKey =
    orientation === "left" || orientation === "right"
      ? "yTickStyles"
      : "xTickStyles";

  const tickStyles = useMemo(() => theme[themeTickStylesKey], [
    theme,
    themeTickStylesKey,
  ]);

  const tickLabelProps = useMemo(() => {
    if (props.tickLabelProps) return props.tickLabelProps;
    const themeTickLabelProps =
      theme?.[themeTickStylesKey]?.label?.[orientation];

    return themeTickLabelProps
      ? // by default, wrap tick labels within the allotted margin space
        () => ({ ...themeTickLabelProps, width: margin[orientation] })
      : undefined;
  }, [theme, props.tickLabelProps, themeTickStylesKey, orientation, margin]);

  // extract axis styles from theme
  const themeAxisStylesKey =
    orientation === "left" || orientation === "right"
      ? "yAxisStyles"
      : "xAxisStyles";

  const axisStyles = useMemo(() => theme[themeAxisStylesKey], [
    theme,
    themeAxisStylesKey,
  ]);

  const topOffset =
    orientation === "bottom"
      ? height - margin.bottom
      : orientation === "top"
      ? margin.top
      : 0;
  const leftOffset =
    orientation === "left"
      ? margin.left
      : orientation === "right"
      ? width - margin.right
      : 0;

  switch (showAxisLine) {
    case false:
    case "none":
      theme.xAxisStyles.strokeWidth = 0;
      theme.yAxisStyles.strokeWidth = 0;
      break;
    case "yAxis":
      theme.xAxisStyles.strokeWidth = 0;
      break;
    case "xAxis":
      theme.yAxisStyles.strokeWidth = 0;
      break;
  }

  return (
    <BaseAxis
      top={topOffset}
      left={leftOffset}
      labelProps={axisStyles?.label?.[orientation]}
      stroke={axisStyles?.stroke}
      strokeWidth={axisStyles?.strokeWidth}
      tickLength={tickStyles?.tickLength}
      tickStroke={tickStyles?.stroke}
      {...props}
      tickLabelProps={tickLabelProps}
      scale={
        orientation === "left" || orientation === "right" ? yScale : xScale
      }
    />
  );
}

export default withDefinedContextScales(Axis);
