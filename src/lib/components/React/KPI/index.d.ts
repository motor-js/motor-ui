import * as React from "react";

import {
  configType,
  sizeType,
  calcCondType,
  borderType,
} from '../../../utils'

export interface KPIProps {
  config?: configType
  calcCondition?: calcCondType
  label?: string
  cols: Array<string>
  margin?: string
  width?: string
  border?: borderType
  justifyContent?: 'flex-start' | 'center' | 'flex-end'
  textAlign?:'left' | 'center' | 'right'
  size?: sizeType
  roundNum?: boolean
  color?: string
  precision?: boolean
  labelColor?: string
  alignSelf?: 'flex-start' | 'center' | 'flex-end'
  padding?: string
  backgroundColor?: string
  maxWidth?: string
  responsive?: boolean
  onClick?: () => {}
  cursor?: string
  autoSizeValue?: boolean
}

declare const KPI: React.FC<KPIProps>;

export type KPIType = KPIProps

export default KPI