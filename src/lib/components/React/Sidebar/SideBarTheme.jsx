import styled from "styled-components";
import { globalStyle } from "../../../utils/styles";
import { defaultProps } from "../../../default-props";
import { selectColor } from "../../../utils/colors";
import {
  XCircle as styledXCircle,
  Menu as styledMenu,
  Filter as styledFilter,
} from "@styled-icons/feather";

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

const BurgerButton = styled.div`
  position: fixed;
  width: 36px;
  height: 30px;
  left: 36px;
  top: 36px;
  zindex: 1000;
  position: absolute;
  top: 10px;
  right: 10px;
`;

const CloseIcon = styled(styledXCircle)`
  color: ${(props) =>
    selectColor(props.theme.sidebar.color.closeIcon, props.theme)};
  padding: 8px 8px 0px 5px;
  position: absolute;
  right: 0px;
  top: 0px;
  cursor: pointer;
  &:hover {
    opacity: 0.8;
  }
`;

const MenuIcon = styled(styledMenu)`
  color: ${(props) =>
    selectColor(props.theme.sidebar.color.openIcon, props.theme)};
  position: absolute;
  z-index: 1000;
  left: 10px;
  top: 10px;
  // width: 10%;
  // height: 10%;
  margin: 0px;
  padding: 0px;
  border: none;
  font-size: 0px;
  background: transparent;
  cursor: pointer;
  &:hover {
    opacity: 0.8;
    cursor: pointer;
  }
`;

const FilterIcon = styled(styledFilter)`
  color: ${(props) =>
    selectColor(props.theme.sidebar.color.openIcon, props.theme)};
  position: absolute;
  z-index: 1000;
  left: 10px;
  top: 10px;
  // width: 10%;
  // height: 10%;
  margin: 0px;
  padding: 0px;
  border: none;
  font-size: 0px;
  background: transparent;
  cursor: pointer;
  &:hover {
    opacity: 0.8;
    cursor: pointer;
  }
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

BurgerButton.defaultProps = {};
Object.setPrototypeOf(BurgerButton.defaultProps, defaultProps);

CloseIcon.defaultProps = {};
Object.setPrototypeOf(CloseIcon.defaultProps, defaultProps);

MenuIcon.defaultProps = {};
Object.setPrototypeOf(MenuIcon.defaultProps, defaultProps);

FilterIcon.defaultProps = {};
Object.setPrototypeOf(FilterIcon.defaultProps, defaultProps);

export {
  Overlay,
  MenuWrap,
  MenuMain,
  ItemList,
  BurgerButton,
  CloseIcon,
  MenuIcon,
  FilterIcon,
};
