import React, { useContext } from "react";
import { PatternLines, PatternCircles } from "@vx/pattern";
import ChartContext from "../context/ChartContext";

const patternId = "xy-chart-pattern";

export default function CustomChartBackground({ backgroundPattern }) {
  const { theme, margin, width, height } = useContext(ChartContext);

  // early return if scale is not available in context
  if (
    width == null ||
    height == null ||
    margin == null ||
    backgroundPattern === null
  )
    return null;

  let Pattern;

  switch (backgroundPattern) {
    case "Circles":
      Pattern = PatternCircles;
      break;
    case "Lines":
      Pattern = PatternLines;
      break;
    default:
      Pattern = PatternLines;
      break;
  }

  return (
    <>
      <Pattern
        id={patternId}
        width={10}
        height={10}
        orientation={["diagonal"]}
        stroke={theme?.gridStyles?.stroke}
        strokeWidth={0.5}
      />
      <rect
        x={0}
        y={0}
        width={width}
        height={height}
        fill={theme?.baseColor ?? "#fff"}
      />
      <rect
        x={margin.left}
        y={margin.top}
        width={width - margin.left - margin.right}
        height={height - margin.top - margin.bottom}
        fill={`url(#${patternId})`}
      />
    </>
  );
}
