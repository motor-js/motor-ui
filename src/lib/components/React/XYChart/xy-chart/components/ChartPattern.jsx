import React, { useContext } from "react";
import {
  PatternCircles,
  PatternHexagons,
  PatternLines,
  PatternWaves,
} from "./aesthetic/Patterns";
import ChartContext from "../context/ChartContext";

const patternId = "xy-chart-pattern";

import { selectColor } from "../../../../../utils/colors";

export default function CustomChartPattern({ backgroundPattern }) {
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
    case "Hexagons":
      Pattern = PatternHexagons;
      break;
    case "Lines":
      Pattern = PatternLines;
      break;
    case "Waves":
      Pattern = PatternWaves;
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
        // stroke={theme?.backgroundStyles?.stroke}
        stroke={selectColor(theme?.backgroundStyles?.stroke, theme)}
        strokeWidth={theme?.backgroundStyles?.strokeWidth}
      />
      <rect
        x={0}
        y={0}
        width={width}
        height={height}
        fill={selectColor(theme?.baseColor, theme) ?? "#fff"}
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
