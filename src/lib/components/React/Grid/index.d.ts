import * as React from "react";

export interface GridProps {
  areas?: {name?: string,start?: number[],end?: number[]}[] | string[][];
  rows: Array<string>
  columns: Array<string>
  fill: boolean | 'horizontal' | 'vertical'
  overflow?:  "auto" | "hidden" | "scroll" | "visible" | {horizontal?: "auto" | "hidden" | "scroll" | "visible",vertical?: "auto" | "hidden" | "scroll" | "visible"} | string;
  gap?: string
  backgroundColor?: string
  justify?: 'start' | 'center' | 'end' | 'stretch'
  justifyContent?: 'start'| 'center' | 'end' | 'between' | 'around' | 'stretch'
  align?: 'start' | 'center' | 'end' | 'stretch'
  alignContent?: 'start'| 'center'| 'end'| 'between'| 'around'| 'stretch'
}

declare const Grid: React.FC<GridProps>;

export type GridType = GridProps

export default Grid