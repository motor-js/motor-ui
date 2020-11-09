import React, { useContext, useCallback, useRef, useEffect } from "react";
import BaseBrush, { BaseBrushProps } from "./BaseBrush";
import DataContext from "../../context/DataContext";
import isValidNumber from "../../typeguards/isValidNumber";
import {
  Bounds,
  PartialBrushStartEnd,
  MarginShape,
  ResizeTriggerAreas,
  Scale,
} from "./types";

import { isEmpty } from "../../../../utils";

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

export type BrushProps = {
  /** Style object for the Brush selection rect. */
  selectedBoxStyle: React.SVGProps<SVGRectElement>;
  /** x-coordinate scale. */
  xScale: Scale;
  /** y-coordinate scale. */
  yScale: Scale;
  /** Brush stage height. */
  height: number;
  /** Brush stage width. */
  width: number;
  /** Callback invoked on a change in Brush bounds. */
  onChange?: (bounds: Bounds | null) => void;
  /** Callback invoked on initialization of a Brush (not Brush move). */
  onBrushStart?: BaseBrushProps["onBrushStart"];
  /** Callback invoked on mouse up when a Brush size is being updated. */
  onBrushEnd?: (bounds: Bounds | null) => void;
  /** Callback invoked on mouse move in Brush stage when *not* dragging. */
  onMouseMove?: BaseBrushProps["onMouseMove"];
  /** Callback invoked on mouse leave from Brush stage when *not* dragging. */
  onMouseLeave?: BaseBrushProps["onMouseLeave"];
  /** Callback invoked on Brush stage click. */
  onClick?: BaseBrushProps["onClick"];
  /** Margin subtracted from Brush stage dimensions. */
  margin?: MarginShape;
  /** Allowed directions for Brush dimensional change. */
  brushDirection?: "vertical" | "horizontal" | "both";
  /** Initial start and end position of the Brush. */
  initialBrushPosition?: (scales) => BaseBrushProps["initialBrushPosition"];
  /** Array of rect sides and corners which should be resizeable / can trigger a Brush size change. */
  resizeTriggerAreas?: any;
  /** What is being brushed, used for margin subtraction. */
  brushRegion?: "xAxis" | "yAxis" | "chart";
  /** Orientation of yAxis if `brushRegion=yAxis`. */
  yAxisOrientation?: "left" | "right";
  /** Orientation of xAxis if `brushRegion=xAxis`. */
  xAxisOrientation?: "top" | "bottom";
  /** Whether movement of Brush should be disabled. */
  disableDraggingSelection: boolean;
  /** Whether to reset the Brush on drag end. */
  resetOnEnd?: boolean;
  /** Size of Brush handles, applies to all `resizeTriggerAreas`. */
  handleSize: number;
};

export default function Brush({
  brushDirection = "horizontal",
  brushRegion = "chart",
  handleSize = 8,
  initialBrushPosition,
  // onChange,
  onClick,
  resizeTriggerAreas,
  selectedBoxStyle,
  xAxisOrientation,
  yAxisOrientation,
}: BrushProps) {
  const {
    xScale,
    yScale,
    measureInfo,
    margin,
    dataRegistry,
    handleClick,
    currentSelectionIds,
    dataKeys,
    singleDimension,
    chartType,
  } = useContext(DataContext);

  const childRef = useRef<any>();

  let xAccessor = null;
  let yAccessor = null;

  useEffect(() => {
    if (isEmpty(currentSelectionIds) && childRef.current)
      childRef.current.reset();
  }, [currentSelectionIds]);

  const getScaledX = useCallback(
    (d, i) => {
      const x = xScale(xAccessor?.(d));
      return isValidNumber(x) ? x + (xScale.bandwidth?.() ?? 0) / 2 : null;
    },
    [xScale, xAccessor]
  );

  const getScaledY = useCallback(
    (d, i) => {
      const y = yScale(yAccessor?.(d));
      return isValidNumber(y) ? y + (yScale.bandwidth?.() ?? 0) / 2 : null;
    },
    [yScale, yAccessor]
  );

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

  let selectionIds = [];

  const onChange = (domain) => {
    if (!domain) return;

    const { x0, x1, y0, y1 } = domain.extent;

    {
      const data = chartType.includes("scatter")
        ? [measureInfo[0]]
        : measureInfo;

      singleDimension
        ? data.map((m, i) => {
            const registeredData = dataRegistry.get(m.qFallbackTitle);
            xAccessor = registeredData.xAccessor;
            yAccessor = registeredData.yAccessor;

            const stockCopy = registeredData.data
              .filter((datum, index) => {
                const x = getScaledX(datum, index);
                const y = getScaledY(datum, index);
                // return x > x0 && x < x1 && y > y0 && y < y1;
                return brushDirection === "horizontal"
                  ? x > x0 + leftOffset && x < x1 + leftOffset
                  : y > y0 + topOffset && y < y1 + topOffset;
              })
              .map((obj) => {
                return registeredData.elAccessor(obj);
              });
            // setFilteredStock(stockCopy);
            selectionIds = [...selectionIds, ...stockCopy];
          })
        : dataKeys.map((m, i) => {
            const registeredData = dataRegistry.get(m);

            xAccessor = registeredData.xAccessor;
            yAccessor = registeredData.yAccessor;

            const stockCopy = registeredData.data
              .filter((datum, index) => {
                const x = getScaledX(datum, index);
                const y = getScaledY(datum, index);
                // return x > x0 && x < x1 && y > y0 && y < y1;
                return brushDirection === "horizontal"
                  ? x > x0 + leftOffset && x < x1 + leftOffset
                  : y > y0 + topOffset && y < y1 + topOffset;
              })
              .map((obj) => {
                console.log(obj);
                return registeredData.elAccessor(obj);
              });
            selectionIds = [...selectionIds, ...stockCopy];
          });
    }
    if (!isEmpty(selectionIds)) handleClick(selectionIds);
  };

  // const onMouseUp = () => handleClick(selectionIds);

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
      // onMouseUp={onMouseUp}
      onClick={onClick}
      selectedBoxStyle={selectedBoxStyle}
      brushRegion={brushRegion}
      ref={childRef}
    />
  );
}
