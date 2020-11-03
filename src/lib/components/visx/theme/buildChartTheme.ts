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

  // hover?: CSSProperties;
  // selection?: CSSProperties;
  // nonSelection?: CSSProperties;
  // noSelections?: CSSProperties;
  // scatter?: CSSProperties;
  // valueLabelStyles?: CSSProperties;
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
          axisLabel: {
            fontFamily:
              "-apple-system,BlinkMacSystemFont,Roboto,Helvetica Neue,sans-serif",
            fontWeight: 700,
            fontSize: 12,
            textAnchor: "middle",
            pointerEvents: "none",
            letterSpacing: 0.4,
            fill: "#495057",
            stroke: "none",
            ...config.labelStyles,
            dy: "-0.25em", // needs to include font-size
          },
          axisLine: {
            stroke: config.gridColor,
            strokeWidth: 1,
            ...config.xAxisLineStyles,
          },
          tickLabel: {
            fontFamily:
              "-apple-system,BlinkMacSystemFont,Roboto,Helvetica Neue,sans-serif",
            // fontWeight: 700,
            // fontSize: 12,
            textAnchor: "middle",
            pointerEvents: "none",
            letterSpacing: 0.4,
            fontWeight: 200,
            fontSize: 11,
            fill: "#495057",
            stroke: "none",
            ...config.tickLabelStyles,
            dy: "-0.25em", // needs to include font-size
          },
          tickLength: config.tickLength,
          tickLine: {
            strokeWidth: 1,
            stroke: config.gridColor,
            ...config.xTickLineStyles,
          },
        },
        bottom: {
          axisLabel: {
            fontFamily:
              "-apple-system,BlinkMacSystemFont,Roboto,Helvetica Neue,sans-serif",
            fontWeight: 700,
            fontSize: 12,
            textAnchor: "middle",
            pointerEvents: "none",
            letterSpacing: 0.4,
            fill: "#495057",
            stroke: "none",
            ...config.labelStyles,
            dy: "-0.25em",
          },
          axisLine: {
            stroke: config.gridColor,
            strokeWidth: 1,
            ...config.xAxisLineStyles,
          },
          tickLabel: {
            fontFamily:
              "-apple-system,BlinkMacSystemFont,Roboto,Helvetica Neue,sans-serif",
            // fontWeight: 700,
            // fontSize: 12,
            textAnchor: "middle",
            pointerEvents: "none",
            letterSpacing: 0.4,
            fontWeight: 200,
            fontSize: 11,
            fill: "#495057",
            stroke: "none",
            ...config.tickLabelStyles,
            dy: "0.125em",
          },
          tickLength: config.tickLength,
          tickLine: {
            strokeWidth: 1,
            stroke: config.gridColor,
            ...config.xTickLineStyles,
          },
        },
      },
      y: {
        left: {
          axisLabel: {
            fontFamily:
              "-apple-system,BlinkMacSystemFont,Roboto,Helvetica Neue,sans-serif",
            fontWeight: 700,
            fontSize: 12,
            textAnchor: "middle",
            pointerEvents: "none",
            letterSpacing: 0.4,
            fill: "#495057",
            stroke: "none",
            ...config.labelStyles,
            dx: "-1.25em",
          },
          axisLine: {
            stroke: config.gridColor,
            strokeWidth: 1,
            ...config.yAxisLineStyles,
          },
          tickLabel: {
            fontFamily:
              "-apple-system,BlinkMacSystemFont,Roboto,Helvetica Neue,sans-serif",
            // fontWeight: 700,
            // fontSize: 12,
            // textAnchor: "middle",
            pointerEvents: "none",
            letterSpacing: 0.4,
            fontWeight: 200,
            fontSize: 11,
            fill: "#495057",
            stroke: "none",
            ...config.tickLabelStyles,
            textAnchor: "end",
            dx: "-0.25em",
            dy: "0.25em",
          },
          tickLength: config.tickLength,
          tickLine: {
            strokeWidth: 1,
            stroke: config.gridColor,
            ...config.yTickLineStyles,
          },
        },
        right: {
          axisLabel: {
            fontFamily:
              "-apple-system,BlinkMacSystemFont,Roboto,Helvetica Neue,sans-serif",
            fontWeight: 700,
            fontSize: 12,
            textAnchor: "middle",
            pointerEvents: "none",
            letterSpacing: 0.4,
            fill: "#495057",
            stroke: "none",
            ...config.labelStyles,
            dx: "1.25em",
          },
          axisLine: {
            stroke: config.gridColor,
            strokeWidth: 1,
            ...config.yAxisLineStyles,
          },
          tickLabel: {
            fontFamily:
              "-apple-system,BlinkMacSystemFont,Roboto,Helvetica Neue,sans-serif",
            // fontWeight: 700,
            // fontSize: 12,
            // textAnchor: "middle",
            pointerEvents: "none",
            letterSpacing: 0.4,
            fontWeight: 200,
            fontSize: 11,
            fill: "#495057",
            stroke: "none",
            ...config.tickLabelStyles,
            textAnchor: "start",
            dx: "0.25em",
            dy: "0.25em",
          },
          tickLength: config.tickLength,
          tickLine: {
            strokeWidth: 1,
            stroke: config.gridColor,
            ...config.yTickLineStyles,
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
