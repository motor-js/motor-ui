import styled from "styled-components";
import { defaultProps } from "../../../../../../default-props";
import { selectColor, globalStyle } from "../../../../../../utils";

const TitleWrapper = styled.div`
  ${globalStyle};
  display: flex;
  flex-direction: column;
  -webkit-box-pack: justify;
  justify-content: space-between;
  max-height: 50px;
  background-color: rgb(247, 247, 247);
  margin: -16px -16px 0px;
  padding: 15px 16px 16px;
  margin-bottom: 10px;
`;

const Title = styled.h4`
  ${globalStyle};
  color: ${(props) =>
    selectColor(
      props.color || props.theme.xyChart.subtitle.color,
      props.theme
    )};
  font-size: ${(props) => props.size};
  font-weight: ${(props) => props.fontWeight};
  margin: ${(props) => props.margin};
`;

const SubTitle = styled.h5`
  ${globalStyle};
  color: ${(props) =>
    selectColor(
      props.color || props.theme.xyChart.subtitle.color,
      props.theme
    )};
  font-size: ${(props) => props.size};
  font-weight: ${(props) => props.fontWeight};
  margin: ${(props) => props.margin};
`;

TitleWrapper.defaultProps = {};
Object.setPrototypeOf(TitleWrapper.defaultProps, defaultProps);

Title.defaultProps = {};
Object.setPrototypeOf(Title.defaultProps, defaultProps);

SubTitle.defaultProps = {};
Object.setPrototypeOf(SubTitle.defaultProps, defaultProps);

export { TitleWrapper, Title, SubTitle };
