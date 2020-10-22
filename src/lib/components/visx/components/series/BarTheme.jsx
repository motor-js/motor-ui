import styled, { css } from "styled-components";
import { defaultProps } from "../../../../default-props";
import Bar from "../shapes/Bar";

// zoom Example : https://codepen.io/wifeo/pen/qzwkb

const handleBarStyle = (props) => {
  const {
    isSelected,
    noSelections,
    theme: {
      global: { chart },
    },
  } = props;

  if (noSelections) {
    return css`
      &:hover {
        ${chart.hover};
      }
    `;
  }

  return css`
    ${isSelected ? chart.selection : chart.nonSelection}
  `;
};

const StyledBar = styled(Bar)`
  ${(props) => handleBarStyle(props)};
`;

StyledBar.defaultProps = {};
Object.setPrototypeOf(StyledBar.defaultProps, defaultProps);

export { StyledBar };
