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
    props.borderRadius || props.theme.xyChart.borderRadius};
  background-color: ${(props) =>
    props.backgroundColor || props.theme.xyChart.backgroundColor};
  margin: ${(props) => props.margin};
  userselect: ${(props) => props.theme.xyChart.userSelect};
  width: ${(props) => componentWidth(props)};
  // width: ${(props) => props.width};
  display: ${(props) => props.theme.xyChart.display};
  box-sizing: ${(props) => props.theme.xyChart.boxSizing};
`;

const XYChartWrapperNoData = styled.div`
  ${globalStyle};
    ${(props) => props.gridArea && `grid-area: ${props.gridArea};`};
  ${(props) =>
    props.border &&
    (Array.isArray(props.border, props.theme)
      ? props.border.map((border) => borderStyle(border, props.theme, "chart"))
      : borderStyle(props.border, props.theme, "chart"))};
  vertical-align: ${(props) => props.theme.xyChart.noData.verticalAlign};
  display: ${(props) => props.theme.xyChart.noData.display};
  border-radius: ${(props) =>
    props.borderRadius || props.theme.xyChart.noData.borderRadius};
  background-color: ${(props) => props.theme.xyChart.noData.backgroundColor};
  border-collapse: ${(props) => props.theme.xyChart.noData.borderCollapse};
  height: ${(props) => props.height};
  width: ${(props) => componentWidth(props)};
  // width: ${(props) => props.width};
  box-sizing: ${(props) => props.theme.xyChart.boxSizing};
  margin: ${(props) => props.margin};
`;

const XYChartNoDataContent = styled.div`
  ${globalStyle};
  ${(props) => props.gridArea && `grid-area: ${props.gridArea};`};
  display: ${(props) => props.theme.xyChart.noDataContent.display};
  margin: ${(props) => props.theme.xyChart.noDataContent.margin};
  align-items: ${(props) => props.theme.xyChart.noDataContent.alignItems};
  justify-content: ${(props) =>
    props.theme.xyChart.noDataContent.justifyContent};
  height: ${(props) => props.height};
`;

XYChartWrapper.defaultProps = {};
Object.setPrototypeOf(XYChartWrapper.defaultProps, defaultProps);

XYChartWrapperNoData.defaultProps = {};
Object.setPrototypeOf(XYChartWrapperNoData.defaultProps, defaultProps);

XYChartNoDataContent.defaultProps = {};
Object.setPrototypeOf(XYChartNoDataContent.defaultProps, defaultProps);

export { XYChartWrapper, XYChartWrapperNoData, XYChartNoDataContent };
