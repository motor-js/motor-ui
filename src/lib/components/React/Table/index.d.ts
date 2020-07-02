import * as React from "react";
import {
  configType,
  sizeType,
  calcCondType,
} from '../../../utils'

export interface TableProps {
  config: configType
  columns: Array<string>
  columnOrder: Array<number>
  calcCondition: calcCondType
  columnSortOrder:Array<string>
  grandTotalsFlag: boolean
  margin: string
  height: string
  wrapperWidth: string
  tableWidth: string
  size: sizeType
  pageHeight: number
  tableLayout: 'fixed'| 'auto'
  headerAlignment: 'left' | 'middle'| 'right'
  headerBackgroundColor: string
  headerFontColor: string
  interactiveSort: boolean
  grid: boolean
  bandedRows: boolean
  highlightOnSelection: boolean
  allowSelections: boolean
}

declare const Table: React.FC<TableProps>;

export type TableType = TableProps

export default Table
