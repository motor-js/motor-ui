import React from "react";
import cx from "classnames";
import { Group } from "@visx/group";
import { area, stack as stackPath } from "../../util/D3ShapeFactories";

export default function Stack({
  className,
  top,
  left,
  keys,
  data,
  curve,
  defined,
  x,
  x0,
  x1,
  y0,
  y1,
  value,
  order,
  offset,
  color,
  children,
  ...restProps
}) {
  const stack = stackPath({ keys, value, order, offset });
  const path = area({
    x,
    x0,
    x1,
    y0,
    y1,
    curve,
    defined,
  });

  const stacks = stack(data);

  // eslint-disable-next-line react/jsx-no-useless-fragment
  if (children) return <>{children({ stacks, path, stack, color })}</>;

  return (
    <Group top={top} left={left}>
      {stacks.map((series, i) => (
        <path
          className={cx("visx-stack", className)}
          key={`stack-${i}-${series.key || ""}`}
          d={path(series) || ""}
          fill={color?.(series.key, i)}
          {...restProps}
        />
      ))}
    </Group>
  );
}
