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
  console.log(config.gridColor);
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
          ...config.xAxisStyles.top,
          axisLine: {
            stroke: config.gridColor,
          },
          tickLine: {
            stroke: config.gridColor,
          },
        },
        bottom: {
          ...config.xAxisStyles.bottom,
          axisLine: {
            stroke: config.gridColor,
          },
          tickLine: {
            stroke: config.gridColor,
          },
        },
      },
      y: {
        left: {
          ...config.yAxisStyles.left,
          axisLine: {
            stroke: config.gridColor,
          },

          tickLine: {
            stroke: config.gridColor,
          },
        },
        right: {
          ...config.yAxisStyles.right,
          axisLine: {
            stroke: config.gridColor,
          },

          tickLine: {
            stroke: config.gridColor,
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
