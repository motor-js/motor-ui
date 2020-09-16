import React, { useCallback, useContext } from "react";
// import { animated, useSprings } from "react-spring";
import { Bar } from "@vx/shape";
// import { StyledBar } from "./BarTheme";
import ChartContext from "../../context/ChartContext";
import TooltipContext from "../../context/TooltipContext";

import { isEmpty } from "../../../../../../utils";

export default function AnimatedBars({
  bars,
  x,
  y,
  width,
  height,
  handleClick,
  currentSelectionIds,
  // selectionIds,
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

  const { findNearestData } = useContext(ChartContext);
  const { showTooltip, hideTooltip } = useContext(TooltipContext) || {};

  const { selection, nonSelection } = theme;

  const styleProp = (selectionId, styleprop) =>
    isEmpty(currentSelectionIds)
      ? selection[styleprop]
      : currentSelectionIds.includes(selectionId) &&
        !isEmpty(currentSelectionIds)
      ? selection[styleprop]
      : nonSelection[styleprop];

  // const [selectedBar, setSelectedBar] = useState([]);

  // useEffect(() => {
  //   if (!currentSelectionIds) setSelectedBar([]);
  // }, [currentSelectionIds]);

  const onMouseMove = useCallback(
    (event) => {
      const nearestData = findNearestData(event);
      if (nearestData.closestDatum && showTooltip) {
        showTooltip({ tooltipData: { ...nearestData } });
      }
    },
    [findNearestData, showTooltip]
  );

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
            // bar.opacity || styleProp(bar.selectionId, "opacity")
            styleProp(bar.selectionId, "opacity")
          }
          style={{ cursor: "pointer " }}
          onClick={() => {
            // setSelectedBar(isSelected ? null : letter);

            const selections = currentSelectionIds.includes(bar.selectionId)
              ? currentSelectionIds.filter(function(value, index, arr) {
                  return value !== bar.selectionId;
                })
              : [...currentSelectionIds, bar.selectionId];

            // setSelectedBar(selections);
            handleClick(selections);
          }}
          onMouseEnter={() => {
            bar.opacity = 0.7;
          }}
          onMouseMove={onMouseMove}
          onMouseLeave={() => {
            // bar.opacity = 1;
            hideTooltip();
          }}
          {...rectProps}
        />
      ))}
    </>
  );
}
