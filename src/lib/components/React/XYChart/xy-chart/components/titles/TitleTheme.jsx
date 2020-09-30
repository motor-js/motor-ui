import styled from "styled-components";
import { defaultProps } from "../../../../../../default-props";
import { globalStyle, borderStyle } from "../../../../../../utils";
import { selectColor } from "../../../../../../utils";
import { Text } from "@visx/text";

const TitleWrapper = styled.div`
  ${globalStyle};
  display: ${(props) => props.theme.xyChart.titles.wrapper.display};
  flex-direction: ${(props) =>
    props.theme.xyChart.titles.wrapper.flexDirection};
  -webkit-box-pack: ${(props) =>
    props.theme.xyChart.titles.wrapper.webkitBoxPack};
  justify-content: ${(props) =>
    props.theme.xyChart.titles.wrapper.justifyContent};
  max-height: ${(props) => props.theme.xyChart.titles.wrapper.maxHeight};
  background-color: ${(props) =>
    props.theme.xyChart.titles.wrapper.backgroundColor};
  margin: ${(props) => props.theme.xyChart.titles.wrapper.margin};
  padding: ${(props) => props.theme.xyChart.titles.wrapper.padding};
  margin-bottom: ${(props) => props.theme.xyChart.titles.wrapper.marginBottom};
`;

const Title = styled.h4`
  ${globalStyle};
  color: ${(props) =>
    selectColor(
      props.color || props.theme.xyChart.titles.title.color,
      props.theme
    )};
  font-size: ${({ size, theme }) => theme.xyChart.titles.title.fontSize[size]};
  // font-weight: ${(props) => props.fontWeight};
  margin: ${(props) => props.margin};
`;

const SubTitle = styled.h5`
  ${globalStyle};
  color: ${(props) =>
    selectColor(
      props.color || props.theme.xyChart.titles.subTitle.color,
      props.theme
    )};
    font-size: ${({ size, theme }) =>
      theme.xyChart.titles.subTitle.fontSize[size]};
  // font-weight: ${(props) => props.fontWeight};
  margin: ${(props) => props.margin};
`;

TitleWrapper.defaultProps = {};
Object.setPrototypeOf(TitleWrapper.defaultProps, defaultProps);

Title.defaultProps = {};
Object.setPrototypeOf(Title.defaultProps, defaultProps);

SubTitle.defaultProps = {};
Object.setPrototypeOf(SubTitle.defaultProps, defaultProps);

export { TitleWrapper, Title, SubTitle };
