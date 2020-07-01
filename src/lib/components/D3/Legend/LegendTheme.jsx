import { selectColor } from '../../../utils/colors';

function LegendTheme(theme, backgroundColor) {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { global, legend } = theme;

  // global settings (cannot be overridden by filter)
  const { fontFamily } = global;

  const strokeColor = selectColor(legend.stroke, theme);

  const {
    fill,
    opacity,
    borderRadius,
    legendGroup,
    legendText,
    arrowStyle,
    arrowDisabledStyle,
  } = legend;

  const LegendWrapper = {
    fill: backgroundColor || fill,
    stroke: backgroundColor || strokeColor,
  };

  const LegendTextStyle = {
    fill: legendText.fill,
  };

  const LegendGroup = {
    opacity: legendGroup.opacity,
    '-webkit-touch-callout': legendGroup.userSelect,
    '-webkit-user-select': legendGroup.userSelect,
    '-khtml-user-select': legendGroup.userSelect,
    '-moz-user-select': legendGroup.userSelect,
    '-ms-user-select': legendGroup.userSelect,
    'user-select': legendGroup.userSelect,
  };

  const ArrowStyle = {
    fill: arrowStyle.fill,
    stroke: arrowStyle.stroke,
    opacity: arrowStyle.opacity,
  };

  const ArrowDisabledStyle = {
    fill: arrowDisabledStyle.fill,
    stroke: arrowDisabledStyle.stroke,
    opacity: arrowDisabledStyle.opacity,
  };

  const LegendThemes = {
    LegendWrapper,
    LegendGroup,
    ArrowStyle,
    ArrowDisabledStyle,
    LegendTextStyle,
  };

  return {
    LegendThemes,
  };
}

export default LegendTheme;
