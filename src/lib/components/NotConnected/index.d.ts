import * as React from "react";
import {
  configType,
  sizeType
} from '../../../utils'

export interface LoginProps {
  config?: configType
  header: React.ReactNode
  body: React.ReactNode
  size: sizeType
  buttonText: string
  backgroundColor: string
  buttonFontColor: string
  buttonColor: string
}

declare const Login: React.FC<LoginProps>;

export type LoginType = LoginProps

export default Login
