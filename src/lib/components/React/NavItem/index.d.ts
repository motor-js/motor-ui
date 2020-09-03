import * as React from "react";
import {
  sizeType,
  borderType
} from '../../../utils'

export interface NavItemProps {
  children?: React.ReactNode
  size?: sizeType
  responsive?: boolean
  color?: object
  background?: object
  textAlign?: string
  /** Border of the Pie Chart, need desc */
  border?: borderType 
}

declare const NavItem: React.FC<NavItemProps>;

export type NavItemType = NavItemProps

export default NavItem
