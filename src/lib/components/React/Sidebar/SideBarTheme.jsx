import styled from "styled-components";
import { globalStyle } from "../../../utils/styles";
import { defaultProps } from "../../../default-props";
import { selectColor } from "../../../utils/colors";
// import { globalStyle, borderStyle } from "../../../utils/styles";

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1000;
  width: 100%;
  height: 100%;
  background-color:${({ overlayBackground, theme }) =>
    overlayBackground || theme.global.overlay.background};
  opacity: ${({ isOpen }) => (isOpen ? 1 : 0)};
  "-moz-transform": ${({ isOpen }) =>
    isOpen ? "" : "translate3d(100%, 0, 0)"};
  "-ms-transform": ${({ isOpen }) => (isOpen ? "" : "translate3d(100%, 0, 0)")};
  "-o-transform": ${({ isOpen }) => (isOpen ? "" : "translate3d(100%, 0, 0)")};
  "-webkit-transform": ${({ isOpen }) =>
    isOpen ? "" : "translate3d(100%, 0, 0)"};
  transition: ${({ isOpen }) =>
    isOpen ? "opacity 0.3s" : "opacity 0.3s, transform 0s 0.3s"};
`;

const MenuWrap = styled.div`
      // position: 'fixed';
      right: ${({ right }) => (right ? 0 : "")};
      position: absolute;
      // display: isOpen ? "block" : "none";
      top: 0;
      bottom: 0;
      left: ${({ right }) => (right ? "" : 0)};
      z-index:  1100;
      width: ${({ sideBarWidth, theme }) =>
        sideBarWidth || theme.sidebar.width};
      height: 100%;
      // opacity: isOpen ? 1 : 0;
      "-moz-transform": ${({ isOpen, right }) =>
        isOpen
          ? ""
          : right
          ? "translate3d(100%, 0, 0)"
          : "translate3d(-100%, 0, 0)"};
      "-ms-transform": ${({ isOpen, right }) =>
        isOpen
          ? ""
          : right
          ? "translate3d(100%, 0, 0)"
          : "translate3d(-100%, 0, 0)"};
      "-o-transform": ${({ isOpen, right }) =>
        isOpen
          ? ""
          : right
          ? "translate3d(100%, 0, 0)"
          : "translate3d(-100%, 0, 0)"};
      "-webkit-transform":  ${({ isOpen, right }) =>
        isOpen
          ? ""
          : right
          ? "translate3d(100%, 0, 0)"
          : "translate3d(-100%, 0, 0)"};
      transform: ${({ isOpen, right }) =>
        isOpen
          ? ""
          : right
          ? "translate3d(100%, 0, 0)"
          : "translate3d(-100%, 0, 0)"};
      transition: all 0.5s;
    };
  }`;

const MenuMain = styled.div`
  ${globalStyle};
  height: 100%;
  boxsizing: border-box;
  overflow: auto;
  background: #373a47;
  padding: 2.5em 1.5em 0;
  font-size: 1.15em;
`;

const ItemList = styled.nav`
  height: 100%;
  color: #b8b7ad;
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

Overlay.defaultProps = {};
Object.setPrototypeOf(Overlay.defaultProps, defaultProps);

MenuWrap.defaultProps = {};
Object.setPrototypeOf(MenuWrap.defaultProps, defaultProps);

MenuMain.defaultProps = {};
Object.setPrototypeOf(MenuMain.defaultProps, defaultProps);

ItemList.defaultProps = {};
Object.setPrototypeOf(ItemList.defaultProps, defaultProps);

export { Overlay, MenuWrap, MenuMain, ItemList };
