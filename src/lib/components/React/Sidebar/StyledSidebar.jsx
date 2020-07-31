import styled, { css } from "styled-components";
import { defaultProps } from "../../../default-props";
import Box from "../Box";

const collapsableStyle = css`
  position: absolute;
  top: 0;
  bottom: 0;
  left: ${({ pullRight }) => (pullRight ? null : 0)};
  right: ${({ pullRight }) => (pullRight ? 0 : null)};
  z-index: 999;
  width:  ${(props) => props.width} 
  transition: transform 0.3s ease-in-out;
  transform: ${({ open }) => (open ? "translateX(0)" : "translateX(-100%)")};
  display: ${({ open }) => (open ? "flex" : "none")};
`;

const StyledSidebar = styled(Box)`
  ${(props) => props.collapsable && collapsableStyle}
`;

StyledSidebar.defaultProps = {};
Object.setPrototypeOf(StyledSidebar.defaultProps, defaultProps);

export default StyledSidebar;
