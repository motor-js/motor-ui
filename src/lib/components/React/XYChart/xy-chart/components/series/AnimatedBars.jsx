import React, { useState, useEffect } from "react";
// import { animated, useSprings } from "react-spring";
import { Bar } from "@vx/shape";
// import { StyledBar } from "./BarTheme";

export default function AnimatedBars({
  bars,
  x,
  y,
  width,
  height,
  handleClick,
  isSelectionXYChartVisible,
  theme,
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

  const { selection, nonSelection } = theme;

  const styleProp = (selectionId, styleprop) =>
    !isSelectionXYChartVisible
      ? selection[styleprop]
      : selectedBar.includes(selectionId) && isSelectionXYChartVisible
      ? selection[styleprop]
      : nonSelection[styleprop];

  const [selectedBar, setSelectedBar] = useState([]);

  useEffect(() => {
    if (!isSelectionXYChartVisible) setSelectedBar([]);
  }, [isSelectionXYChartVisible]);

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
          // fill={selectedBar.includes(bar.selectionId) ? "red" : bar.color}
          fill={bar.color}
          // barOpacity={0.65}
          opacity={
            // !isSelectionXYChartVisible
            //   ? selection.opacity
            //   : selectedBar.includes(bar.selectionId) &&
            //     isSelectionXYChartVisible
            //   ? selection.opacity
            //   : nonSelection.opacity
            styleProp(bar.selectionId, "opacity")
          }
          style={{ cursor: "pointer " }}
          onClick={() => {
            // setSelectedBar(isSelected ? null : letter);
            // console.log(bar);
            const selections = selectedBar.includes(bar.selectionId)
              ? selectedBar.filter(function(value, index, arr) {
                  return value !== bar.selectionId;
                })
              : [...selectedBar, bar.selectionId];

            setSelectedBar(selections);
            handleClick(selections);
          }}
          {...rectProps}
        />
      ))}
    </>
  );
}
