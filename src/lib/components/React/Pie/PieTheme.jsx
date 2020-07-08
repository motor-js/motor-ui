import styled from "styled-components";
import { defaultProps } from "../../../default-props";
import { globalStyle, borderStyle } from "../../../utils/styles";
import { createColorArray } from "../../../utils/colors";
import { selectColor } from "../../../utils/colors";
import { componentWidth } from "../../../utils";

const PieWrapper = styled.div`
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

const PieWrapperNoData = styled.div`
  ${globalStyle};
  display: ${(props) => props.theme.global.chart.noData.display};
  border-radius: ${(props) =>
    props.borderRadius || props.theme.global.chart.noData.borderRadius};
  background-color: ${(props) =>
    props.theme.global.chart.noData.backgroundColor};
  border-collapse: ${(props) => props.theme.global.chart.noData.borderCollapse};
  width: ${(props) => componentWidth(props)};
  ${(props) =>
    props.border &&
    (Array.isArray(props.border, props.theme)
      ? props.border.map((border) => borderStyle(border, props.theme, "chart"))
      : borderStyle(props.border, props.theme, "chart"))};

  vertical-align: ${(props) => props.theme.global.chart.noData.verticalAlign};
  box-sizing: ${(props) => props.theme.global.chart.boxSizing};
  margin: ${(props) => props.margin};
`;

const PieNoDataContent = styled.div`
  ${globalStyle};
  display: ${(props) => props.theme.global.chart.noDataContent.display};
  margin: ${(props) => props.theme.global.chart.noDataContent.margin};
  align-items: ${(props) => props.theme.global.chart.noDataContent.alignItems};
  justify-content: ${(props) =>
    props.theme.global.chart.noDataContent.justifyContent};
  height: ${(props) => props.height};
`;

PieWrapper.defaultProps = {};
Object.setPrototypeOf(PieWrapper.defaultProps, defaultProps);

PieWrapperNoData.defaultProps = {};
Object.setPrototypeOf(PieWrapperNoData.defaultProps, defaultProps);

PieNoDataContent.defaultProps = {};
Object.setPrototypeOf(PieNoDataContent.defaultProps, defaultProps);

export { PieWrapper, PieWrapperNoData, PieNoDataContent };

function PieTheme(theme, size, fontColor, chartColor) {
  const {
    global: { fontFamily, chart, size: fontSize, colorTheme },
    pie: { main },
  } = theme;

  // if the prop is undefined, use the base theme
  const color = chartColor || colorTheme;
  const colorPalette = createColorArray(color, theme);

  const labelColor = selectColor(chart.label.fontColor, theme);

  const PieDefault = {
    allowSelections: chart.allowSelections,
    suppressZero: chart.suppressZero,
    showLabels: chart.showLabels,
    showLegend: chart.showLegend,
    otherTotalSpec: main.otherTotalSpec,
    dimensionErrMsg: chart.error.dimensionErrMsg,
    measureErrMsg: chart.error.measureErrMsg,
  };

  const PieChartStyle = {
    "font-family": fontFamily,
    "font-size": fontSize.font[size],
  };

  const PieLabelStyle = {
    "font-size": fontSize.font[size],
    fill: fontColor || labelColor,
  };

  const PieStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "left",
    maxhighlightColor: "#006593",
    padding: "10px 0px 10px 15px",
    fontFamily,
    fontSize: fontSize.font[size],
    chartValueSize: "15px",
    cursor: "pointer",
    userSelect: "none",
  };

  const SelectedPie = {
    opacity: chart.selection.opacity,
    stroke: chart.selection.stroke,
    "stroke-width": chart.selection.strokeWidth,
  };

  const NonSelectedPie = {
    opacity: chart.nonSelection.opacity,
  };

  const PieThemes = {
    colorPalette,
    PieDefault,
    PieChartStyle,
    PieLabelStyle,
    PieStyle,
    SelectedPie,
    NonSelectedPie,
  };

  return {
    PieThemes,
  };
}

export default PieTheme;
