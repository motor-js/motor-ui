import * as React from "react";
import {
  configType,
  sizeType
} from '../../../utils'

export interface FilterProps {
  config?: configType
  label: string
  dimension?: Array<string>
  size?: sizeType
  width?: string
  dropHeight?: string
  margin?: string
  onSelectionChange?: () => {}
  onSearch?: () => {}
  single?: boolean
  sortByState?: boolean
  selectionsTitle?: boolean
}

declare const Filter: React.FC<FilterProps>;

export type FilterType = FilterProps

export default Filter