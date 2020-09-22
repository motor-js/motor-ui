import React from "react";
import cx from "classnames";
import { stack as d3stack, SeriesPoint } from "d3-shape";
import { Group } from "@visx/group";
import { getFirstItem, getSecondItem } from "../../util/accessors";
import getBandwidth from "../../util/getBandwidth";
import setNumOrAccessor from "../../util/setNumberOrNumberAccessor";
import stackOrder from "../../util/stackOrder";
import stackOffset from "../../util/stackOffset";
// import Bar from "./Bar";
import AnimatedBars from "./AnimatedBars";

export default function BarStackHorizontal({
  data,
  className,
  top,
  left,
  y,
  x0 = getFirstItem,
  x1 = getSecondItem,
  xScale,
  yScale,
  color,
  keys,
  value,
  order,
  offset,
  children,
  ...restProps
}) {
  const stack = d3stack();
  if (keys) stack.keys(keys);
  if (value) setNumOrAccessor(stack.value, value);
  if (order) stack.order(stackOrder(order));
  if (offset) stack.offset(stackOffset(offset));

  const stacks = stack(data);
  const barHeight = getBandwidth(yScale);

  const barStacks = stacks.map((barStack, i) => {
    const { key } = barStack;
    return {
      index: i,
      key,
      bars: barStack.map((bar, j) => {
        const barWidth = (xScale(x1(bar)) || 0) - (xScale(x0(bar)) || 0);
        const barX = xScale(x0(bar));
        const barY =
          "bandwidth" in yScale
            ? yScale(y(bar.data))
            : Math.max((yScale(y(bar.data)) || 0) - barWidth / 2);
        return {
          bar,
          key,
          index: j,
          height: barHeight,
          width: barWidth,
          x: barX || 0,
          y: barY || 0,
          color: color(barStack.key, j),
          selectionId: barStack.selectionId,
        };
      }),
    };
  });

  // eslint-disable-next-line react/jsx-no-useless-fragment
  if (children) return <>{children(barStacks)}</>;

  return (
    <Group
      className={cx("vx-bar-stack-horizontal", className)}
      top={top}
      left={left}
    >
      {barStacks.map((barStack) =>
        barStack.bars.map((bar) => (
          <AnimatedBars
            key={`bar-stack-${barStack.index}-${bar.index}`}
            x={bar.x}
            y={bar.y}
            height={bar.height}
            width={bar.width}
            fill={bar.color}
            {...restProps}
          />
        ))
      )}
    </Group>
  );
}
