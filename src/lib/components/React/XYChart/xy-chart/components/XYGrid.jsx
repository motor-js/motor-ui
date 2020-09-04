import React from "react";
import { Grid } from "@vx/grid";

const XYGrid = ({
  xScale,
  yScale,
  height,
  width,
  numTicksRows,
  numTicksColumns,
  stroke,
  strokeOpacity,
}) => {
  return (
    <Grid
      scale={xScale}
      width={width}
      height={height}
      stroke={stroke}
      strokeOpacity={strokeOpacity}
      tickValues={[10]}
    />
  );
};

export default XYGrid;
