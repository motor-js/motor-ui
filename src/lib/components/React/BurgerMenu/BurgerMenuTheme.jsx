import styled from "styled-components";
import { globalStyle } from "../../../utils/styles";
import { defaultProps } from "../../../default-props";
import { selectColor } from "../../../utils/colors";

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  z-index: : 1000 ;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  opacity: ${(state) => (state.isOpen ? 1 : 0)};
  moztransform: ${(props) => (props.isOpen ? "" : "translate3d(100%, 0, 0)")};
  mstransform: ${(props) => (props.isOpen ? "" : "translate3d(100%, 0, 0)")};
  otransform: ${(props) => (props.isOpen ? "" : "translate3d(100%, 0, 0)")};
  "-webkit-transform": ${(props) =>
    props.isOpen ? "" : "translate3d(100%, 0, 0)"};
  transform: ${(props) => (props.isOpen ? "" : "translate3d(100%, 0, 0)")};
  transition: ${(props) =>
    props.isOpen ? "opacity 0.3s" : "opacity 0.3s, transform 0s 0.3s"};
`;

const ButtonWrapper = styled.button`
  ${globalStyle};
  cursor: pointer;
    "-webkit-user-select": "none",
    "-khtml-user-select": "none",
    "-moz-user-select": "none",
    "-ms-user-select": "none",
    "user-select": "none",
  max-width: width;
  position: relative;
  margin: ${(props) => props.margin || props.theme.button.margin};
  display: ${(props) => (props.block ? "block" : null)};
  font-weight: ${(props) => props.theme.button.fontWeight};
  background-color: ${(props) =>
    selectColor(props.color || props.theme.button.color, props.theme)};

  border-radius: ${(props) => props.borderRadius || props.theme.button.radius};
  color: ${(props) =>
    selectColor(props.fontColor || props.theme.button.fontColor, props.theme)};
  border: ${(props) => props.border || props.theme.button.border};
  outline: ${(props) => props.outline || props.theme.button.outline};
  transition: ${(props) => props.transition || props.theme.button.transition};
  padding: ${(props) => props.theme.button.padding};
  &:hover {
    box-shadow: ${(props) =>
      props.hoverBoxShadow || props.theme.button.hover.boxShadow};
    border: ${(props) => props.hoverBorder || props.theme.button.hover.border};
    background: ${(props) =>
      props.hoverBackground || props.theme.button.hover.background};
  }
  &:active {
    transform: ${(props) =>
      props.activeTransform || props.theme.button.active.transform};
    background-color: ${(props) =>
      props.activeBackgroundColor || props.theme.button.active.backgroundColor};
    background-size: ${(props) =>
      props.activeBackgroundSize || props.theme.button.active.backgroundSize};
    transition: ${(props) =>
      props.activeTransition || props.theme.button.active.transition};
  }
`;
ButtonWrapper.defaultProps = {};
Object.setPrototypeOf(ButtonWrapper.defaultProps, defaultProps);
// Overlay.defaultProps = {};
// Object.setPrototypeOf(Overlay.defaultProps, defaultProps);

export { Overlay };
