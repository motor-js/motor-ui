import styled from "styled-components";
import { defaultProps } from "../../../../default-props";
import { globalStyle, borderStyle } from "../../../../utils";
import { selectColor } from "../../../../utils";
import { Text } from "@visx/text";

const TitleWrapper = styled.div`
  ${globalStyle};
  display: ${(props) => props.theme.global.chart.titles.wrapper.display};
  flex-direction: ${(props) =>
    props.theme.global.chart.titles.wrapper.flexDirection};
  -webkit-box-pack: ${(props) =>
    props.theme.global.chart.titles.wrapper.webkitBoxPack};
  justify-content: ${(props) =>
    props.theme.global.chart.titles.wrapper.justifyContent};
  max-height: ${(props) => props.theme.global.chart.titles.wrapper.maxHeight};
  background-color: ${(props) =>
    props.theme.global.chart.titles.wrapper.backgroundColor};
  margin: ${(props) => props.theme.global.chart.titles.wrapper.margin};
  padding: ${(props) => props.theme.global.chart.titles.wrapper.padding};
  margin-bottom: ${(props) =>
    props.theme.global.chart.titles.wrapper.marginBottom};
  border-radius: ${(props) =>
    props.borderRadius ||
    `${props.theme.global.chart.wrapper.borderRadius}
     ${props.theme.global.chart.wrapper.borderRadius}
     0px
     0px`};
`;

const Title = styled.h4`
  ${globalStyle};
  color: ${(props) =>
    selectColor(
      props.color || props.theme.global.chart.titles.title.color,
      props.theme
    )};
  font-size: ${({ size, theme }) =>
    theme.global.chart.titles.title.fontSize[size]};
  // font-weight: ${(props) => props.fontWeight};
  margin: ${(props) => props.margin};
`;

const SubTitle = styled.h5`
  ${globalStyle};
  color: ${(props) =>
    selectColor(
      props.color || props.theme.global.chart.titles.subTitle.color,
      props.theme
    )};
  font-size: ${({ size, theme }) =>
    theme.global.chart.titles.subTitle.fontSize[size]};
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
