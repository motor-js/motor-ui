import * as React from "react";

export interface SpinnerProps {
  type: 
    'Audio' |
    'BallTriangle' |
    'Bars' |
    'Circles' |
    'Grid' |
    'Hearts' |
    'Oval' |
    'Puff' |
    'Rings' |
    'TailSpin' |
    'ThreeDots',
  size: number,
  color: string,
  timeout: number,
}

declare const Spinner: React.FC<SpinnerProps>;

export type SpinnerType = SpinnerProps

export default Spinner
