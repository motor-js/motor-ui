/* eslint-disable unicorn/consistent-function-scoping */
import React, { useMemo } from "react";
import cx from "classnames";
import { animated, useTransition, interpolate } from "react-spring";
import { Text } from "@vx/text";

const defaultTickLabelProps = (/** tickValue, index */) => ({
  textAnchor: "middle",
  fontFamily: "Arial",
  fontSize: 10,
  fill: "#222",
});

/** Hook that returns memoized config for react-spring's transition from/enter/update/leave */
function useTickTransitionConfig({ horizontal, width, height, margin, scale }) {
  return useMemo(() => {
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const fromLeave = ({ from, to, value }) => {
      const scaledValue = scale(value);

      return {
        fromX: horizontal
          ? // for top/bottom scales, enter from left or right based on value
            scaledValue < (margin.left + innerWidth) / 2
            ? margin.left
            : margin.left + innerWidth
          : // for left/right scales, don't animate x
            from.x,
        // same logic as above for the `to` Point
        toX: horizontal
          ? scaledValue < (margin.left + innerWidth) / 2
            ? margin.left
            : margin.left + innerWidth
          : to.x,
        // for top/bottom scales, don't animate y
        fromY: horizontal
          ? from.y
          : // for top/bottom scales, animate from top or bottom based on value
          scaledValue < (margin.top + innerHeight) / 2
          ? margin.top
          : margin.top + innerHeight,
        toY: horizontal
          ? from.y
          : scaledValue < (margin.top + innerHeight) / 2
          ? margin.top
          : margin.top + innerHeight,
        opacity: 0,
      };
    };

    const enterUpdate = ({ from, to }) => ({
      fromX: from.x,
      toX: to.x,
      fromY: from.y,
      toY: to.y,
      opacity: 1,
    });

    return {
      from: fromLeave,
      leave: fromLeave,
      enter: enterUpdate,
      update: enterUpdate,
    };
  }, [horizontal, width, height, margin, scale]);
}

export default function AnimatedTicks({
  ticks,
  margin,
  width,
  height,
  horizontal,
  orientation,
  tickLabelProps,
  tickClassName,
  tickStroke,
  scale,
  hideTicks,
}) {
  const transitionConfig = useTickTransitionConfig({
    margin,
    width,
    height,
    horizontal,
    scale,
  });
  const animatedTicks = useTransition(
    ticks,
    (tick) => `${tick.value}-${horizontal}`,
    {
      unique: true,
      ...transitionConfig,
    }
  );

  return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>
      {animatedTicks.map(({ item, key, props }, index) => {
        // @ts-ignore react-spring types don't handle fromX, etc.
        const { fromX, toX, fromY, toY, opacity } = props;
        const tickLabelPropsObj = (tickLabelProps ?? defaultTickLabelProps)(
          item.value,
          index
        );
        return (
          <animated.g key={key} className={cx("vx-axis-tick", tickClassName)}>
            {!hideTicks && (
              <animated.line
                x1={fromX}
                x2={toX}
                y1={fromY}
                y2={toY}
                stroke={tickStroke}
                strokeLinecap="square"
                strokeOpacity={opacity}
              />
            )}
            <animated.g
              key={index}
              transform={interpolate(
                [toX, toY],
                (interpolatedX, interpolatedY) =>
                  `translate(${interpolatedX},${interpolatedY +
                    (orientation === "bottom" &&
                    typeof tickLabelPropsObj.fontSize === "number"
                      ? tickLabelPropsObj.fontSize ?? 10
                      : 0)})`
              )}
              opacity={opacity}
            >
              <Text {...tickLabelPropsObj}>{item.formattedValue}</Text>
            </animated.g>
          </animated.g>
        );
      })}
    </>
  );
}
