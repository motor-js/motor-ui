import { deepMerge } from './utils/object'
import base from './themes/base'

export const defaultProps = {
  theme: base,
}

export const extendDefaultTheme = theme => {
  defaultProps.theme = deepMerge(base, theme)
}
