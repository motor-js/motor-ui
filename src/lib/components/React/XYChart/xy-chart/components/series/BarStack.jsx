import React from "react";
import cx from "classnames";
// import { stack as d3stack, SeriesPoint } from "d3-shape";
import * as d3 from "d3-shape";
import { Group } from "@visx/group";
import { getFirstItem, getSecondItem } from "../../util/accessors";
import getBandwidth from "../../util/getBandwidth";
import setNumOrAccessor from "../../util/setNumberOrNumberAccessor";
import stackOrder from "../../util/stackOrder";
import stackOffset from "../../util/stackOffset";
// import Bar from "./Bar";
import AnimatedBars from "./AnimatedBars";

export default function BarStackComponent({
  data,
  className,
  top,
  left,
  x,
  y0 = getFirstItem,
  y1 = getSecondItem,
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
  const stack = d3.stack();
  if (keys) stack.keys(keys);
  if (value) setNumOrAccessor(stack.value, value);
  if (order) stack.order(stackOrder(order));
  if (offset) stack.offset(stackOffset(offset));

  const stacks = stack(data);
  const barWidth = getBandwidth(xScale);

  const barStacks = stacks.map((barStack, i) => {
    const { key } = barStack;
    return {
      index: i,
      key,
      bars: barStack.map((bar, j) => {
        const barHeight = (yScale(y0(bar)) || 0) - (yScale(y1(bar)) || 0);
        const barY = yScale(y1(bar));
        const barX =
          "bandwidth" in xScale
            ? xScale(x(bar.data))
            : Math.max((xScale(x(bar.data)) || 0) - barWidth / 2);

        return {
          bar,
          key,
          index: j,
          height: barHeight,
          width: barWidth,
          x: barX || 0,
          y: barY || 0,
          color: color(barStack.key, j),
          selectionId: bar.data.selectionId,
        };
      }),
    };
  });

  // eslint-disable-next-line react/jsx-no-useless-fragment
  if (children) return <>{children(barStacks)}</>;

  return (
    <Group className={cx("visx-bar-stack", className)} top={top} left={left}>
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
