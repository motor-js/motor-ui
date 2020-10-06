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
    props.borderRadius || props.theme.global.chart.wrapper.borderRadius};
  background-color: ${(props) =>
    props.backgroundColor || props.theme.global.chart.wrapper.backgroundColor};
  margin: ${(props) => props.margin};
  userselect: ${(props) => props.theme.global.chart.wrapper.userSelect};
  width: ${(props) => componentWidth(props)};
  display: ${(props) => props.theme.global.chart.wrapper.display};
  box-sizing: ${(props) => props.theme.global.chart.wrapper.boxSizing};
  position: ${(props) => props.theme.global.chart.wrapper.position};
  padding: ${(props) => props.theme.global.chart.wrapper.padding};
  font-weight: ${(props) => props.theme.global.chart.wrapper.fontWeight};
  min-height: ${(props) => props.theme.global.chart.wrapper.minHeight};
  text-decoration: ${(props) => props.theme.global.chart.wrapper.textDirection};
  box-shadow: ${(props) =>
    props.showBoxShadow ? props.theme.global.chart.wrapper.boxShadow : null};
  flex-direction: ${(props) => props.theme.global.chart.wrapper.flexDirection};
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
  box-sizing: ${(props) => props.theme.global.chart.wrapper.boxSizing};
  position: ${(props) => props.theme.global.chart.wrapper.position};
  padding: ${(props) => props.theme.global.chart.wrapper.padding};
  margin: ${(props) => props.margin};
  font-weight: ${(props) => props.theme.global.chart.wrapper.fontWeight};
  min-height: ${(props) => props.theme.global.chart.wrapper.minHeight};
  box-shadow: ${(props) => props.theme.global.chart.wrapper.boxShadow};
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
