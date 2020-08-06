import styled from "styled-components";
import { globalStyle, borderStyle } from "../../../utils/styles";
import { defaultProps } from "../../../default-props";
import { selectColor } from "../../../utils/colors";

const StyledNavItem = styled.div`
  ${globalStyle};
  // height: 70px;
  // width: 75px; /* width must be same size as NavBar to center */
  width="30%"text-align: center; /* Aligns <a> inside of NavIcon div */
  margin-bottom: 0; /* Puts space between NavItems */
  :hover {
    // opacity: 0.7;
    //  border-right 5px solid dimgray;
    ${(props) =>
      props.border ? props.border.hover : props.theme.navItem.border.hover};

    background-color: ${(props) =>
      selectColor(
        props.background
          ? props.background.color.hover
          : props.theme.navItem.background.color.hover,
        props.theme
      )};
    color: "white";
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
      // border-right 5px solid dimgray;
      // padding-left: 5px;
    }
  }
`;

StyledNavItem.defaultProps = {};
Object.setPrototypeOf(StyledNavItem.defaultProps, defaultProps);

export { StyledNavItem };
