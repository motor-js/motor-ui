import * as React from "react";
import {
  configType,
  sizeType
} from '../../../utils'

export interface SmartHeadingProps {
  children: React.ReactNode,
  config: configType,
  size: sizeType,
  type: 'free' | 'lastReload' | 'appName',
  level: '1 | 2 | 3 | 4 | 5 | 6', 
  margin: string,
}

declare const SmartHeading: React.FC<SmartHeadingProps>;

export type SmartHeadingType = SmartHeadingProps

export default SmartHeading
