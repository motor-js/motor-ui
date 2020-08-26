import styled from "styled-components";
import { defaultProps } from "../../../../default-props";
import { globalStyle, borderStyle } from "../../../../utils/styles";
import { createColorArray } from "../../../../utils/colors";
import { selectColor } from "../../../../utils/colors";
import { componentWidth } from "../../../../utils";

const ComboWrapper = styled.div`
  ${globalStyle};
  ${(props) =>
    props.border &&
    props.border !== "none" &&
    (Array.isArray(props.border, props.theme)
      ? props.border.map((border) => borderStyle(border, props.theme, "chart"))
      : borderStyle(props.border, props.theme, "chart"))};
  border-radius: ${(props) =>
    props.borderRadius || props.theme.global.chart.borderRadius};
  background-color: ${(props) =>
    props.backgroundColor || props.theme.global.chart.backgroundColor};
  margin: ${(props) => props.margin};
  userselect: ${(props) => props.theme.global.chart.userSelect};
  width: ${(props) => componentWidth(props)};
  // width: ${(props) => props.width};
  display: ${(props) => props.theme.global.chart.display};
  box-sizing: ${(props) => props.theme.global.chart.boxSizing};
`;

const ComboWrapperNoData = styled.div`
  ${globalStyle};
  ${(props) =>
    props.border &&
    (Array.isArray(props.border, props.theme)
      ? props.border.map((border) => borderStyle(border, props.theme, "chart"))
      : borderStyle(props.border, props.theme, "chart"))};
  vertical-align: ${(props) => props.theme.global.chart.noData.verticalAlign};
  display: ${(props) => props.theme.global.chart.noData.display};
  border-radius: ${(props) =>
    props.borderRadius || props.theme.global.chart.noData.borderRadius};
  background-color: ${(props) =>
    props.theme.global.chart.noData.backgroundColor};
  border-collapse: ${(props) => props.theme.global.chart.noData.borderCollapse};
  height: ${(props) => props.height};
  width: ${(props) => componentWidth(props)};
  // width: ${(props) => props.width};
  box-sizing: ${(props) => props.theme.global.chart.boxSizing};
  margin: ${(props) => props.margin};
`;

const ComboNoDataContent = styled.div`
  ${globalStyle};
  display: ${(props) => props.theme.global.chart.noDataContent.display};
  margin: ${(props) => props.theme.global.chart.noDataContent.margin};
  align-items: ${(props) => props.theme.global.chart.noDataContent.alignItems};
  justify-content: ${(props) =>
    props.theme.global.chart.noDataContent.justifyContent};
  height: ${(props) => props.height};
`;

ComboWrapper.defaultProps = {};
Object.setPrototypeOf(ComboWrapper.defaultProps, defaultProps);

ComboWrapperNoData.defaultProps = {};
Object.setPrototypeOf(ComboWrapperNoData.defaultProps, defaultProps);

ComboNoDataContent.defaultProps = {};
Object.setPrototypeOf(ComboNoDataContent.defaultProps, defaultProps);

export { ComboWrapper, ComboWrapperNoData, ComboNoDataContent };

function ComboTheme(theme, size, fontColor, colorArray) {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const {
    global: {
      fontFamily,
      chart,
      size: fontSize,
      colorTheme,
      chart: { gridlines, selection, nonSelection },
    },
    bar: { main, overview, bars },
    xAxis,
    yAxis,
    axisTitle,
  } = theme;

  // if the prop is undefined, use the base theme
  const color = colorArray || colorTheme;
  const colorPalette = createColorArray(color, theme);

  const xAxisColor = selectColor(xAxis.color, theme);
  const yAxisColor = selectColor(yAxis.color, theme);
  const axisTitleColor = selectColor(axisTitle.color, theme);
  const labelColor = selectColor(chart.label.fontColor, theme);

  const ComboDefault = {
    allowSelections: chart.allowSelections,
    allowSlantedYAxis: chart.allowSlantedYAxis,
    suppressZero: chart.suppressZero,
    suppressScroll: chart.suppressScroll,
    allowZoom: chart.allowZoom,
    tickSpacing: chart.tickSpacing,
    showLabels: chart.showLabels,
    showLegend: chart.showLegend,
    otherTotalSpec: main.otherTotalSpec,
    zoomScrollOnComboHeight: main.zoomScrollOnComboHeight,
    barPadding: main.barPadding,
    barPaddingNarrow: main.barPaddingNarrow,
    textOnAxis: chart.textOnAxis,
    showAxis: chart.showAxis,
    showGridlines: chart.showGridlines,
    maxWidth: main.maxWidth,
    dimensionErrMsg: chart.error.dimensionErrMsg,
    measureErrMsg: chart.error.measureErrMsg,
    maxAxisLength: chart.maxAxisLength,
  };

  const ComboOverviewCombo = {
    opacity: overview.opacity,
    stroke: overview.stroke,
    "stroke-width": overview.strokeWidth,
  };

  const ComboChartStyle = {
    "font-family": fontFamily,
    "font-size": fontSize.font[size],
  };

  const yAxisStyle = {
    "font-family": fontFamily,
    "font-size": fontSize.font[size],
    "-webkit-user-select": "none",
    "-khtml-user-select": "none",
    "-moz-user-select": "none",
    "-ms-user-select": "none",
    "user-select": "none",
    color: yAxisColor,
  };

  const xAxisStyle = {
    "font-family": fontFamily,
    "font-size": fontSize.font[size],
    "user-select": "none",
    color: xAxisColor,
  };

  const axisTitleStyle = {
    "font-family": fontFamily,
    "font-size": fontSize.font[size],
    "user-select": "none",
    fill: axisTitleColor,
  };

  const ComboLabelStyle = {
    "font-size": fontSize.subFont[size],
    fill: fontColor || labelColor,
  };

  const ComboStyle = {
    stroke: bars.stroke,
    "stroke-width": bars.strokeWidth,
  };

  const GridLineStyle = {
    show: gridlines.show,
    stroke: gridlines.stroke,
    "stroke-dasharray": gridlines.strokeDasharray,
  };

  const SelectedCombo = {
    opacity: selection.opacity,
    stroke: selection.stroke,
    "stroke-width": selection.strokeWidth,
  };

  const NonSelectedCombo = {
    opacity: nonSelection.opacity,
  };

  const ComboThemes = {
    ComboChartStyle,
    ComboDefault,
    yAxisStyle,
    xAxisStyle,
    axisTitleStyle,
    ComboLabelStyle,
    ComboStyle,
    GridLineStyle,
    ComboOverviewCombo,
    colorPalette,
    SelectedCombo,
    NonSelectedCombo,
  };

  return {
    ComboThemes,
  };
}

export default ComboTheme;
