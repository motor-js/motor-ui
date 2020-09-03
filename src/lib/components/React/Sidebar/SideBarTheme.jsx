import styled from "styled-components";
import { globalStyle, borderStyle } from "../../../utils/styles";
import { defaultProps } from "../../../default-props";
import { selectColor } from "../../../utils/colors";
import Box from "../Box";
import Grid from "../Grid";
import {
  TimesCircle as styledXCircle,
  Bars as styledMenu,
  Filter as styledFilter,
} from "@styled-icons/fa-solid";

const MenuHeader = styled(Box)`
  padding: 16px 0 16px 34px;
  grid-area: header;
  align-items: center;
`;

const MenuFooter = styled(Box)`
  padding: 0 1.5em 0;
  grid-area: footer;
  align-items: center;
  text-align: center;
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  z-index: ${({ isOpen }) => (isOpen ? 1050 : -1)};
  width: 100%;
  height: 100%;
  background-color:${({ overlayBackground, theme }) =>
    overlayBackground || theme.global.overlay.background};
  opacity: ${({ isOpen }) => (isOpen ? 0.5 : 0)};
  "-moz-transform": ${({ isOpen }) =>
    isOpen ? "" : "translate3d(100%, 0, 0)"};
  "-ms-transform": ${({ isOpen }) => (isOpen ? "" : "translate3d(100%, 0, 0)")};
  "-o-transform": ${({ isOpen }) => (isOpen ? "" : "translate3d(100%, 0, 0)")};
  "-webkit-transform": ${({ isOpen }) =>
    isOpen ? "" : "translate3d(100%, 0, 0)"};
  transition: ${({ isOpen }) =>
    isOpen ? "opacity 0.3s" : "opacity 0.3s, transform 0s 0.3s"};
`;

const MenuWrap = styled(Grid)`
      right: ${({ right }) => (right ? 0 : "")};
      position: absolute;
      display: grid;
      grid-template-rows:  ${({ headerHeight, footerHeight }) =>
        `${headerHeight} auto ${footerHeight}`};
      grid-template-columns: auto;
      grid-template-areas: "header" "main" "footer";
      top: 0;
      bottom: 0;
      left: ${({ right }) => (right ? "" : 0)};
      z-index:  1100;
      display: ${({ isOpen }) => !isOpen ? 'none' : null};
      width: ${({ sideBarWidth, theme }) =>
        sideBarWidth || theme.sidebar.width};
        border-radius: ${(props) =>
          props.borderRadius || props.theme.sidebar.border.radius};
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
      background-color: ${(props) =>
        selectColor(
          props.backgroundColor || props.theme.sidebar.color.background,
          props.theme
        )};
          ${(props) =>
            props.border &&
            props.border !== "none" &&
            (Array.isArray(props.border, props.theme)
              ? props.border.map((border) =>
                  borderStyle(border, props.theme, "sidebar")
                )
              : borderStyle(props.border, props.theme, "sidebar"))};
  }`;

const MenuMain = styled.div`
  ${globalStyle};

  height: 100%;
  box-sizing: border-box;
  overflow: ${({ header }) => (header ? "" : "auto")};
  padding: ${({ header }) => `${header ? "1em " : "2.5em "} 1.5em 0`};
  // padding:  0.5em 1.5em 0;
  font-size: 1.15em;
  grid-area: main;
`;

const CloseIcon = styled(styledXCircle)`
  color: ${(props) =>
    selectColor(props.theme.sidebar.color.closeIcon, props.theme)};
  padding: 8px 8px 0px 5px;
  position: absolute;
  right: 0px;
  stroke-width: 2px;
  top: 0px;
  cursor: pointer;
  &:hover {
    opacity: 0.8;
  }
`;

Overlay.defaultProps = {};
Object.setPrototypeOf(Overlay.defaultProps, defaultProps);

MenuWrap.defaultProps = {};
Object.setPrototypeOf(MenuWrap.defaultProps, defaultProps);

MenuMain.defaultProps = {};
Object.setPrototypeOf(MenuMain.defaultProps, defaultProps);

CloseIcon.defaultProps = {};
Object.setPrototypeOf(CloseIcon.defaultProps, defaultProps);

MenuHeader.defaultProps = {};
Object.setPrototypeOf(MenuHeader.defaultProps, defaultProps);

MenuFooter.defaultProps = {};
Object.setPrototypeOf(MenuFooter.defaultProps, defaultProps);

export {
  Overlay,
  MenuWrap,
  MenuMain,
  CloseIcon,
  MenuHeader,
  MenuFooter,
};
