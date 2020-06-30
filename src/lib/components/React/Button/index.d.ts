import * as React from "react";
import {
  configType,
  sizeType
} from '../../../utils'

export interface ButtonProps {
  config: configType,
  type: 'clearSelections' | 'back' | 'forward' | 'default';
  block: boolean,
  onClick: () => void,
  size: sizeType,
  color: string,
  margin: string,
  width: string,
  fontColor: string,
  borderRadius: string,
  border: string,
  outline: string,
  activeTransform: string,
  activeBackgroundColor: string,
  activeBackgroundSize: string,
  activeTransition: string,
  transition: string,
  hoverBoxShadow: string,
  hoverBorder: string,
  hoverBackground: string
}

declare const Button: React.FC<ButtonProps>;

export type ButtonType = ButtonProps

export default Button
