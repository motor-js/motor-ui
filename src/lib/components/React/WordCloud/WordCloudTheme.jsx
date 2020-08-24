import styled from "styled-components";
import { defaultProps } from "../../../default-props";
import { globalStyle, borderStyle } from "../../../utils/styles";
import { createColorArray } from "../../../utils/colors";
import { componentWidth } from "../../../utils";

const WordCloudWrapper = styled.div`
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

const WordCloudWrapperNoData = styled.div`
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

const WordCloudNoDataContent = styled.div`
  ${globalStyle};
  display: ${(props) => props.theme.global.chart.noDataContent.display};
  margin: ${(props) => props.theme.global.chart.noDataContent.margin};
  align-items: ${(props) => props.theme.global.chart.noDataContent.alignItems};
  justify-content: ${(props) =>
    props.theme.global.chart.noDataContent.justifyContent};
  height: ${(props) => props.height};
`;

WordCloudWrapper.defaultProps = {};
Object.setPrototypeOf(WordCloudWrapper.defaultProps, defaultProps);

WordCloudWrapperNoData.defaultProps = {};
Object.setPrototypeOf(WordCloudWrapperNoData.defaultProps, defaultProps);

WordCloudNoDataContent.defaultProps = {};
Object.setPrototypeOf(WordCloudNoDataContent.defaultProps, defaultProps);

export { WordCloudWrapper, WordCloudWrapperNoData, WordCloudNoDataContent };

function WordCloudTheme(theme, size, colorArray) {
  const {
    global: { fontFamily, chart, size: fontSize, colorTheme },
    wordcloud: { main },
  } = theme;

  // if the prop is undefined, use the base theme
  const color = colorArray || colorTheme;
  const colorPalette = createColorArray(color, theme);

  const WordCloudDefault = {
    allowSelections: chart.allowSelections,
    suppressZero: chart.suppressZero,
    qOtherTotalSpec: main.qOtherTotalSpec,
    dimensionErrMsg: chart.error.dimensionErrMsg,
    measureErrMsg: chart.error.measureErrMsg,
  };

  const WordCloudChartStyle = {
    "font-family": fontFamily,
    "font-size": fontSize.font[size],
  };

  const WordCloudSelected = {
    opacity: chart.selection.opacity,
    "paint-order": "stroke",
    stroke: chart.selection.stroke,
    "stroke-width": chart.selection.strokeWidth / 2,
  };

  const WordCloudNonSelected = {
    opacity: chart.nonSelection.opacity,
  };

  const WordCloudThemes = {
    colorPalette,
    WordCloudDefault,
    WordCloudSelected,
    WordCloudNonSelected,
    WordCloudChartStyle,
  };

  return {
    WordCloudThemes,
  };
}

export default WordCloudTheme;
