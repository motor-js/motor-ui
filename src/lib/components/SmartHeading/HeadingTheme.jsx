import styled from "styled-components";
import { globalStyle } from "../../../utils/styles";
import { defaultProps } from "../../../default-props";
import { selectColor } from "../../../utils/colors";

const StyledHeading = styled.h1`
  ${globalStyle};
  color: ${(props) =>
    selectColor(props.color || props.theme.smartHeading.color, props.theme)};
  font-size: ${(props) => props.size};
  font-weight: ${(props) => props.fontWeight};
  margin: ${(props) => props.margin};
`;

StyledHeading.defaultProps = {};
Object.setPrototypeOf(StyledHeading.defaultProps, defaultProps);

export { StyledHeading };
