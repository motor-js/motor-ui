import React, { useContext, useEffect, useCallback } from "react";
import { ParentSize } from "@visx/responsive";
import { useTooltipInPortal } from "@visx/tooltip";

import ChartContext from "../../context/ChartContext";
import TooltipContext from "../../context/TooltipContext";

export default function XYChart(props) {
  const {
    children,
    width,
    height,
    margin,
    dualAxis,
    // captureEvents = true,
    captureEvents,
    svgBackground = true,
    onMouseDown,
  } = props;
  const { containerRef, TooltipInPortal } = useTooltipInPortal();
  const {
    findNearestData,
    setChartDimensions,
    chartType,
    singleMeasure,
  } = useContext(ChartContext);
  const { showTooltip, hideTooltip } = useContext(TooltipContext) || {};

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
        showTooltip({ tooltipData: { ...nearestData } });
      }
    },
    [findNearestData, showTooltip]
  );

  // if width and height aren't both provided, wrap in auto-sizer
  if (width == null || height == null) {
    return (
      <ParentSize>{(dims) => <XYChart {...dims} {...props} />}</ParentSize>
    );
  }

  return width > 0 && height > 0 ? (
    <svg
      ref={containerRef}
      width={width}
      height={height}
      onMouseDown={onMouseDown}
    >
      {svgBackground && (
        <rect
          x={0}
          y={0}
          width={width}
          height={height}
          fill="url(#visx-background-gradient)"
          rx={14}
        />
      )}
      {children}
      {captureEvents &&
        // Revist once Group has been made part of XYCHart
        // https://github.com/airbnb/visx/projects/3
        !(chartType.includes("groupedbar") && singleMeasure) && (
          <rect
            x={margin.left}
            y={margin.top}
            fill="transparent"
            width={
              width -
              margin.left -
              margin.right -
              `${dualAxis ? margin.left : 0}`
            }
            height={height - margin.top - margin.bottom}
            onMouseMove={onMouseMove}
            onMouseLeave={hideTooltip}
          />
        )}
    </svg>
  ) : null;
}
