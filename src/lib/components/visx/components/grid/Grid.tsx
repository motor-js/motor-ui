import React from "react";
import GridRows from "@visx/grid/lib/grids/GridRows";
import GridColumns from "@visx/grid/lib/grids/GridColumns";
import BaseGrid, { BaseGridProps } from "./BaseGrid";
import { AnimationTrajectory } from "@visx/react-spring";

export type GridProps = Omit<
  BaseGridProps,
  "GridRowsComponent" | "GridColumnsComponent"
> & {
  /** Animation trjectory of grid lines. */
  animationTrajectory?: AnimationTrajectory /** Number of Grid Rows. */;
  numGridRows?: number;
  /** Number of Grid Columns. */
  numGridColumns?: number;
};

export default function Grid({
  animationTrajectory = null,
  numGridRows,
  numGridColumns,
  ...props
}: GridProps) {
  return (
    <BaseGrid
      numGridRows={numGridRows}
      numGridColumns={numGridColumns}
      GridRowsComponent={GridRows}
      GridColumnsComponent={GridColumns}
      {...props}
    />
  );
}
