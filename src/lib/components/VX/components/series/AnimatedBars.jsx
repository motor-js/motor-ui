import React from "react";
import { animated, useSprings } from "react-spring";

export default function AnimatedBars({
  bars,
  x,
  y,
  width,
  height,
  ...rectProps
}) {
  const animatedBars = useSprings(
    bars.length,
    bars.map((bar) => ({
      x: x?.(bar) ?? bar.x,
      y: y?.(bar) ?? bar.y,
      width: width?.(bar) ?? bar.width,
      height: height?.(bar) ?? bar.height,
      color: bar.color,
    }))
  );

  return (
    // react complains when using component if we don't wrap in Fragment
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>
      {animatedBars.map((bar, index) => (
        <animated.rect
          key={`${index}`}
          x={bar.x}
          y={bar.y}
          width={bar.width}
          height={bar.height}
          fill={bar.color}
          {...rectProps}
        />
      ))}
    </>
  );
}
