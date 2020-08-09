import styled from "styled-components";
import { globalStyle, borderStyle } from "../../../utils/styles";
import { defaultProps } from "../../../default-props";
import { selectColor } from "../../../utils/colors";

// size to be added
// bordre to be added
const StyledNavItem = styled.div`
  ${globalStyle};
  ${(props) =>
    props.border &&
    props.border !== "none" &&
    (Array.isArray(props.border, props.theme)
      ? props.border.map((border) =>
          borderStyle(border, props.theme, "navitem")
        )
      : borderStyle(props.border, props.theme, "navitem"))};
  text-align: ${(props) => props.textAlign || props.theme.navItem.textAlign};
  margin-bottom: 0; /* Puts space between NavItems */
  :hover {
    ${(props) =>
      props.border ? props.border.hover : props.theme.navItem.border.hover};

    background-color: ${(props) =>
      selectColor(
        props.background
          ? props.background.color.hover
          : props.theme.navItem.background.color.hover,
        props.theme
      )};
    color: white;
  }
  :focus {
    color: red;
  }
  a {
    color: ${(props) =>
      props.active
        ? selectColor(
            props.color ? props.color.active : props.theme.navItem.color.active,
            props.theme
          )
        : selectColor(
            props.color
              ? props.color.inactive
              : props.theme.navItem.color.inactive,
            props.theme
          )};
    text-decoration: none; /* Gets rid of underlining of text */
    :hover {
      opacity: 0.7;
    }
  }
`;

StyledNavItem.defaultProps = {};
Object.setPrototypeOf(StyledNavItem.defaultProps, defaultProps);

export { StyledNavItem };
