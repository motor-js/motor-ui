import * as React from "react";
import {
  configType,
} from '../../../utils'

export interface MotorProps {
  config: configType,
  children: React.ReactNode
  engine: Object,
  theme: Object,
}

declare const Motor: React.FC<MotorProps>;

export type MotorType = MotorProps

export default Motor
