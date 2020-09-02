import React from "react";
import cx from "classnames";
import Line from "@vx/shape/lib/shapes/Line";
import { Group } from "@vx/group";
import { Point } from "@vx/point";
import { getTicks } from "@vx/scale";

export default function GridColumns({
  top = 0,
  left = 0,
  scale,
  height,
  stroke = "#eaf0f6",
  strokeWidth = 1,
  strokeDasharray,
  className,
  numTicks = 10,
  lineStyle,
  offset,
  tickValues,
  ...restProps
}) {
  const ticks = tickValues ?? getTicks(scale, numTicks);
  return (
    <Group className={cx("vx-columns", className)} top={top} left={left}>
      {ticks.map((d, i) => {
        const x = offset ? (scale(d) || 0) + offset : scale(d) || 0;
        const fromPoint = new Point({
          x,
          y: 0,
        });
        const toPoint = new Point({
          x,
          y: height,
        });
        return (
          <Line
            key={`column-line-${d}-${i}`}
            from={fromPoint}
            to={toPoint}
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeDasharray={strokeDasharray}
            style={lineStyle}
            {...restProps}
          />
        );
      })}
    </Group>
  );
}
