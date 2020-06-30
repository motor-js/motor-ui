import * as React from "react";
import {
  configType,
} from '../../../utils'

export interface MotorProps {
  config: configType,
  children: React.ReactNode
}

declare const Motor: React.FC<MotorProps>;

export type MotorType = MotorProps

export default Motor
