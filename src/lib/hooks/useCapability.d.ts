import * as React from "react";
import {
  configType
} from '../../../utils'

export interface useCapabilityProps {
  config: configType
}

declare const useCapability: React.FC<useCapabilityProps>;

export type useCapabilityType = useCapabilityProps

export default useCapability
