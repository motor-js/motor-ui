import React, { useState } from "react";
// import { animated, useSprings } from "react-spring";
import { Bar } from "@vx/shape";

export default function AnimatedBars({
  bars,
  x,
  y,
  width,
  height,
  handleClick,
  ...rectProps
}) {
  // const animatedBars = useSprings(
  //   bars.length,
  //   bars.map((bar) => ({
  //     x: x?.(bar) ?? bar.x,
  //     y: y?.(bar) ?? bar.y,
  //     width: width?.(bar) ?? bar.width,
  //     height: height?.(bar) ?? bar.height,
  //     color: bar.color,
  //   }))
  // );

  const [selectedBar, setSelectedBar] = useState([]);
  // console.log(selectedBar);

  return (
    // react complains when using component if we don't wrap in Fragment
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>
      {bars.map((bar, index) => (
        <Bar
          key={`${index}`}
          x={x?.(bar) ?? bar.x}
          y={y?.(bar) ?? bar.y}
          width={width?.(bar) ?? bar.width}
          height={height?.(bar) ?? bar.height}
          // fill={bar.color}
          // fill={isSelected ? "white" : "rgba(23, 233, 217, 0.5)"}
          fill={selectedBar.includes(bar.selectionId) ? "red" : bar.color}
          style={{ cursor: "pointer " }}
          onClick={() => {
            // setSelectedBar(isSelected ? null : letter);
            // console.log(bar);
            setSelectedBar(
              selectedBar.includes(bar.selectionId)
                ? selectedBar.filter(function(value, index, arr) {
                    return value !== bar.selectionId;
                  })
                : (selectedBar) => [...selectedBar, bar.selectionId]
            );
            handleClick([...selectedBar, bar.selectionId]);
          }}
          {...rectProps}
        />
      ))}
    </>
  );
}
