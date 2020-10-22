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
} from "../../utils";

export interface AreaProps {
  config?: configType;
  label?: string;
  cols?: Array<string>;
  calcCondition?: calcCondType;
  suppressZero?: boolean;
  columnSortOrder?: Array<string>;
  sortDirection?: string;
  width?: string;
  height?: string;
  margin?: string;
  size?: sizeType;
  showLabels?: showLabelsType;
  textOnAxis?: textOnAxisType;
  tickSpacing?: tickSpacingType;
  showAxis?: showAxisType;
  maxAxisLength?: number;
  allowSlantedYAxis?: boolean;
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
  suppressScroll?: boolean;
  barPadding?: number;
  dimensionErrMsg?: string;
  measureErrMsg?: string;
  otherTotalSpec?: otherTotalSpecType;
}

declare const Area: React.FC<AreaProps>;

export type AreaType = AreaProps;

export default Area;
