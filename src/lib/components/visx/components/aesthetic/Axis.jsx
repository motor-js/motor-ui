import React, { useContext, useMemo } from "react";
import { Axis as BaseAxis } from "@visx/axis";

import ChartContext from "../../context/ChartContext";
import withDefinedContextScales from "../../enhancers/withDefinedContextScales";

function Axis(props) {
<<<<<<< HEAD:src/lib/components/React/XYChart/xy-chart/components/Axis.jsx
  const { theme, xScale, yScale, margin, width, height, showAxis } = useContext(
    ChartContext
  );
=======
  const {
    theme,
    xScale,
    yScale,
    margin,
    width,
    height,
    size,
    xAxisStyles,
    yAxisStyles,
    xTickStyles,
    yTickStyles,
  } = useContext(ChartContext);
>>>>>>> c5e5508d531a7ee168b90232147cdef6eba4c64f:src/lib/components/visx/components/aesthetic/Axis.jsx
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

  const ticksPropsStyles =
    orientation === "left" || orientation === "right"
      ? yTickStyles
      : xTickStyles;

  const tickLabelProps = useMemo(() => {
    // if (props.tickLabelProps) return props.tickLabelProps;
    const themeTickLabelProps =
      theme?.[themeTickStylesKey]?.label?.[orientation];

    return themeTickLabelProps
      ? // by default, wrap tick labels within the allotted margin space
        () => ({
          ...themeTickLabelProps,
          width: margin[orientation],
          fontSize:
            theme?.[themeTickStylesKey]?.label?.[orientation].fontSize[size],
          ...ticksPropsStyles,
        })
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

<<<<<<< HEAD:src/lib/components/React/XYChart/xy-chart/components/Axis.jsx
  switch (showAxis) {
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
=======
  const axisPropsStyles =
    orientation === "left" || orientation === "right"
      ? yAxisStyles
      : xAxisStyles;

  const labelProps = {
    ...axisStyles?.label?.[orientation],
    fontSize: axisStyles?.label?.[orientation].fontSize[size],
    ...axisPropsStyles,
  };
>>>>>>> c5e5508d531a7ee168b90232147cdef6eba4c64f:src/lib/components/visx/components/aesthetic/Axis.jsx

  return (
    <BaseAxis
      top={topOffset}
      left={leftOffset}
      labelProps={labelProps}
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
