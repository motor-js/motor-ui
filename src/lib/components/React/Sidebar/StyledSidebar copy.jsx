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

  transform: ${({ open }) => (open ? "translateX(0)" : "translateX(-100%)")};
  opacity: ${({ open }) => (open ? 1 : 0)};
  transition: ${({ open }) =>
    open ? "transform 5s 5s" : "opacity 0.3s, transform 0s 0.3s"};
`;

const StyledSidebar = styled(Box)`
  ${(props) => props.collapsable && collapsableStyle}
`;

const SideBarOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 998;
  width: 100%;
  height: 100%;
  background-color: ${({ overlay }) =>
    `rgba(105,105,105, ${overlay ? 0.3 : 0.0})`};
  transform: ${({ open }) => (open ? "" : "translate3d(100%, 0, 0)")};
  opacity: ${({ open }) => (open ? 1 : 0)};
  transition: ${({ open }) =>
    open ? "opacity 0.3s" : "opacity 0.3s, transform 0s 0.3s"};
`;

// const SideBarOverlay = styled.div`
//   ${(props) => props.collapsable && overlayStyle}
// `;

StyledSidebar.defaultProps = {};
Object.setPrototypeOf(StyledSidebar.defaultProps, defaultProps);

SideBarOverlay.defaultProps = {};
Object.setPrototypeOf(SideBarOverlay.defaultProps, defaultProps);

export { StyledSidebar, SideBarOverlay };
