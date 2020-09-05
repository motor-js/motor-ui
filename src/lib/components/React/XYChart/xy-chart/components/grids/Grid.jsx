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
  gridRows,
  gridColumns,
  // stroke,
  // strokeWidth,
  // strokeDasharray,
  // numTicksRows,
  // numTicksColumns,
  // rowLineStyle,
  // columnLineStyle,
  // xOffset,
  // yOffset,
  // rowTickValues,
  // columnTickValues,
  ...restProps
}) {
  const {
    theme,
    chartType,
    xScale,
    yScale,
    margin,
    width,
    height,
  } = useContext(ChartContext);

  const gridRowStyle =
    gridRows === undefined ? theme?.gridStyles?.rows : gridRows;
  const gridColumnStyle =
    gridColumns === undefined ? theme?.gridStyles?.columns : gridColumns;

  return (
    <Group className={cx("vx-grid", className)} top={top} left={left}>
      {gridRows !== false && (
        <GridRows
          className={className}
          top={top}
          left={margin.left}
          scale={yScale}
          width={width - margin.left - margin.right}
          // stroke={theme?.gridStyles?.rows.stroke}
          // strokeWidth={theme?.gridStyles?.rows.strokeWidth}
          // strokeDasharray={strokeDasharray}
          // numTicks={numTicksRows}
          // lineStyle={rowLineStyle}
          offset={
            chartType.includes("groupedbar") ||
            chartType.includes("stackedbar") ||
            chartType.includes("combo") ||
            chartType.includes("bar")
              ? (yScale.bandwidth?.() ?? 0) / 2
              : 0
          }
          // tickValues={rowTickValues}
          {...gridRowStyle}
          {...restProps}
        />
      )}
      {gridColumns !== false && (
        <GridColumns
          className={className}
          scale={xScale}
          top={margin.top}
          left={left}
          height={height - margin.top - margin.bottom}
          // stroke={stroke}
          // strokeWidth={strokeWidth}
          // strokeDasharray={strokeDasharray}
          // numTicks={numTicksColumns}
          // lineStyle={columnLineStyle}
          offset={(xScale.bandwidth?.() ?? 0) / 2}
          // tickValues={columnTickValues}
          {...gridColumnStyle}
          {...restProps}
        />
      )}
    </Group>
  );
}

export default withDefinedContextScales(Grid);
