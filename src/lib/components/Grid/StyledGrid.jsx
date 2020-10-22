import styled, { css } from "styled-components";
import { defaultProps } from "../../default-props";
import { selectColor } from "../../utils/colors";

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

const ALIGN_MAP = {
  center: "center",
  end: "flex-end",
  start: "flex-start",
  stretch: "stretch",
};

const alignStyle = css`
  align-items: ${(props) => ALIGN_MAP[props.align]};
`;

const ALIGN_CONTENT_MAP = {
  around: "space-around",
  between: "space-between",
  center: "center",
  end: "flex-end",
  start: "flex-start",
  stretch: "stretch",
};

const alignContentStyle = css`
  align-content: ${(props) => ALIGN_CONTENT_MAP[props.alignContent]};
`;

const SIZE_MAP = {
  flex: "1fr",
  full: "100%",
  "1/2": "50%",
  "1/4": "25%",
  "2/4": "50%",
  "3/4": "75%",
  "1/3": "33.33%",
  "2/3": "66.66%",
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

const getRepeatCount = (count) =>
  typeof count === "number" ? count : `auto-${count}`;

const getRepeatSize = (size, theme) => {
  if (Array.isArray(size)) {
    return `minmax(${theme.global.size[size[0]] || size[0]}, ${theme.global
      .size[size[1]] || size[1]})`;
  }
  if (size === "flex") return "1fr";
  return `minmax(${theme.global.size[size] || size}, 1fr)`;
};

const sizeFor = (size, props, isRow) => {
  const mapped = SIZE_MAP[size];
  if (
    isRow &&
    mapped &&
    (!props.fillContainer || props.fillContainer === "horizontal")
  ) {
    console.warn("Grid needs `fill` when using fractional row sizes");
  }
  return mapped || props.theme.global.size[size] || size;
};

const fillStyle = (fill) => {
  if (fill === "horizontal") {
    return "width: 100%;";
  }
  if (fill === "vertical") {
    return "height: 100%;";
  }
  if (fill) {
    return `
      width: 100%;
      height: 100%;
    `;
  }
  return undefined;
};

const areasStyle = (props) => {
  // translate areas objects into grid-template-areas syntax
  if (!Array.isArray(props.rows) || !Array.isArray(props.columns)) {
    console.warn("Grid `areas` requires `rows` and `columns` to be arrays.");
  }
  if (
    Array.isArray(props.areas) &&
    props.areas.every((area) => Array.isArray(area))
  ) {
    return `grid-template-areas: ${props.areas
      .map((area) => `"${area.join(" ")}"`)
      .join(" ")};`;
  }
  const cells = props.rows.map(() => props.columns.map(() => "."));
  props.areas.forEach((area) => {
    for (let row = area.start[1]; row <= area.end[1]; row += 1) {
      for (let column = area.start[0]; column <= area.end[0]; column += 1) {
        cells[row][column] = area.name;
      }
    }
  });
  return `grid-template-areas: ${cells
    .map((r) => `"${r.join(" ")}"`)
    .join(" ")};`;
};

const columnsStyle = (props) => {
  if (Array.isArray(props.columns)) {
    return css`
      grid-template-columns: ${props.columns
        .map((s) => {
          if (Array.isArray(s)) {
            return `minmax(${sizeFor(s[0], props)}, ${sizeFor(s[1], props)})`;
          }
          return sizeFor(s, props);
        })
        .join(" ")};
    `;
  }
  if (typeof props.columns === "object") {
    return css`
      grid-template-columns: repeat(
        ${getRepeatCount(props.columns.count)},
        ${getRepeatSize(props.columns.size, props.theme)}
      );
    `;
  }
  return css`
    grid-template-columns: repeat(
      auto-fill,
      ${getRepeatSize(props.columns, props.theme)}
    );
  `;
};

const gapStyle = (props) => {
  if (typeof props.gap === "string") {
    const gapSize = props.gap;
    return `grid-gap: ${gapSize} ${gapSize};`;
  }
  if (props.gap.row && props.gap.column) {
    return `
      grid-row-gap: ${props.gap.row};
      grid-column-gap: ${props.gap.column};
    `;
  }
  if (props.gap.row) {
    return `
      grid-row-gap: ${props.gap.row};
    `;
  }
  if (props.gap.column) {
    return `
      grid-column-gap: ${props.gap.column};
    `;
  }
  return "";
};

const rowsStyle = (props) => {
  if (Array.isArray(props.rows)) {
    return css`
      grid-template-rows: ${props.rows
        .map((s) => {
          if (Array.isArray(s)) {
            return `minmax(${sizeFor(s[0], props, true)}, ${sizeFor(
              s[1],
              props,
              true
            )})`;
          }
          return sizeFor(s, props, true);
        })
        .join(" ")};
    `;
  }
  return css`
    grid-auto-rows: ${props.theme.global.size[props.rows]};
  `;
};

const StyledGrid = styled.div`
  ${fillStyle};
  ${(props) => props.areas && areasStyle(props)}
  ${(props) => props.rows && rowsStyle(props)}
  ${(props) => props.columns && columnsStyle(props)}
  ${(props) => props.gap && gapStyle(props)}
  ${(props) => props.overflow && overflowStyle(props.overflow)};
  ${(props) => props.justify && justifyStyle};
  ${(props) => props.justifyContent && justifyContentStyle};
  ${(props) => props.align && alignStyle}
  ${(props) => props.alignContent && alignContentStyle}
  background-color: ${(props) =>
    selectColor(props.backgroundColor, props.theme)};
  display: grid;
`;

StyledGrid.defaultProps = {};
Object.setPrototypeOf(StyledGrid.defaultProps, defaultProps);

export default StyledGrid;
