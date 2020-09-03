import React, { useContext, useEffect, useCallback } from "react";
import ParentSize from "@vx/responsive/lib/components/ParentSize";
import useMeasure from "react-use-measure";

import ChartContext from "../context/ChartContext";
import TooltipContext from "../context/TooltipContext";

export default function XYChart(props) {
  const {
    children,
    width,
    height,
    margin,
    dualAxis,
    captureEvents = true,
    svgBackground = true,
  } = props;
  const { findNearestData, setChartDimensions } = useContext(ChartContext);
  const { showTooltip, hideTooltip } = useContext(TooltipContext) || {};
  const [svgRef, svgBounds] = useMeasure();

  // update dimensions in context
  useEffect(() => {
    if (width != null && height != null && width > 0 && height > 0) {
      setChartDimensions({
        width: dualAxis ? width - margin.left : width,
        height,
        margin,
      });
    }
  }, [setChartDimensions, width, height, margin]);

  const onMouseMove = useCallback(
    (event) => {
      const nearestData = findNearestData(event);
      if (nearestData.closestDatum && showTooltip) {
        showTooltip({
          tooltipData: {
            ...nearestData,
            // @TODO remove this and rely on useTooltipInPortal() instead
            pageX: event.pageX,
            pageY: event.pageY,
            svgOriginX: svgBounds?.x,
            svgOriginY: svgBounds?.y,
          },
        });
      }
    },
    [findNearestData, showTooltip, svgBounds]
  );

  // if width and height aren't both provided, wrap in auto-sizer
  if (width == null || height == null) {
    return (
      <ParentSize>{(dims) => <XYChart {...dims} {...props} />}</ParentSize>
    );
  }

  return width > 0 && height > 0 ? (
    <svg ref={svgRef} width={width} height={height}>
      {svgBackground && (
        <rect
          x={0}
          y={0}
          width={width}
          height={height}
          fill="url(#area-background-gradient)"
          rx={14}
        />
      )}
      {children}
      {captureEvents && (
        <rect
          x={margin.left}
          y={margin.top}
          fill="transparent"
          width={
            width - margin.left - margin.right - `${dualAxis ? margin.left : 0}`
          }
          height={height - margin.top - margin.bottom}
          onMouseMove={onMouseMove}
          onMouseLeave={hideTooltip}
        />
      )}
    </svg>
  ) : null;
}
