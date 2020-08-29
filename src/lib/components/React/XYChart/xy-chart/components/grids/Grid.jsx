import React, { useContext, useCallback, useMemo } from "react";
import cx from "classnames";
import { Group } from "@vx/group";
import ChartContext from "../../context/ChartContext";
import useRegisteredData from "../../hooks/useRegisteredData";

import GridRows from "./GridRows";
import GridColumns from "./GridColumns";

export default function Grid({
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
  const { theme, xScale, yScale, margin, width, height } = useContext(
    ChartContext
  );
  // const { data, xAccessor, yAccessor } = useRegisteredData(dataKey);
  // const getScaledX = useCallback((d) => xScale(xAccessor(d)), [
  //   xScale,
  //   xAccessor,
  // ]);
  // const getScaledY = useCallback((d) => yScale(yAccessor(d)), [
  //   yScale,
  //   yAccessor,
  // ]);

  return (
    <Group className={cx("vx-grid", className)} top={top} left={left}>
      <GridRows
        className={className}
        scale={yScale}
        width={width}
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
        height={height}
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
