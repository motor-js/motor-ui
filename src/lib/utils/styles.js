import { css } from "styled-components";
import { selectColor } from "./colors";

export const globalStyle = css`
  font-family: ${(props) => props.theme.global.fontFamily};
  font-size: ${(props) => props.theme.global.size.font[props.size]};
`;

export const gridArea = css`
  ${(props) => props.gridArea && `grid-area: ${props.gridArea};`}
`;

export const focusStyles = (props) => {
  const {
    theme: {
      global: { focus },
    },
  } = props;

  return `
    outline-offset: 0px;
    outline: 1px dotted ${focus.outline.color};
    outline: ${focus.outline.size} auto -webkit-focus-ring-color;
  `;
};

export const borderStyle = (data, theme) => {
  const styles = [];
  const color = selectColor(data.color || theme.global.border.color, theme);
  const borderSize = data.size || theme.global.border.size;
  const style = data.style || theme.global.border.style;
  // const radius = data.radius || theme.global.border.radius
  const side = typeof data === "string" ? data : data.side || "all";
  const value = `${style} ${borderSize} ${color}`;
  if (
    side === "top" ||
    side === "bottom" ||
    side === "left" ||
    side === "right"
  ) {
    styles.push(`border-${side}: ${value};`);
  } else if (side === "end" || side === "start") {
    styles.push(css`border-inline-${side}: ${value};`);
  } else if (side === "vertical") {
    styles.push(css`
      border-left: ${value};
      border-right: ${value};
    `);
  } else if (side === "horizontal") {
    styles.push(css`
      border-top: ${value};
      border-bottom: ${value};
    `);
  } else if (side === "between") {
    // no-op
  } else {
    styles.push(
      css`
        border: ${value};
      `
    );
  }

  return styles;
};
