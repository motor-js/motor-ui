import * as React from "react";
import {
  configType,
  sizeType,
  calcCondType,
  showLabelsType,
  textOnAxisType,
  tickSpacingType,
  showAxisType,
  showGridlinesType,
  borderType,
  colorThemeType,
  showLegendType,
  otherTotalSpecType,
} from "../../../utils";

export interface ColumnProps {
  config?: configType;
  label?: string;
  cols: Array<string>;
  calcCondition?: calcCondType;
  suppressZero?: boolean;
  columnSortOrder?: Array<string>;
  sortDirection?: string;
  theme?: string;
  width?: string;
  height?: string;
  margin?: string;
  size?: sizeType;
  showLabels?: showLabelsType;
  textOnAxis?: textOnAxisType;
  tickSpacing?: tickSpacingType;
  showGridlines?: showGridlinesType;
  fontColor?: string;
  border?: borderType;
  backgroundColor?: string;
  colorTheme?: colorThemeType;
  stacked?: boolean;
  percentStacked?: boolean;
  roundNum?: boolean;
  title?: string;
  subTitle?: string;
  showLegend?: showLegendType;
  allowSelections?: boolean;
  maxWidth?: number;
  showAxis?: showAxisType;
  maxAxisLength?: number;
  suppressScroll?: boolean;
  columnPadding?: number;
  dimensionErrMsg?: string;
  measureErrMsg?: string;
  otherTotalSpec?: otherTotalSpecType;
}

declare const Column: React.FC<ColumnProps>;

export type ColumnType = ColumnProps;

export default Column;
