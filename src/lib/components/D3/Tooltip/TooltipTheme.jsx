import { selectColor } from '../../../utils/colors'

function TooltipTheme(theme, size) {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { global, tooltip } = theme

  // global settings (cannot be overridden by filter)
  const { fontFamily } = global

  const {
    position,
    display,
    minWidth,
    height,
    backgroundColor,
    border,
    padding,
    textAlign,
    opacity,
    pointerEvents,
    boxShadow,
    borderRadius,
    color,
  } = tooltip

  const ttColor = selectColor(color, theme)

  const TooltipWrapper = {
    'font-size': global.size.tooltip[size],
    'font-family': fontFamily,
    color: ttColor,
    position,
    display,
    'min-width': minWidth,
    height,
    'background-color': backgroundColor,
    border,
    padding,
    'text-align': textAlign,
    opacity,
    'pointer-events': pointerEvents,
    '-moz-box-shadow': boxShadow,
    '-webkit-box-shadow': boxShadow,
    'box-shadow': boxShadow,
    '-moz-border-radius': borderRadius,
    'border-radius': borderRadius,
  }

  const TooltipShowStyle = {
    display: 'inline-block',
  }

  const TooltipHideStyle = {
    display: 'none',
  }

  const ToolTipThemes = {
    TooltipWrapper,
    TooltipShowStyle,
    TooltipHideStyle,
  }

  return { ToolTipThemes }
}

export default TooltipTheme
