import * as React from "react";
import {
  configType
} from '../../../utils'

export interface useEngineProps {
  config: configType
}

declare const useEngine: React.FC<useEngineProps>;

export type useEngineType = useEngineProps

export default useEngine
