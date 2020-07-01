import * as React from "react";
import {
  borderType,
} from '../../../utils'

export interface BoxProps {
  height?: "xxsmall" | "xsmall" | "small" | "medium" | "large" | "xlarge" | "xxlarge" | string | {max?: "xxsmall" | "xsmall" | "small" | "medium" | "large" | "xlarge" | "xxlarge" | string,min?: "xxsmall" | "xsmall" | "small" | "medium" | "large" | "xlarge" | "xxlarge" | string};
  width?: "xxsmall" | "xsmall" | "small" | "medium" | "large" | "xlarge" | "xxlarge" | string | {max?: "xxsmall" | "xsmall" | "small" | "medium" | "large" | "xlarge" | "xxlarge" | string,min?: "xxsmall" | "xsmall" | "small" | "medium" | "large" | "xlarge" | "xxlarge" | string};
  margin?: string
  overflow?:  "auto" | "hidden" | "scroll" | "visible" | {horizontal?: "auto" | "hidden" | "scroll" | "visible",vertical?: "auto" | "hidden" | "scroll" | "visible"} | string;
  backgroundColor?: string
  border?: borderType
  padding?: string
  align?: 'start' | 'center' | 'end'| 'baseline'| 'stretch'
  alignContent?: 'start' | 'center' | 'end' | 'between' | 'around' | 'stretch'
  justify?: 'around' | 'between' | 'center' | 'end' | 'evenly' | 'start' | 'stretch' 
  justifyContent?: 'around' | 'between' | 'center' | 'end' | 'start' | 'stretch' 
  direction?: 'row' | 'column' | 'row-responsive' | 'row-reverse' | 'column-reverse'
  flex?: boolean | 'grow' | 'shrink' | { grow: number, shrink: number }
  focusable?: boolean
  basis?: string
  wrapProp?: boolean | 'reverse'
  elevation?: string,
  onClick?: () => {}
  gridArea?: string,
}

declare const Box: React.FC<BoxProps>;

export type BoxType = BoxProps

export default Box
