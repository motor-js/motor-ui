import React from "react";

import ParentSize from "@visx/responsive/lib/components/ParentSize";
import Example from "../XYChart copy/Example";

function XYChartTest({ width, height, ...props }) {
  // if width and height aren't both provided, wrap in auto-sizer
  if (width == null || height == null) {
    return (
      <ParentSize>{(dims) => <Example {...dims} {...props} />}</ParentSize>
    );
  }

  return <Example width={width} height={height} {...props} />;
}

export default XYChartTest;
