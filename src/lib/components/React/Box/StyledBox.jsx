import styled, { css } from "styled-components";
import { focusStyles, globalStyle, borderStyle } from "../../../utils/styles";
import { defaultProps } from "../../../default-props";
import { selectColor } from "../../../utils/colors";

const ALIGN_MAP = {
  baseline: "baseline",
  center: "center",
  end: "flex-end",
  start: "flex-start",
  stretch: "stretch",
};

const alignStyle = css`
  align-items: ${(props) => ALIGN_MAP[props.align]};
`;

const ALIGN_CONTENT_MAP = {
  around: "around",
  between: "between",
  center: "center",
  end: "flex-end",
  start: "flex-start",
  stretch: "stretch",
};

const alignContentStyle = css`
  align-content: ${(props) => ALIGN_CONTENT_MAP[props.alignContent]};
`;

const JUSTIFY_MAP = {
  center: "center",
  end: "flex-end",
  start: "flex-start",
  stretch: "stretch",
};

const justifyStyle = css`
  justify-items: ${(props) => JUSTIFY_MAP[props.justify]};
`;

const JUSTIFY_CONTENT_MAP = {
  around: "space-around",
  between: "space-between",
  center: "center",
  end: "flex-end",
  start: "flex-start",
  stretch: "stretch",
};

const justifyContentStyle = css`
  justify-content: ${(props) => JUSTIFY_CONTENT_MAP[props.justifyContent]};
`;

const BASIS_MAP = {
  auto: "auto",
  full: "100%",
  "1/2": "50%",
  "1/4": "25%",
  "2/4": "50%",
  "3/4": "75%",
  "1/3": "33.33%",
  "2/3": "66.66%",
};

const basisStyle = css`
  flex-basis: ${(props) =>
    BASIS_MAP[props.basis] ||
    props.theme.global.size[props.basis] ||
    props.basis};
`;

const WRAP_MAP = {
  true: "wrap",
  reverse: "wrap-reverse",
};

const wrapStyle = css`
  flex-wrap: ${(props) => WRAP_MAP[props.wrapProp]};
`;

/*
  Removed the below from directionStyle due to clash with Sidebar style.
  min-width: 0;
  min-height: 0;
  Might be needed due to this:
  // min-width and min-height needed because of this
  // https://stackoverflow.com/questions/36247140/why-doesnt-flex-item-shrink-past-content-size
  // we assume we are in the context of a Box going the other direction
  // TODO: revisit this
  */
const directionStyle = (direction) => {
  const styles = [
    css`
      min-width: 0;
      min-height: 0;
      flex-direction: ${direction === "row-responsive" ? "row" : direction};
    `,
  ];

  return styles;
};

const overflowStyle = (overflowProp) => {
  if (typeof overflowProp === "string") {
    return css`
      overflow: ${overflowProp};
    `;
  }

  return css`
    ${overflowProp.horizontal &&
      `overflow-x: ${overflowProp.horizontal};`} ${overflowProp.vertical &&
      `overflow-y: ${overflowProp.vertical};`};
  `;
};

const FLEX_MAP = {
  [true]: "1 1",
  [false]: "0 0",
  grow: "1 0",
  shrink: "0 1",
};

const flexGrowShrinkProp = (flex) => {
  if (typeof flex === "boolean" || typeof flex === "string") {
    return FLEX_MAP[flex];
  }

  return `${flex.grow ? flex.grow : 0} ${flex.shrink ? flex.shrink : 0}`;
};

const flexStyle = css`
  flex: ${(props) =>
    `${flexGrowShrinkProp(props.flex)}${
      props.flex !== true && !props.basis ? " auto" : ""
    }`};
`;

const interactiveStyle = css`
  cursor: pointer;
`;

const heightObjectStyle = css`
  ${(props) =>
    props.heightProp.max &&
    css`
      max-height: ${props.heightProp.max};
    `};
  ${(props) =>
    props.heightProp.min &&
    css`
      min-height: ${props.heightProp.min};
    `};
`;

const heightStyle = css`
  height: ${(props) => props.heightProp};
`;

const widthObjectStyle = css`
  ${(props) =>
    props.widthProp.max &&
    css`
      max-width: ${props.widthProp.max};
    `};
  ${(props) =>
    props.widthProp.min &&
    css`
      min-width: ${props.widthProp.min};
    `};
`;

const widthStyle = css`
  width: ${(props) => props.widthProp};
`;

const StyledBox = styled.div`
  ${globalStyle};
  ${(props) =>
    props.heightProp &&
    (typeof props.heightProp === "object" ? heightObjectStyle : heightStyle)}
  ${(props) =>
    props.widthProp &&
    (typeof props.widthProp === "object" ? widthObjectStyle : widthStyle)}
  display: flex;
    "-webkit-user-select": "none",
    "-khtml-user-select": "none",
    "-moz-user-select": "none",
    "-ms-user-select": "none",
    "user-select": "none",
  box-sizing: border-box;
  background-color: ${(props) =>
    selectColor(props.backgroundColor, props.theme)};
  ${(props) =>
    props.border &&
    props.border !== "none" &&
    (Array.isArray(props.border, props.theme)
      ? props.border.map((border) => borderStyle(border, props.theme))
      : borderStyle(props.border, props.theme))}
 border-radius: ${(props) => props.borderRadius};
  padding: ${(props) => props.padding};
  ${(props) => props.align && alignStyle}
  ${(props) => props.alignContent && alignContentStyle}
  ${(props) => props.justify && justifyStyle}
  ${(props) => props.justifyContent && justifyContentStyle}
  ${(props) => props.overflow && overflowStyle(props.overflow)}
  ${(props) => props.direction && directionStyle(props.direction)}
  ${(props) => props.flex !== undefined && flexStyle}
  ${(props) =>
    props.onFocus &&
    props.focus &&
    props.focusable !== false &&
    focusStyles(props)}
  ${(props) => props.basis && basisStyle}
  ${(props) => props.wrapProp && wrapStyle}
  box-shadow: ${(props) => props.elevation};
  ${(props) => props.onClick && interactiveStyle}
  margin: ${(props) => props.margin};
  ${(props) => props.gridArea && `grid-area: ${props.gridArea};`};
`;

StyledBox.defaultProps = {};
Object.setPrototypeOf(StyledBox.defaultProps, defaultProps);

export default StyledBox;

/*
selectColor(
    props.fontColor || props.theme.button.fontColor,
    props.theme,
  )

*/
