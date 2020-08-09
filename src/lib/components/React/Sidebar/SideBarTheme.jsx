import styled from "styled-components";
import { globalStyle, borderStyle } from "../../../utils/styles";
import { defaultProps } from "../../../default-props";
import { selectColor } from "../../../utils/colors";
import Box from "../Box";
import {
  XCircle as styledXCircle,
  Menu as styledMenu,
  Filter as styledFilter,
} from "@styled-icons/feather";

// import { globalStyle, borderStyle } from "../../../utils/styles";

const MenuHeader = styled(Box)`
  position: absolute;
  top: 10px;
  left: 0;
  padding: 16px 0 16px 34px;
  width: 100%;
  margin: 0 0 16px 0;
`;

const MenuFooter = styled(Box)`
  position: absolute;
  bottom: 0;
  left: 0;
  padding: 16px 0px 16px 34px;
  // width: 229px;
  width: 100%;
  // margin: 0 0px 16px 34px;
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  z-index: ${({ isOpen }) => (isOpen ? 1050 : 999)};
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
  ${(props) =>
    props.border &&
    props.border !== "none" &&
    (Array.isArray(props.border, props.theme)
      ? props.border.map((border) =>
          borderStyle(border, props.theme, "sidebar")
        )
      : borderStyle(props.border, props.theme, "sidebar"))};
  height: 100%;
  box-sizing: border-box;
  overflow: ${({ header }) => (header ? "" : "auto")};
  padding: ${({ header }) => `${header ? "4em " : "2.5em "} 1.5em 0`};
  font-size: 1.15em;
  background-color: ${(props) =>
    selectColor(
      props.backgroundColor || props.theme.sidebar.color.background,
      props.theme
    )};

  border-radius: ${(props) =>
    props.borderRadius || props.theme.sidebar.border.radius};
`;

const ItemList = styled.nav`
  height: 100%;
  color: #b8b7ad;
`;

// const BurgerButton = styled.div`
//   position: fixed;
//   width: 36px;
//   height: 30px;
//   left: 36px;
//   top: 36px;
//   zindex: 1000;
//   position: absolute;
//   top: 10px;
//   right: 10px;
// `;

const CloseIcon = styled(styledXCircle)`
  color: ${(props) =>
    selectColor(props.theme.sidebar.color.closeIcon, props.theme)};
  padding: 8px 8px 0px 5px;
  position: absolute;
  right: 0px;
  // left: ${({ right }) => (right ? "10px" : "")};
  // right: ${({ right }) => (right ? "" : "10px")};
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
  right: ${({ right }) => (right ? "10px" : "")};
  left: ${({ right }) => (right ? "" : "10px")};
  top: 10px;
  margin: 0px;
  padding: 0px;
  border: none;
  font-size: 0px;
  background: transparent;
  cursor: pointer;
  &:hover {
    opacity: 0.6;
  }
`;

const FilterIcon = styled(styledFilter)`
  color: ${(props) =>
    selectColor(props.theme.sidebar.color.openIcon, props.theme)};
  position: absolute;
  z-index: 1001;
  right: ${({ right }) => (right ? "10px" : "")};
  left: ${({ right }) => (right ? "" : "10px")};
  top: 10px;
  margin: 0px;
  padding: 0px;
  border: none;
  font-size: 0px;
  background: transparent;
  cursor: pointer;
  &:hover {
    opacity: 0.6;
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

// BurgerButton.defaultProps = {};
// Object.setPrototypeOf(BurgerButton.defaultProps, defaultProps);

CloseIcon.defaultProps = {};
Object.setPrototypeOf(CloseIcon.defaultProps, defaultProps);

MenuIcon.defaultProps = {};
Object.setPrototypeOf(MenuIcon.defaultProps, defaultProps);

FilterIcon.defaultProps = {};
Object.setPrototypeOf(FilterIcon.defaultProps, defaultProps);

MenuHeader.defaultProps = {};
Object.setPrototypeOf(MenuHeader.defaultProps, defaultProps);

MenuFooter.defaultProps = {};
Object.setPrototypeOf(MenuFooter.defaultProps, defaultProps);

export {
  Overlay,
  MenuWrap,
  MenuMain,
  ItemList,
  // BurgerButton,
  CloseIcon,
  MenuIcon,
  FilterIcon,
  MenuHeader,
  MenuFooter,
};
