import styled from "styled-components";
import { defaultProps } from "../../../default-props";
import { globalStyle, borderStyle } from "../../../utils/styles";
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
    props.borderRadius || props.theme.xyChart.wrapper.borderRadius};
  background-color: ${(props) =>
    props.backgroundColor || props.theme.xyChart.wrapper.backgroundColor};
  margin: ${(props) => props.margin};
  userselect: ${(props) => props.theme.xyChart.wrapper.userSelect};
  width: ${(props) => componentWidth(props)};
  display: ${(props) => props.theme.xyChart.wrapper.display};
  box-sizing: ${(props) => props.theme.xyChart.wrapper.boxSizing};
  position: ${(props) => props.theme.xyChart.wrapper.position};
  padding: ${(props) => props.theme.xyChart.wrapper.padding};
  font-weight: ${(props) => props.theme.xyChart.wrapper.fontWeight};
  color: ${(props) => props.theme.xyChart.wrapper.color};
  min-height: ${(props) => props.theme.xyChart.wrapper.minHeight};
  text-decoration: ${(props) => props.theme.xyChart.wrapper.textDirection};
  box-shadow: ${(props) =>
    props.showBoxShadow ? props.theme.xyChart.wrapper.boxShadow : null};
  flex-direction: ${(props) => props.theme.xyChart.wrapper.flexDirection};
`;

const PieWrapperNoData = styled.div`
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
  box-sizing: ${(props) => props.theme.xyChart.wrapper.boxSizing};
  position: ${(props) => props.theme.xyChart.wrapper.position};
  padding: ${(props) => props.theme.xyChart.wrapper.padding};
  margin: ${(props) => props.margin};
  font-weight: ${(props) => props.theme.xyChart.wrapper.fontWeight};
  color: ${(props) => props.theme.xyChart.wrapper.color};
  min-height: ${(props) => props.theme.xyChart.wrapper.minHeight};
  box-shadow: ${(props) => props.theme.xyChart.wrapper.boxShadow};
`;

const PieNoDataContent = styled.div`
  ${globalStyle};
  ${(props) => props.gridArea && `grid-area: ${props.gridArea};`};
  display: ${(props) => props.theme.xyChart.noDataContent.display};
  margin: ${(props) => props.theme.xyChart.noDataContent.margin};
  align-items: ${(props) => props.theme.xyChart.noDataContent.alignItems};
  justify-content: ${(props) =>
    props.theme.xyChart.noDataContent.justifyContent};
  height: ${(props) => props.height};
`;

PieWrapper.defaultProps = {};
Object.setPrototypeOf(PieWrapper.defaultProps, defaultProps);

PieWrapperNoData.defaultProps = {};
Object.setPrototypeOf(PieWrapperNoData.defaultProps, defaultProps);

PieNoDataContent.defaultProps = {};
Object.setPrototypeOf(PieNoDataContent.defaultProps, defaultProps);

export { PieWrapper, PieWrapperNoData, PieNoDataContent };
