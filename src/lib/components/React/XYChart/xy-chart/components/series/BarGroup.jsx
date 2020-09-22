import React from "react";
import cx from "classnames";
import { Group } from "@visx/group";
// import Bar from "./Bar";
import { Bar } from "@visx/shape";

import getBandwidth from "../../util/getBandwidth";

/**
 * Generates bar groups as an array of objects and renders `<rect />`s for each datum grouped by `key`. A general setup might look like this:
 *
 * ```js
 * const data = [{
 *  date: date1,
 *  key1: value,
 *  key2: value,
 *  key3: value
 * }, {
 *  date: date2,
 *  key1: value,
 *  key2: value,
 *  key3: value,
 * }];
 *
 * const x0 = d => d.date;
 * const keys = [key1, key2, key3];
 *
 * const x0Scale = scaleBand({
 *  domain: data.map(x0),
 *  padding: 0.2
 * });
 * const x1Scale = scaleBand({
 *  domain: keys,
 *  padding: 0.1
 * });
 * const yScale = scaleLinear({
 *   domain: [0, Math.max(...data.map(d => Math.max(...keys.map(key => d[key]))))]
 * });
 * const color = scaleOrdinal({
 *   domain: keys,
 *   range: [blue, green, purple]
 * });
 * ```
 *
 * Example: [https://vx-demo.now.sh/bargroup](https://vx-demo.now.sh/bargroup)
 */
export default function BarGroupComponent({
  data,
  className,
  top,
  left,
  x0,
  x0Scale,
  x1Scale,
  yScale,
  color,
  keys,
  height,
  children,
  ...restProps
}) {
  const barWidth = getBandwidth(x1Scale);

  const barGroups = data.map((group, i) => ({
    index: i,
    x0: x0Scale(x0(group)),
    bars: keys.map((key, j) => {
      const value = group[key];
      return {
        index: j,
        key,
        value,
        width: barWidth,
        x: x1Scale(key) || 0,
        y: yScale(value) || 0,
        color: color(key, j),
        height: height - (yScale(value) || 0),
        selectionId: group.selectionId,
      };
    }),
  }));

  // eslint-disable-next-line react/jsx-no-useless-fragment
  if (children)
    return (
      <Group className={cx("vx-bar-group", className)} top={top} left={left}>
        {children(barGroups)}
      </Group>
    );

  return (
    <Group className={cx("vx-bar-group", className)} top={top} left={left}>
      {barGroups.map((barGroup) => (
        <Group
          key={`bar-group-${barGroup.index}-${barGroup.x0}`}
          left={barGroup.x0}
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
