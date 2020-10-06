import styled from "styled-components";
import { globalStyle } from "../../utils/styles";
import { defaultProps } from "../../default-props";
import { selectColor } from "../../utils/colors";

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
  &:disabled {
  color: ${(props) =>
    selectColor(
      props.disabledFontColor || props.theme.button.disabled.fontColor,
      props.theme
    )};
        background-color: ${(props) =>
          props.disabledBackground ||
          props.theme.button.disabled.backgroundColor};
       border: ${(props) =>
         props.disabledBorder || props.theme.button.disabled.border};
           box-shadow: ${(props) =>
             props.disabledBoxShadow || props.theme.button.disabled.boxShadow};
        cursor: default;
}
`;
ButtonWrapper.defaultProps = {};
Object.setPrototypeOf(ButtonWrapper.defaultProps, defaultProps);

export { ButtonWrapper };
