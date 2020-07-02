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
  chartColorType,
  showLegendType,
  otherTotalSpecType,
} from '../../../utils'

export interface LineProps {
  config?: configType
  cols?: Array<string>
  calcCondition?: calcCondType
  suppressZero?: boolean
  dualAxis?: boolean
  columnSortOrder?: Array<string>
  sortDirection?: string
  width?: string
  height?: string
  margin?: string
  size?: sizeType
  showLabels?: showLabelsType
  textOnAxis?: textOnAxisType
  tickSpacing?: tickSpacingType
  showGridlines?: showGridlinesType
  fontColor?: string,
  border?: borderType
  backgroundColor?: string
  chartColor?: chartColorType
  curve?: 'Linear' | 'Basis' | 'Bundle' | 'Cardinal' | 'CatmullRom' | 'MonotoneX' | 'MonotoneY' | 
  'Natural' | 'Step' | 'StepAfter' | 'StepBefore' | 'BasisClosed'
  symbol?: 'circle' | 'cross' | 'diamond' | 'square' | 'star' | 'triangle' | 'wye' | 'none'
  roundNum?: boolean
  title?: string
  subTitle?: string
  showLegend?: showLegendType
  allowSelections?: boolean
  showAxis?: showAxisType
  maxAxisLength?: number
  areaChart?: boolean
  stacked?: boolean
  suppressScroll?: boolean
  dimensionErrMsg?: string
  measureErrMsg?: string
  otherTotalSpec?: otherTotalSpecType
}

declare const Line: React.FC<LineProps>;

export type LineType = LineProps

export default Line
