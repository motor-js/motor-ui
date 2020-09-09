import React, { useContext } from "react";
// import BaseBrush from "@vx/brush/lib/Brush";
import BaseBrush from "./BaseBrush";
import ChartContext from "../../context/ChartContext";

const leftRightResizeTriggers = ["left", "right"];
const topBottomResizeTriggers = ["top", "bottom"];
const allResizeTriggers = [
  "left",
  "right",
  "top",
  "bottom",
  "topLeft",
  "topRight",
  "bottomLeft",
  "bottomRight",
];

export default function Brush({
  brushDirection = "horizontal",
  brushRegion = "chart",
  handleSize = 8,
  initialBrushPosition,
  onChange,
  onClick,
  resizeTriggerAreas,
  selectedBoxStyle,
  xAxisOrientation,
  yAxisOrientation,
  orientation,
}) {
  const { xScale, yScale, margin } = useContext(ChartContext) || {};
  //  const { orientation } = props;

  // not yet available in context
  if (!xScale || !yScale) return null;

  // @TODO make a util for this
  const xRange = xScale.range();
  const yRange = yScale.range();
  const width = Math.abs(xRange[1] - xRange[0]);
  const height = Math.abs(yRange[1] - yRange[0]);

  const topOffset =
    xAxisOrientation === "top"
      ? height - margin.bottom
      : xAxisOrientation === "bottom"
      ? margin.top
      : 0;

  const leftOffset =
    yAxisOrientation === "left"
      ? margin.left
      : yAxisOrientation === "right"
      ? width - margin.right
      : 0;

  return (
    <BaseBrush
      // force clear the brush if any of these change
      top={topOffset}
      left={leftOffset}
      key={`${brushRegion}-${xAxisOrientation}-${yAxisOrientation}`}
      xScale={xScale}
      yScale={yScale}
      width={width}
      height={height}
      margin={margin}
      handleSize={handleSize}
      resizeTriggerAreas={
        resizeTriggerAreas ||
        (brushDirection === "horizontal"
          ? leftRightResizeTriggers
          : brushDirection === "vertical"
          ? topBottomResizeTriggers
          : allResizeTriggers)
      }
      brushDirection={brushDirection}
      initialBrushPosition={
        initialBrushPosition
          ? initialBrushPosition({ xScale, yScale })
          : undefined
      }
      onChange={onChange}
      onClick={onClick}
      selectedBoxStyle={selectedBoxStyle}
      brushRegion={brushRegion}
      // xAxisOrientation={xAxisOrientation}
      // yAxisOrientation={yAxisOrientation}
    />
  );
}
