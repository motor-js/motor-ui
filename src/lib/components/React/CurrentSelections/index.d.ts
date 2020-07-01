import * as React from "react";
import {
  configType,
  sizeType
} from '../../../utils'

export interface CurrentSelectionsProps {
  config?: configType
  size?: sizeType
  width?: string
  margin?: string
  maxHeight?: string
  minHeight?: string
  selectionsLimit?: 1 | 2 | 3 | 4 | 5
  overflow?: 'x-axis' | 'y-axis'
}

declare const CurrentSelections: React.FC<CurrentSelectionsProps>;

export type CurrentSelectionsType = CurrentSelectionsProps

export default CurrentSelections
