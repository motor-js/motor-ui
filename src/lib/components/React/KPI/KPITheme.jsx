import styled from "styled-components";
import { defaultProps } from "../../../default-props";
import { globalStyle, borderStyle } from "../../../utils/styles";
import { selectColor } from "../../../utils/colors";

const KPIWrapper = styled.div`
  ${globalStyle}
  box-sizing: ${(props) => props.theme.kpi.wrapper.boxSizing};
  margin: ${(props) => props.margin || props.theme.kpi.wrapper.margin};
  padding: ${(props) =>
    props.padding ||
    props.theme.kpi.size[props.size].padding ||
    props.theme.kpi.medium.padding};
  ${(props) =>
    props.border &&
    props.border !== "none" &&
    (Array.isArray(props.border, props.theme)
      ? props.border.map((border) => borderStyle(border, props.theme))
      : borderStyle(props.border, props.theme))};
  border-radius: ${(props) => props.theme.kpi.wrapper.radius};
  max-width: ${(props) => props.maxWidth};
  cursor: ${(props) => props.cursor};
  width: ${(props) => props.width};
  background-color: ${(props) =>
    props.backgroundColor || props.theme.kpi.wrapper.backgroundColor};
  position: relative;
  word-wrap: break-word;
    "-webkit-user-select": "none",
    "-khtml-user-select": "none",
    "-moz-user-select": "none",
    "-ms-user-select": "none",
    "user-select": "none",
  display: inline-flex;
  text-align: ${(props) =>
    props.textAlign || props.theme.kpi.wrapper.textAlign};
  justify-content: ${(props) => {
    switch (props.justifyContent) {
      case "flex-start":
        return "flex-start";
      case "center":
        return "center";
      case "flex-end":
        return "flex-end";
      default:
        return "center";
    }
  }};
`;

const KPIWrapperNoData = styled.div`
  ${globalStyle}
  box-sizing: ${(props) => props.theme.kpi.wrapper.boxSizing};
  max-width: ${(props) => props.maxWidth};
  width: ${(props) => props.width};
  margin: ${(props) => props.margin || props.theme.kpi.wrapper.margin};
  padding: ${(props) =>
    props.padding ||
    props.theme.kpi.size[props.size].padding ||
    props.theme.kpi.medium.padding};
  ${(props) =>
    props.border &&
    (Array.isArray(props.border, props.theme)
      ? props.border.map((border) => borderStyle(border, props.theme))
      : borderStyle(props.border, props.theme))};
  border-radius: ${(props) => props.theme.kpi.wrapper.radius};
  height: ${(props) =>
    props.responsive
      ? props.theme.kpi.size[props.size][props.screen].value
      : props.theme.kpi.size[props.size].desktop.value};
  display: ${(props) => props.theme.global.chart.noData.display};
  align-items: ${(props) => props.theme.global.chart.noData.alignItems};
  justify-content: ${(props) => props.theme.global.chart.noData.justifyContent};
  background-color: ${(props) =>
    props.theme.global.chart.noData.backgroundColor};
  border-collapse: ${(props) => props.theme.global.chart.noData.borderCollapse};
`;

const KPIGroup = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px;
`;

const KPILabel = styled.span`
  align-self: ${(props) => props.alignSelf || props.theme.kpi.label.alignSelf};
  color: ${(props) =>
    selectColor(
      props.labelColor || props.theme.kpi.label.fontColor,
      props.theme
    )};
  font-size: ${(props) =>
    props.responsive
      ? props.theme.kpi.size[props.size][props.screen].label
      : props.theme.kpi.size[props.size].desktop.label};
`;

const KPIValueWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const KPIValue = styled.span`
  font-weight: bold;
  display: inline-block;
  line-height: ${(props) =>
    props.responsive
      ? props.theme.kpi.size[props.size][props.screen].value
      : props.theme.kpi.size[props.size].desktop.value};
  color: ${(props) =>
    selectColor(props.color || props.theme.kpi.value.fontColor, props.theme)};
  font-size: ${(props) =>
    props.responsive
      ? props.theme.kpi.size[props.size][props.screen].value
      : props.theme.kpi.size[props.size].desktop.value};
`;

KPIWrapper.defaultProps = {};
Object.setPrototypeOf(KPIWrapper.defaultProps, defaultProps);

KPIWrapperNoData.defaultProps = {};
Object.setPrototypeOf(KPIWrapperNoData.defaultProps, defaultProps);

KPILabel.defaultProps = {};
Object.setPrototypeOf(KPILabel.defaultProps, defaultProps);

KPIValueWrapper.defaultProps = {};
Object.setPrototypeOf(KPIValueWrapper.defaultProps, defaultProps);

KPIValue.defaultProps = {};
Object.setPrototypeOf(KPIValue.defaultProps, defaultProps);

KPIGroup.defaultProps = {};
Object.setPrototypeOf(KPIGroup.defaultProps, defaultProps);

export {
  KPIWrapper,
  KPIWrapperNoData,
  KPILabel,
  KPIValueWrapper,
  KPIValue,
  KPIGroup,
};
