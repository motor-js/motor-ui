import styled from "styled-components";
import { defaultProps } from "../../../default-props";
import { globalStyle, borderStyle } from "../../../utils/styles";
import { createColorArray } from "../../../utils/colors";
import { selectColor } from "../../../utils/colors";
import { componentWidth } from "../../../utils";

const ScatterWrapper = styled.div`
  ${globalStyle};
  ${(props) => props.gridArea && `grid-area: ${props.gridArea};`};
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
  margin: ${(props) => props.margin || props.theme.global.chart.margin};
  userselect: ${(props) => props.theme.global.chart.userSelect};
  width: ${(props) => componentWidth(props)};
  display: ${(props) => props.theme.global.chart.display};
  box-sizing: ${(props) => props.theme.global.chart.boxSizing};
`;

const ScatterWrapperNoData = styled.div`
  ${globalStyle};
  ${(props) => props.gridArea && `grid-area: ${props.gridArea};`};
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
  box-sizing: ${(props) => props.theme.global.chart.boxSizing};
  margin: ${(props) => props.margin || props.theme.global.chart.margin};
`;

const ScatterNoDataContent = styled.div`
  ${globalStyle};
  display: ${(props) => props.theme.global.chart.noDataContent.display};
  margin: ${(props) => props.theme.global.chart.noDataContent.margin};
  align-items: ${(props) => props.theme.global.chart.noDataContent.alignItems};
  justify-content: ${(props) =>
    props.theme.global.chart.noDataContent.justifyContent};
  height: ${(props) => props.height};
`;

ScatterWrapper.defaultProps = {};
Object.setPrototypeOf(ScatterWrapper.defaultProps, defaultProps);

ScatterWrapperNoData.defaultProps = {};
Object.setPrototypeOf(ScatterWrapperNoData.defaultProps, defaultProps);

ScatterNoDataContent.defaultProps = {};
Object.setPrototypeOf(ScatterNoDataContent.defaultProps, defaultProps);

export { ScatterWrapper, ScatterWrapperNoData, ScatterNoDataContent };

function ScatterTheme(theme, size, fontColor, colorArray) {
  // eslint-disable-next-scatter react-hooks/rules-of-hooks
  const {
    global: {
      fontFamily,
      chart,
      size: fontSize,
      colorTheme,
      chart: { gridlines, selection, nonSelection },
    },
    scatter: { main, overview, scatters, markers },
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

  const ScatterDefault = {
    allowSelections: chart.allowSelections,
    tickSpacing: chart.tickSpacing,
    suppressZero: chart.suppressZero,
    suppressScroll: chart.suppressScroll,
    allowZoom: chart.allowZoom,
    showLabels: chart.showLabels,
    showLegend: chart.showLegend,
    otherTotalSpec: main.otherTotalSpec,
    showGridlines: chart.showGridlines,
    textOnAxis: chart.textOnAxis,
    showAxis: chart.showAxis,
    dimensionErrMsg: chart.error.dimensionErrMsg,
    measureErrMsg: chart.error.measureErrMsg,
  };

  const GridLineStyle = {
    show: gridlines.show,
    stroke: gridlines.stroke,
    "stroke-dasharray": gridlines.strokeDasharray,
  };

  const ScatterOverviewScatter = {
    opacity: overview.opacity,
    stroke: overview.stroke,
    "stroke-width": overview.strokeWidth,
  };

  const ScatterChartStyle = {
    "font-family": fontFamily,
    "font-size": fontSize.font[size],
  };

  const yAxisStyle = {
    "font-family": fontFamily,
    "font-size": fontSize.font[size],
    color: yAxisColor,
  };

  const xAxisStyle = {
    "font-family": fontFamily,
    "font-size": fontSize.font[size],
    color: xAxisColor,
  };

  const axisTitleStyle = {
    "font-family": fontFamily,
    "font-size": fontSize.font[size],
    fill: axisTitleColor,
  };

  const ScatterLabelStyle = {
    "font-size": fontSize.subFont[size],
    fill: fontColor || labelColor,
  };

  const ScatterStyle = {
    fill: scatters.fill,
    "stroke-width": scatters.strokeWidth,
  };

  const ScatterMarkerStyle = {
    mainMarker: markers.main.radius,
    overviewMarker: markers.overview.radius,
  };

  const SelectedScatter = {
    opacity: selection.opacity,
    stroke: selection.stroke,
    "stroke-width": selection.strokeWidth,
  };

  const NonSelectedScatter = {
    opacity: nonSelection.opacity,
  };

  const ScatterThemes = {
    ScatterChartStyle,
    ScatterDefault,
    GridLineStyle,
    yAxisStyle,
    xAxisStyle,
    axisTitleStyle,
    ScatterLabelStyle,
    ScatterStyle,
    ScatterMarkerStyle,
    ScatterOverviewScatter,
    colorPalette,
    SelectedScatter,
    NonSelectedScatter,
  };

  return {
    ScatterThemes,
  };
}

export default ScatterTheme;
