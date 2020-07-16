import styled from "styled-components";
import { defaultProps } from "../../../default-props";
import { globalStyle, borderStyle } from "../../../utils/styles";
import { createColorArray } from "../../../utils/colors";
import { selectColor } from "../../../utils/colors";
import { componentWidth } from "../../../utils";

const LineWrapper = styled.div`
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
  width: ${(props) => componentWidth(props)};
  userselect: ${(props) => props.theme.global.chart.userSelect};
  display: ${(props) => props.theme.global.chart.display};
  box-sizing: ${(props) => props.theme.global.chart.boxSizing};
`;

const LineWrapperNoData = styled.div`
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
  box-sizing: ${(props) => props.theme.global.chart.boxSizing};
  margin: ${(props) => props.margin};
`;

const LineNoDataContent = styled.div`
  ${globalStyle};
  display: ${(props) => props.theme.global.chart.noDataContent.display};
  margin: ${(props) => props.theme.global.chart.noDataContent.margin};
  align-items: ${(props) => props.theme.global.chart.noDataContent.alignItems};
  justify-content: ${(props) =>
    props.theme.global.chart.noDataContent.justifyContent};
  height: ${(props) => props.height};
`;

LineWrapper.defaultProps = {};
Object.setPrototypeOf(LineWrapper.defaultProps, defaultProps);

LineWrapperNoData.defaultProps = {};
Object.setPrototypeOf(LineWrapperNoData.defaultProps, defaultProps);

LineNoDataContent.defaultProps = {};
Object.setPrototypeOf(LineNoDataContent.defaultProps, defaultProps);

export { LineWrapper, LineWrapperNoData, LineNoDataContent };

function LineTheme(theme, size, fontColor, colorArray) {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const {
    global: {
      fontFamily,
      chart,
      size: fontSize,
      colorTheme,
      chart: { gridlines, selection, nonSelection },
    },
    line: {
      main: { otherTotalSpec, dataPointsToShow, symbol, strokeWidth },
    },
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
  const nonSelectionBackground = selectColor(
    chart.nonSelection.background,
    theme
  );

  const LineDefault = {
    allowSelections: chart.allowSelections,
    tickSpacing: chart.tickSpacing,
    suppressZero: chart.suppressZero,
    suppressScroll: chart.suppressScroll,
    showLabels: chart.showLabels,
    allowZoom: chart.allowZoom,
    showLegend: chart.showLegend,
    otherTotalSpec: otherTotalSpec,
    dataPointsToShow: dataPointsToShow,
    textOnAxis: chart.textOnAxis,
    showAxis: chart.showAxis,
    showGridlines: chart.showGridlines,
    dimensionErrMsg: chart.error.dimensionErrMsg,
    measureErrMsg: chart.error.measureErrMsg,
    maxAxisLength: chart.maxAxisLength,
    symbol: symbol,
  };

  const GridLineStyle = {
    show: gridlines.show,
    stroke: gridlines.stroke,
    "stroke-dasharray": gridlines.strokeDasharray,
  };

  const LineChartStyle = {
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

  const LineLabelStyle = {
    "font-size": fontSize.subFont[size],
    fill: fontColor || labelColor,
  };

  const LineStyle = {
    "stroke-width": strokeWidth,
  };

  const SelectedMarker = {
    opacity: selection.opacity,
    stroke: selection.stroke,
    "stroke-width": selection.strokeWidth,
  };

  const NonSelectedMarker = {
    opacity: nonSelection.opacity,
    backgroundColor: nonSelectionBackground,
  };

  const LineThemes = {
    LineChartStyle,
    GridLineStyle,
    LineDefault,
    yAxisStyle,
    xAxisStyle,
    axisTitleStyle,
    LineLabelStyle,
    LineStyle,
    colorPalette,
    SelectedMarker,
    NonSelectedMarker,
  };

  return {
    LineThemes,
  };
}

export default LineTheme;
