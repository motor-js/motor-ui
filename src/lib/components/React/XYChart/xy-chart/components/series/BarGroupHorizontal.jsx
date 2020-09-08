import React from "react";
import cx from "classnames";
import { Group } from "@vx/group";
// import Bar from "./Bar";
import { Bar } from "@vx/shape";
import getBandwidth from "../../util/getBandwidth";

export default function BarGroupHorizontalComponent({
  data,
  className,
  top,
  left,
  x = (/** val */) => 0,
  y0,
  y0Scale,
  y1Scale,
  xScale,
  color,
  keys,
  width,
  children,
  ...restProps
}) {
  const barHeight = getBandwidth(y1Scale);

  const barGroups = data.map((group, i) => ({
    index: i,
    y0: y0Scale(y0(group)) || 0,
    bars: keys.map((key, j) => {
      const value = group[key];
      return {
        index: j,
        key,
        value,
        height: barHeight,
        x: x(value) || 0,
        y: y1Scale(key) || 0,
        color: color(key, j),
        width: xScale(value) || 0,
        selectionId: group.selectionId,
      };
    }),
  }));

  // eslint-disable-next-line react/jsx-no-useless-fragment
  if (children) return <>{children(barGroups)}</>;

  return (
    <Group
      className={cx("vx-bar-group-horizontal", className)}
      top={top}
      left={left}
    >
      {barGroups.map((barGroup) => (
        <Group
          key={`bar-group-${barGroup.index}-${barGroup.y0}`}
          top={barGroup.y0}
        >
          {barGroup.bars.map((bar) => (
            <Bar
              key={`bar-group-bar-${barGroup.index}-${bar.index}-${bar.value}-${bar.key}`}
              x={bar.x}
              y={bar.y}
              width={bar.width}
              height={bar.height}
              fill={bar.color}
              {...restProps}
            />
          ))}
        </Group>
      ))}
    </Group>
  );
}
