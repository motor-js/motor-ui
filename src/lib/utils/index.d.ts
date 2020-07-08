// Extracting types for common properties among components
type boxSizeType = "xsmall" | "small" | "medium" | "large" | "xlarge" | string;
type boxSideType =
  | "top"
  | "left"
  | "bottom"
  | "right"
  | "start"
  | "end"
  | "horizontal"
  | "vertical"
  | "all"
  | "between";
type boxStyleType =
  | "solid"
  | "dashed"
  | "dotted"
  | "double"
  | "groove"
  | "ridge"
  | "inset"
  | "outset"
  | "hidden";
type colorType = string | undefined;

export type sizeType = "tiny" | "small" | "medium" | "large" | "xlarge";
export type configType = {
  host: string;
  secure: boolean;
  port: number;
  prefix: string;
  appId: string;
};
export type calcCondType = { qCond: string; qMsg: string };
export type showLabelsType = "top" | "none" | "inside";
export type textOnAxisType = boolean | "both" | "yAxis" | "xAxis" | "none";
export type tickSpacingType = "wide" | "normal" | "narrow";
export type showAxisType = boolean | "both" | "yAxis" | "xAxis" | "none";
export type showGridlinesType = boolean | "solid" | "dashes" | "dots" | "none";
export type borderType =
  | boolean
  | boxSideType
  | {
      color?: colorType;
      side?: boxSideType;
      size?: boxSizeType;
      style?: boxStyleType;
    }
  | {
      color?: colorType;
      side?: boxSideType;
      size?: boxSizeType;
      style?: boxStyleType;
    }[];
export type chartColorType =
  | Array<string>
  | "divergent13"
  | "divergent9"
  | "goya"
  | "red"
  | "blue"
  | "gray"
  | "pink"
  | "grape"
  | "violet"
  | "indigo"
  | "blue"
  | "cyan"
  | "teal"
  | "green"
  | "lime"
  | "yellow"
  | "orange"
  | "base";
export type showLegendType = boolean | "right" | "bottom";
export type otherTotalSpecType =
  | boolean
  | { qOtherLabel: string; qOtherCount: string };
