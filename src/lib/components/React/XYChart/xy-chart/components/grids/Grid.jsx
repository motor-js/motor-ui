import React, { useContext } from "react";
import cx from "classnames";
import { Group } from "@vx/group";
import GridRows from "./GridRows";
import GridColumns from "./GridColumns";

import ChartContext from "../../context/ChartContext";
import withDefinedContextScales from "../..//enhancers/withDefinedContextScales";

function Grid({
  top,
  left,
  // xScale,
  // yScale,
  // width,
  // height,
  className,
  stroke,
  strokeWidth,
  strokeDasharray,
  numTicksRows,
  numTicksColumns,
  rowLineStyle,
  columnLineStyle,
  xOffset,
  yOffset,
  rowTickValues,
  columnTickValues,
  ...restProps
}) {
  const { theme, xScale, yScale, margin, width, height, showAxis } = useContext(
    ChartContext
  );
  return (
    <Group className={cx("vx-grid", className)} top={top} left={left}>
      <GridRows
        className={className}
        scale={yScale}
        width={width - margin.left - margin.right}
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeDasharray={strokeDasharray}
        numTicks={numTicksRows}
        lineStyle={rowLineStyle}
        offset={yOffset}
        tickValues={rowTickValues}
        {...restProps}
      />
      <GridColumns
        className={className}
        scale={xScale}
        height={height - margin.top - margin.bottom}
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeDasharray={strokeDasharray}
        numTicks={numTicksColumns}
        lineStyle={columnLineStyle}
        offset={xOffset}
        tickValues={columnTickValues}
        {...restProps}
      />
    </Group>
  );
}

export default withDefinedContextScales(Grid);
