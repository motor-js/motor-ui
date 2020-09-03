import * as React from "react";
import {
  configType,
  sizeType,
  calcCondType,
  borderType,
  colorThemeType,
  showLegendType,
  otherTotalSpecType,
} from "../../../utils";

export interface PieProps {
  config?: configType;
  cols: Array<string>;
  calcCondition?: calcCondType;
  suppressZero?: boolean;
  width?: string;
  height?: string;
  margin?: string;
  size?: sizeType;
  allowSelections?: boolean;
  fontColor?: string;
  border?: borderType;
  backgroundColor?: string;
  colorTheme?: colorThemeType;
  showLegend?: showLegendType;
  roundNum?: boolean;
  title?: string;
  subTitle?: string;
  innerRadius?: number;
  cornerRadius?: number;
  padAngle?: number;
  showLabels: boolean;
  dimensionErrMsg?: string;
  measureErrMsg?: string;
  otherTotalSpec?: otherTotalSpecType;
}

declare const Pie: React.FC<PieProps>;

export type PieType = PieProps;

export default Pie;
