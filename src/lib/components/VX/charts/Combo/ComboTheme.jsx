import styled from "styled-components";
import { defaultProps } from "../../../default-props";
import { globalStyle, borderStyle } from "../../../utils/styles";
import { createColorArray } from "../../../utils/colors";
import { selectColor } from "../../../utils/colors";
import { componentWidth } from "../../../utils";

const BarWrapper = styled.div`
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

const BarWrapperNoData = styled.div`
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

const BarNoDataContent = styled.div`
  ${globalStyle};
  display: ${(props) => props.theme.global.chart.noDataContent.display};
  margin: ${(props) => props.theme.global.chart.noDataContent.margin};
  align-items: ${(props) => props.theme.global.chart.noDataContent.alignItems};
  justify-content: ${(props) =>
    props.theme.global.chart.noDataContent.justifyContent};
  height: ${(props) => props.height};
`;

BarWrapper.defaultProps = {};
Object.setPrototypeOf(BarWrapper.defaultProps, defaultProps);

BarWrapperNoData.defaultProps = {};
Object.setPrototypeOf(BarWrapperNoData.defaultProps, defaultProps);

BarNoDataContent.defaultProps = {};
Object.setPrototypeOf(BarNoDataContent.defaultProps, defaultProps);

export { BarWrapper, BarWrapperNoData, BarNoDataContent };

function BarTheme(theme, size, fontColor, colorArray) {
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

  const BarDefault = {
    allowSelections: chart.allowSelections,
    allowSlantedYAxis: chart.allowSlantedYAxis,
    suppressZero: chart.suppressZero,
    suppressScroll: chart.suppressScroll,
    allowZoom: chart.allowZoom,
    tickSpacing: chart.tickSpacing,
    showLabels: chart.showLabels,
    showLegend: chart.showLegend,
    otherTotalSpec: main.otherTotalSpec,
    zoomScrollOnBarHeight: main.zoomScrollOnBarHeight,
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

  const BarOverviewBar = {
    opacity: overview.opacity,
    stroke: overview.stroke,
    "stroke-width": overview.strokeWidth,
  };

  const BarChartStyle = {
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

  const BarLabelStyle = {
    "font-size": fontSize.subFont[size],
    fill: fontColor || labelColor,
  };

  const BarStyle = {
    stroke: bars.stroke,
    "stroke-width": bars.strokeWidth,
  };

  const GridLineStyle = {
    show: gridlines.show,
    stroke: gridlines.stroke,
    "stroke-dasharray": gridlines.strokeDasharray,
  };

  const SelectedBar = {
    opacity: selection.opacity,
    stroke: selection.stroke,
    "stroke-width": selection.strokeWidth,
  };

  const NonSelectedBar = {
    opacity: nonSelection.opacity,
  };

  const BarThemes = {
    BarChartStyle,
    BarDefault,
    yAxisStyle,
    xAxisStyle,
    axisTitleStyle,
    BarLabelStyle,
    BarStyle,
    GridLineStyle,
    BarOverviewBar,
    colorPalette,
    SelectedBar,
    NonSelectedBar,
  };

  return {
    BarThemes,
  };
}

export default BarTheme;
