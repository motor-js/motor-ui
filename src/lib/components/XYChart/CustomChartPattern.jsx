import React, { useContext } from "react";
import {
  PatternCircles,
  PatternHexagons,
  PatternLines,
  PatternWaves,
} from "@visx/pattern";
import { DataContext } from "../visx";
import { selectColor } from "../../utils";

const patternId = "xy-chart-pattern";

export default function CustomChartBackground({ backgroundPattern }) {
  const { theme, margin, width, height, innerWidth, innerHeight } = useContext(
    DataContext
  );

  // early return values not available in context
  if (
    width == null ||
    height == null ||
    margin == null ||
    theme == null ||
    backgroundPattern == null
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
        width={16}
        height={16}
        orientation={["diagonal"]}
        stroke={theme?.backgroundStyles?.stroke}
        strokeWidth={theme?.backgroundStyles?.strokeWidth}
      />
      <rect
        x={0}
        y={0}
        width={width}
        height={height}
        fill={selectColor(theme?.backgroundColor, theme) ?? "#fff"}
      />
      <rect
        x={margin.left}
        y={margin.top}
        width={innerWidth}
        height={innerHeight}
        fill={`url(#${patternId})`}
        fillOpacity={0.3}
      />
    </>
  );
}
