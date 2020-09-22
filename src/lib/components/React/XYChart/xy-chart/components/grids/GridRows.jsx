import React, { useContext } from "react";
import cx from "classnames";
import { Line } from "@visx/shape";
import { Group } from "@visx/group";
import { Point } from "@visx/point";
import getTicks from "../../util/getTicks";

export default function GridRow({
  top = 0,
  left = 0,
  scale,
  width,
  // stroke = "#eaf0f6",
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
    <Group className={cx("vx-rows", className)} top={top} left={left}>
      {ticks.map((d, i) => {
        const y = offset ? (scale(d) || 0) + offset : scale(d) || 0;
        const fromPoint = new Point({
          x: 0,
          y,
        });
        const toPoint = new Point({
          x: width,
          y,
        });
        return (
          <Line
            key={`row-line-${d}-${i}`}
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
