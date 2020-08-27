import styled from "styled-components";
import { defaultProps } from "../../../default-props";
import { globalStyle, borderStyle } from "../../../utils/styles";
import { componentWidth } from "../../../utils";

const XYChartWrapper = styled.div`
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

const XYChartWrapperNoData = styled.div`
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
  // width: ${(props) => props.width};
  box-sizing: ${(props) => props.theme.global.chart.boxSizing};
  margin: ${(props) => props.margin};
`;

const XYChartNoDataContent = styled.div`
  ${globalStyle};
  ${(props) => props.gridArea && `grid-area: ${props.gridArea};`};
  display: ${(props) => props.theme.global.chart.noDataContent.display};
  margin: ${(props) => props.theme.global.chart.noDataContent.margin};
  align-items: ${(props) => props.theme.global.chart.noDataContent.alignItems};
  justify-content: ${(props) =>
    props.theme.global.chart.noDataContent.justifyContent};
  height: ${(props) => props.height};
`;

XYChartWrapper.defaultProps = {};
Object.setPrototypeOf(XYChartWrapper.defaultProps, defaultProps);

XYChartWrapperNoData.defaultProps = {};
Object.setPrototypeOf(XYChartWrapperNoData.defaultProps, defaultProps);

XYChartNoDataContent.defaultProps = {};
Object.setPrototypeOf(XYChartNoDataContent.defaultProps, defaultProps);

export { XYChartWrapper, XYChartWrapperNoData, XYChartNoDataContent };

function XYChartTheme(theme, size, fontColor, colorArray) {
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
  // const color = colorArray || colorTheme;
  // const colorPalette = createColorArray(color, theme);

  // const xAxisColor = selectColor(xAxis.color, theme);
  // const yAxisColor = selectColor(yAxis.color, theme);
  // const axisTitleColor = selectColor(axisTitle.color, theme);
  // const labelColor = selectColor(chart.label.fontColor, theme);

  const XYChartDefault = {
    suppressZero: chart.suppressZero,
    otherTotalSpec: main.otherTotalSpec,
    // allowSelections: chart.allowSelections,
    // allowSlantedYAxis: chart.allowSlantedYAxis,
    // suppressScroll: chart.suppressScroll,
    // allowZoom: chart.allowZoom,
    // tickSpacing: chart.tickSpacing,
    // showLabels: chart.showLabels,
    // showLegend: chart.showLegend,
    // zoomScrollOnXYChartHeight: main.zoomScrollOnXYChartHeight,
    // barPadding: main.barPadding,
    // barPaddingNarrow: main.barPaddingNarrow,
    // textOnAxis: chart.textOnAxis,
    // showAxis: chart.showAxis,
    // showGridlines: chart.showGridlines,
    // maxWidth: main.maxWidth,
    // dimensionErrMsg: chart.error.dimensionErrMsg,
    // measureErrMsg: chart.error.measureErrMsg,
    // maxAxisLength: chart.maxAxisLength,
  };

  return XYChartDefault;
}

export default XYChartTheme;
