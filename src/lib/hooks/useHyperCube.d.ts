import * as React from "react";
import {
calcCondType,
otherTotalSpecType,
} from '../../../utils'

export interface useHyperCubeProps {
  engine: object
  cols: Array<string>
  qColumnOrder: Array<number>
  qCalcCondition: calcCondType
  qPage: object
  qInterColumnSortOrder: Array<number>
  qSupressMissing: boolean
  qSuppressZero: boolean
  qSortByNumeric: number
  qSortByAscii: number
  qInterLineSortOrder: Array<number>
  qOtherTotalSpec: otherTotalSpecType 
}

declare const useHyperCube: React.FC<useHyperCubeProps>;

export type useHyperCubeType = useHyperCubeProps

export default useHyperCube
