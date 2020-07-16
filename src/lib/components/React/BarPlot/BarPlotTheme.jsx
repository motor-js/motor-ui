import styled from "styled-components";
import { defaultProps } from "../../../default-props";
import { globalStyle, borderStyle } from "../../../utils/styles";
import { createColorArray } from "../../../utils/colors";
import { selectColor } from "../../../utils/colors";
import { componentWidth } from "../../../utils";

const BarPlotWrapper = styled.div`
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

const BarPlotWrapperNoData = styled.div`
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

const BarPlotNoDataContent = styled.div`
  ${globalStyle};
  display: ${(props) => props.theme.global.chart.noDataContent.display};
  margin: ${(props) => props.theme.global.chart.noDataContent.margin};
  align-items: ${(props) => props.theme.global.chart.noDataContent.alignItems};
  justify-content: ${(props) =>
    props.theme.global.chart.noDataContent.justifyContent};
  height: ${(props) => props.height};
  width: ${(props) => componentWidth(props)};
`;

BarPlotWrapper.defaultProps = {};
Object.setPrototypeOf(BarPlotWrapper.defaultProps, defaultProps);

BarPlotWrapperNoData.defaultProps = {};
Object.setPrototypeOf(BarPlotWrapperNoData.defaultProps, defaultProps);

BarPlotNoDataContent.defaultProps = {};
Object.setPrototypeOf(BarPlotNoDataContent.defaultProps, defaultProps);

export { BarPlotWrapper, BarPlotWrapperNoData, BarPlotNoDataContent };

function BarPlotTheme(theme, size, fontColor, colorArray) {
  const {
    global: { fontFamily, chart, size: fontSize, colorTheme },
    barplot: { main },
  } = theme;

  // if the prop is undefined, use the base theme
  const color = colorArray || colorTheme;
  const colorPalette = createColorArray(color, theme);

  const labelColor = selectColor(chart.label.fontColor, theme);

  const BarPlotDefault = {
    allowSelections: chart.allowSelections,
    suppressZero: chart.suppressZero,
    showLegend: chart.showLegend,
    otherTotalSpec: main.otherTotalSpec,
    dimensionErrMsg: chart.error.dimensionErrMsg,
    measureErrMsg: chart.error.measureErrMsg,
  };

  const BarPlotChartStyle = {
    "font-family": fontFamily,
    "font-size": fontSize.font[size],
  };

  const BarPlotLabelStyle = {
    "font-size": fontSize.subFont[size],
    "alignment-baseline": "middle",
    fill: fontColor || labelColor,
  };

  const SelectedBarPlot = {
    opacity: chart.selection.opacity,
    stroke: chart.selection.stroke,
    "stroke-width": chart.selection.strokeWidth,
  };

  const NonSelectedBarPlot = {
    opacity: chart.nonSelection.opacity,
  };

  const BarPlotThemes = {
    colorPalette,
    BarPlotDefault,
    SelectedBarPlot,
    NonSelectedBarPlot,
    BarPlotChartStyle,
    BarPlotLabelStyle,
  };

  return {
    BarPlotThemes,
  };
}

export default BarPlotTheme;
