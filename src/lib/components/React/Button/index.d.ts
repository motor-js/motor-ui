import * as React from "react";

export interface ButtonProps {
}

declare const Button: React.FC<ButtonProps & Omit<JSX.IntrinsicElements['button'], 'color'>>;
export type ButtonType = ButtonProps & Omit<JSX.IntrinsicElements['button'], 'color'>

export default Button
