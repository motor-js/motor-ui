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
  animationTrajectory?: AnimationTrajectory;
};

export default function Grid({
  animationTrajectory = null,
  ...props
}: GridProps) {
  return (
    <BaseGrid
      GridRowsComponent={GridRows}
      GridColumnsComponent={GridColumns}
      {...props}
    />
  );
}
