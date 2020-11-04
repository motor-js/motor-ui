import React, { CSSProperties } from "react";
import { TextProps } from "@visx/text/lib/Text";

export type HTMLTextStyles = React.HTMLAttributes<HTMLDivElement>["style"];

export type LineStyles = Omit<React.SVGAttributes<SVGLineElement>, "Key">;

export type GridStyles = CSSProperties;

export type HoverStyles = CSSProperties;

export type SelectionStyles = CSSProperties;

export type NonSelectionStyles = CSSProperties;

export type NoSelectionStyles = CSSProperties;

export type ScatterStyles = any;

export type BarStyles = any;

export type StackedAreaStyles = any;

export type ValueLabelStyles = any;

export type PointsStyles = any;

export type SVGTextProps = TextProps;

interface AxisStyle {
  /** Axis label styles. */
  axisLabel: SVGTextProps;
  /** Axis line styles. */
  axisLine: LineStyles;
  /** Tick label styles. */
  tickLabel: SVGTextProps;
  /** Tick line styles. */
  tickLine: LineStyles;
  /** Length of axis tick lines. */
  tickLength: number;
}

/** A complete chart theme includes style definitions for all axis orientations. */
export interface XYChartTheme {
  /** Base background color. */
  backgroundColor: string;
  /** Ordinal colors to be used for default coloring by series `key`s. */
  colors: string[];
  /** Styles to applied to HMTL labels. */
  tooltiplLabelStyles: HTMLTextStyles;
  /** Styles to be applied to chart grids. */
  // gridStyles: GridStyles;
  /** Styles to be applied to chart grids. */
  gridStyles: {
    columns: CSSProperties;
    rows: CSSProperties;
  };
  /** Styles to be applied to axes (axis labels, ticks, tick labels). */
  axisStyles: {
    x: {
      top: AxisStyle;
      bottom: AxisStyle;
    };
    y: {
      left: AxisStyle;
      right: AxisStyle;
    };
  };
  hover: HoverStyles;
  selection: SelectionStyles;
  nonSelection: NonSelectionStyles;
  noSelections: NoSelectionStyles;
  scatter: ScatterStyles;
  bar: BarStyles;
  stackedArea: StackedAreaStyles;
  valueLabelStyles: ValueLabelStyles;
  points: PointsStyles;
}
