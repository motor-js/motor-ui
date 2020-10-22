import React from "react";
import ParentSize from "@visx/responsive/lib/components/ParentSize";
import Example from "../XYChart/Example";
// import "./sandbox-styles.css";

function XYChartTest({ type, size, color, timeout }) {
  return (
    <ParentSize>
      {({ width, height }) => <Example width={width} height={height} />}
    </ParentSize>
  );
}

export default XYChartTest;
