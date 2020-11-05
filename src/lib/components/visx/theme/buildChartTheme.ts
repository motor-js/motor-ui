import { CSSProperties } from "react";
import {
  SVGTextProps,
  HTMLTextStyles,
  LineStyles,
  XYChartTheme,
} from "../types/theme";

export type ThemeConfig = {
  backgroundColor: string;

  // categorical colors, mapped to series `key`s
  colors: string[];

  // labels
  labelStyles?: SVGTextProps;
  tickLabelStyles?: SVGTextProps;
  tooltiplLabelStyles?: HTMLTextStyles;

  // lines
  xAxisLineStyles?: LineStyles;
  yAxisLineStyles?: LineStyles;
  xTickLineStyles?: LineStyles;
  yTickLineStyles?: LineStyles;
  tickLength: number;

  // grid
  gridColor: string;
  // gridColorDark: string;
  // gridStyles?: CSSProperties;

  gridStyles: {
    // columns?: {stroke: CSSProperties};
    columns?: CSSProperties;
    rows?: CSSProperties;
  };

  border?: CSSProperties;
  wrapper?: CSSProperties;
  error?: CSSProperties;
  title?: CSSProperties;

  points?: CSSProperties;
  chart?: CSSProperties;
  stackedArea?: CSSProperties;
  bar?: CSSProperties;
  scatter?: CSSProperties;
};

/** Provides a simplified API to build a full XYChartTheme. */
export default function buildChartTheme(config: any): XYChartTheme {
  return {
    ...config.chart,
    backgroundColor: config.backgroundColor,
    colors: [...config.colors],
    tooltiplLabelStyles: {
      color: config.labelStyles?.fill ?? "#495057",
      ...config.tooltiplLabelStyles,
      fontSize: config.tooltiplLabelStyles.fontSize[config.size],
    },
    gridStyles: {
      ...config.gridStyles,
    },
    axisStyles: {
      x: {
        top: {
          // ...config.xAxisStyles.top, //remove
          axisLabel: {
            fill: config.labelStyles?.fill ?? "#495057",
            ...config.xAxisStyles.top.axisLabel,
          },
          axisLine: {
            stroke: config.gridColor.stroke,
            ...config.xAxisStyles.top.axisLine,
          },
          tickLength: config.xAxisStyles.top.tickLength,
          tickLine: {
            stroke: config.gridColor.stroke,
            ...config.xAxisStyles.top.tickLine,
          },
          tickLabel: {
            fill: config.tickLabelStyles.fill,
            ...config.xAxisStyles.top.tickLabel,
          },
        },
        bottom: {
          // ...config.xAxisStyles.bottom,
          axisLabel: {
            fill: config.labelStyles?.fill ?? "#495057",
            ...config.xAxisStyles.bottom.axisLabel,
          },
          axisLine: {
            stroke: config.gridColor.stroke,
            ...config.xAxisStyles.bottom.axisLine,
          },
          tickLength: config.xAxisStyles.bottom.tickLength,
          tickLine: {
            stroke: config.gridColor.stroke,
            ...config.xAxisStyles.bottom.tickLine,
          },
          tickLabel: {
            fill: config.tickLabelStyles.fill,
            ...config.xAxisStyles.bottom.tickLabel,
          },
        },
      },
      y: {
        left: {
          // ...config.yAxisStyles.left,
          axisLabel: {
            fill: config.labelStyles?.fill ?? "#495057",
            ...config.yAxisStyles.left.axisLabel,
          },
          axisLine: {
            stroke: config.gridColor.stroke,
            ...config.yAxisStyles.left.axisLine,
          },
          tickLength: config.yAxisStyles.left.tickLength,
          tickLine: {
            stroke: config.gridColor.stroke,
            ...config.yAxisStyles.left.tickLine,
          },
          tickLabel: {
            fill: config.tickLabelStyles.fill,
            ...config.yAxisStyles.left.tickLabel,
          },
        },
        right: {
          // ...config.yAxisStyles.right,
          axisLabel: {
            fill: config.labelStyles?.fill ?? "#495057",
            ...config.yAxisStyles.right.axisLabel,
          },
          axisLine: {
            stroke: config.gridColor.stroke,
            ...config.yAxisStyles.right.axisLine,
          },
          tickLength: config.yAxisStyles.right.tickLength,
          tickLine: {
            stroke: config.gridColor.stroke,
            ...config.yAxisStyles.right.tickLine,
          },
          tickLabel: {
            fill: config.tickLabelStyles.fill,
            ...config.yAxisStyles.right.tickLabel,
          },
        },
      },
    },

    scatter: config.scatter,
    bar: config.bar,
    points: config.points,
    stackedArea: config.stackedArea,
  };
}
