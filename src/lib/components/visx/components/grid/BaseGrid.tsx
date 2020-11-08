import React, { useContext } from "react";
import { CommonGridProps } from "@visx/grid/lib/types";
import { AllGridRowsProps } from "@visx/grid/lib/grids/GridRows";
import { GridColumnsProps } from "@visx/grid/lib/grids/GridColumns";
import { AxisScale } from "@visx/axis";
import DataContext from "../../context/DataContext";

export type BaseGridProps = {
  /** Whether to render GridRows. */
  rows?: boolean;
  /** Whether to render GridColumns. */
  columns?: boolean;
  /** Number of Rows for the Grid. */
  numGridRows?: number;
  /** Number of Columns for the Grid. */
  numGridColumns?: number;
  /** Rendered GridRows component which is passed GridRowProps by BaseGrid. */
  GridRowsComponent: React.FC<AllGridRowsProps<AxisScale>>;
  /** Rendered GridColumns component which is passed GridColumnsProps by BaseGrid. */
  GridColumnsComponent: React.FC<GridColumnsProps<AxisScale>>;
} & CommonGridProps;

/** Component that handles all  */
export default function BaseGrid({
  rows = true,
  columns = true,
  GridRowsComponent,
  GridColumnsComponent,
  numGridRows,
  numGridColumns,
  ...props
}: BaseGridProps) {
  const {
    theme,
    xScale: columnsScale,
    yScale: rowsScale,
    margin,
    innerWidth,
    innerHeight,
  } = useContext(DataContext);

  const gridLineStyles = theme?.gridStyles;

  return (
    <>
      {rows && rowsScale && innerWidth != null && (
        <GridRowsComponent
          left={margin?.left}
          lineStyle={theme?.gridStyles.rows}
          width={innerWidth}
          scale={rowsScale}
          numTicks={numGridRows}
          {...props}
        />
      )}
      {columns && columnsScale && innerHeight != null && (
        <GridColumnsComponent
          top={margin?.top}
          lineStyle={theme?.gridStyles.columns}
          height={innerHeight}
          scale={columnsScale}
          numTicks={numGridColumns}
          {...props}
        />
      )}
    </>
  );
}
