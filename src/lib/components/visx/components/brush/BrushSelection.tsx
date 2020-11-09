/* eslint react/jsx-handler-names: 0 */
import React, { Component } from "react";
import { Drag } from "@visx/drag";
import {
  BaseBrushState as BrushState,
  UpdateBrush,
  BaseBrushProps,
} from "./BaseBrush";

const DRAGGING_OVERLAY_STYLES = { cursor: "move" };

export type BrushSelectionProps = {
  /** Style object for the Brush selection rect. */
  selectedBoxStyle: React.SVGProps<SVGRectElement>;
  // /** x-coordinate scale. */
  // xScale: Scale;
  // /** y-coordinate scale. */
  // yScale: Scale;
  /** Brush stage height. */
  height: number;
  /** Brush stage width. */
  width: number;
  // /** Callback invoked on a change in Brush bounds. */
  // onChange?: (bounds: Bounds | null) => void;
  // /** Callback invoked on initialization of a Brush (not Brush move). */
  // onBrushStart?: BaseBrushProps["onBrushStart"];
  // /** Callback invoked on mouse up when a Brush size is being updated. */
  // onBrushEnd?: (bounds: Bounds | null) => void;
  /** Callback invoked on mouse move in Brush stage when *not* dragging. */
  onMouseMove?: BaseBrushProps["onMouseMove"];
  /** Callback invoked on mouse leave from Brush stage when *not* dragging. */
  onMouseLeave?: BaseBrushProps["onMouseLeave"];
  /** Callback invoked on mouse leave from Brush stage when *not* dragging. */
  onMouseUp?: BaseBrushProps["onMouseUp"];
  /** Callback invoked on Brush stage click. */
  onClick?: BaseBrushProps["onClick"];
  // /** Margin subtracted from Brush stage dimensions. */
  // margin?: MarginShape;
  // /** Allowed directions for Brush dimensional change. */
  // brushDirection?: "vertical" | "horizontal" | "both";
  // /** Initial start and end position of the Brush. */
  // initialBrushPosition?: PartialBrushStartEnd;
  // /** Array of rect sides and corners which should be resizeable / can trigger a Brush size change. */
  // resizeTriggerAreas?: ResizeTriggerAreas[];
  // /** What is being brushed, used for margin subtraction. */
  // brushRegion?: "xAxis" | "yAxis" | "chart";
  // /** Orientation of yAxis if `brushRegion=yAxis`. */
  // yAxisOrientation?: "left" | "right";
  // /** Orientation of xAxis if `brushRegion=xAxis`. */
  // xAxisOrientation?: "top" | "bottom";
  // /** Whether movement of Brush should be disabled. */
  // disableDraggingSelection: boolean;
  // /** Whether to reset the Brush on drag end. */
  // resetOnEnd?: boolean;
  // /** Size of Brush handles, applies to all `resizeTriggerAreas`. */
  // handleSize: number;
  updateBrush: (update: UpdateBrush) => void;
  onBrushEnd?: (brush: BrushState) => void;
  stageWidth: number;
  stageHeight: number;
  /** Whether movement of Brush should be disabled. */
  disableDraggingSelection: boolean;
  brush: BrushState;
};

export default class BrushSelection extends Component<BrushSelectionProps> {
  static defaultProps = {
    onMouseLeave: null,
    onMouseUp: null,
    onMouseMove: null,
    onClick: null,
  };

  selectionDragMove = (drag) => {
    const { updateBrush } = this.props;
    updateBrush((prevBrush) => {
      const { x: x0, y: y0 } = prevBrush.start;
      const { x: x1, y: y1 } = prevBrush.end;
      const validDx =
        drag.dx > 0
          ? Math.min(drag.dx, prevBrush.bounds.x1 - x1)
          : Math.max(drag.dx, prevBrush.bounds.x0 - x0);

      const validDy =
        drag.dy > 0
          ? Math.min(drag.dy, prevBrush.bounds.y1 - y1)
          : Math.max(drag.dy, prevBrush.bounds.y0 - y0);

      return {
        ...prevBrush,
        isBrushing: true,
        extent: {
          ...prevBrush.extent,
          x0: x0 + validDx,
          x1: x1 + validDx,
          y0: y0 + validDy,
          y1: y1 + validDy,
        },
      };
    });
  };

  selectionDragEnd = () => {
    const { updateBrush, onBrushEnd } = this.props;
    updateBrush((prevBrush) => {
      const nextBrush = {
        ...prevBrush,
        isBrushing: false,
        start: {
          ...prevBrush.start,
          x: Math.min(prevBrush.extent.x0, prevBrush.extent.x1),
          y: Math.min(prevBrush.extent.y0, prevBrush.extent.y1),
        },
        end: {
          ...prevBrush.end,
          x: Math.max(prevBrush.extent.x0, prevBrush.extent.x1),
          y: Math.max(prevBrush.extent.y0, prevBrush.extent.y1),
        },
      };
      if (onBrushEnd) {
        onBrushEnd(nextBrush);
      }

      return nextBrush;
    });
  };

  render() {
    const {
      width,
      height,
      stageWidth,
      stageHeight,
      brush,
      disableDraggingSelection,
      onMouseLeave,
      onMouseMove,
      onMouseUp,
      onClick,
      selectedBoxStyle,
    } = this.props;

    return (
      <Drag
        width={width}
        height={height}
        resetOnStart
        onDragMove={this.selectionDragMove}
        onDragEnd={this.selectionDragEnd}
      >
        {({ isDragging, dragStart, dragEnd, dragMove }) => (
          <g>
            {isDragging && (
              <rect
                width={stageWidth}
                height={stageHeight}
                fill="transparent"
                onMouseUp={dragEnd}
                onMouseMove={dragMove}
                onMouseLeave={dragEnd}
                style={DRAGGING_OVERLAY_STYLES}
              />
            )}
            <rect
              x={Math.min(brush.extent.x0, brush.extent.x1)}
              y={Math.min(brush.extent.y0, brush.extent.y1)}
              width={width}
              height={height}
              className="visx-brush-selection"
              onMouseDown={disableDraggingSelection ? undefined : dragStart}
              onMouseLeave={(event) => {
                if (onMouseLeave) onMouseLeave(event);
              }}
              onMouseMove={(event) => {
                dragMove(event);
                if (onMouseMove) onMouseMove(event);
              }}
              onMouseUp={(event) => {
                dragEnd(event);
                if (onMouseUp) onMouseUp(event);
              }}
              onClick={(event) => {
                if (onClick) onClick(event);
              }}
              style={{
                pointerEvents:
                  brush.isBrushing || brush.activeHandle ? "none" : "all",
                cursor: disableDraggingSelection ? undefined : "move",
              }}
              {...selectedBoxStyle}
            />
          </g>
        )}
      </Drag>
    );
  }
}
