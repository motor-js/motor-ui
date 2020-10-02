import styled, { css } from "styled-components";
import { defaultProps } from "../../../../../default-props";
import Bar from "../shapes/Bar";

// zoom Example : https://codepen.io/wifeo/pen/qzwkb

const handleBarStyle = (props) => {
  const {
    isSelected,
    theme: {
      global: { chart },
      crossHair,
    },
  } = props;

  if (isSelected === 1) {
    return css`
      ${chart.selection};
    `;
  }
  if (isSelected === 0) {
    return css`
      ${chart.nonSelection};
    `;
  }

  return css`
    &:hover {
      ${!crossHair.showVerticalLine ? chart.hover : null};
    }
  `;
};

const StyledBar = styled(Bar)`
  ${(props) => handleBarStyle(props)};
`;

StyledBar.defaultProps = {};
Object.setPrototypeOf(StyledBar.defaultProps, defaultProps);

export { StyledBar };
