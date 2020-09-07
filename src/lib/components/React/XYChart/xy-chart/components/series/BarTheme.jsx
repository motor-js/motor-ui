import styled from "styled-components";
import { defaultProps } from "../../../../../../default-props";
import { globalStyle, borderStyle } from "../../../../../../utils/styles";
// import { createColorArray } from "../../../../../../utils/colors";
// import { selectColor } from "../../../../../../utils/colors";
import { componentWidth } from "../../../../../../utils";
import { Bar } from "@vx/shape";

const BarWrapper = styled.div`
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

BarWrapper.defaultProps = {};
Object.setPrototypeOf(BarWrapper.defaultProps, defaultProps);

const StyledBar = styled(Bar)`
  opacity: ${(props) => props.barOpacity};
`;

StyledBar.defaultProps = {};
Object.setPrototypeOf(StyledBar.defaultProps, defaultProps);

export { StyledBar };
