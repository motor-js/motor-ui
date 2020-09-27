import React from "react";
import cx from "classnames";
import { Line } from "@visx/shape";
import { Group } from "@visx/group";
import { Point } from "@visx/point";
import getTicks from "../../utils/getTicks";

export default function GridColumns({
  top = 0,
  left = 0,
  scale,
  height,
  stroke,
  strokeWidth,
  strokeDasharray,
  className,
  numTicks,
  lineStyle,
  offset,
  tickValues,
  ...restProps
}) {
  const ticks = tickValues ?? getTicks(scale, numTicks);
  return (
    <Group className={cx("visx-columns", className)} top={top} left={left}>
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
