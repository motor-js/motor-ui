import styled, { css } from "styled-components";
import { defaultProps } from "../../../../../default-props";
import Bar from "../shapes/Bar";

// zoom Example : https://codepen.io/wifeo/pen/qzwkb

const handleBarStyle = (props) => {
  const {
    isSelected,
    theme: { xyChart },
  } = props;

  if (isSelected === 1) {
    return css`
      ${xyChart.selection};
    `;
  }
  if (isSelected === 0) {
    return css`
      ${xyChart.nonSelection};
    `;
  }

  return css`
    &:hover {
      ${!xyChart.crossHair.showVerticalLine ? xyChart.hover : null};
    }
  `;
};

const StyledBar = styled(Bar)`
  ${(props) => handleBarStyle(props)};
`;

StyledBar.defaultProps = {};
Object.setPrototypeOf(StyledBar.defaultProps, defaultProps);

export { StyledBar };
