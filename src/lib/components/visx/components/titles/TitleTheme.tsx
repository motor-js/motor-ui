import styled from "styled-components";
import { defaultProps } from "../../../../default-props";
import { globalStyle, borderStyle } from "../../../../utils";
import { selectColor } from "../../../../utils";
// import { Text } from "@visx/text";

export type GlobalTheme = {
  global: {
    chart: {
      titles: { title: { fontSize: string }; subTitle: { fontSize: string } };
    };
  };
};

const TitleWrapper = styled.div`
  ${globalStyle};
  display: ${(props: any) => props.theme.global.chart.titles.wrapper.display};
  flex-direction: ${(props: any) =>
    props.theme.global.chart.titles.wrapper.flexDirection};
  -webkit-box-pack: ${(props: any) =>
    props.theme.global.chart.titles.wrapper.webkitBoxPack};
  justify-content: ${(props: any) =>
    props.theme.global.chart.titles.wrapper.justifyContent};
  max-height: ${(props: any) =>
    props.theme.global.chart.titles.wrapper.maxHeight};
  background-color: ${(props: any) =>
    props.theme.global.chart.titles.wrapper.backgroundColor};
  margin: ${(props: any) => props.theme.global.chart.titles.wrapper.margin};
  padding: ${(props: any) => props.theme.global.chart.titles.wrapper.padding};
  margin-bottom: ${(props: any) =>
    props.theme.global.chart.titles.wrapper.marginBottom};
  border-radius: ${(props: any) =>
    props.borderRadius ||
    `${props.theme.global.chart.wrapper.borderRadius}
     ${props.theme.global.chart.wrapper.borderRadius}
     0px
     0px`};
`;

const Title = styled.h4`
  ${globalStyle};
  color: ${(props: any) =>
    selectColor(
      props.color || props.theme.global.chart.titles.title.color,
      props.theme
    )};
  font-size: ${({ size, theme }: { size: number; theme: GlobalTheme }) =>
    theme.global.chart.titles.title.fontSize[size]};
  margin: ${(props: any) => props.margin};
`;

const SubTitle = styled.h5`
  ${globalStyle};
  color: ${(props: any) =>
    selectColor(
      props.color || props.theme.global.chart.titles.subTitle.color,
      props.theme
    )};
  font-size: ${({ size, theme }: { size: number; theme: GlobalTheme }) =>
    theme.global.chart.titles.subTitle.fontSize[size]};
  // font-weight: ${(props: any) => props.fontWeight};
  margin: ${(props: any) => props.margin};
`;

TitleWrapper.defaultProps = {};
Object.setPrototypeOf(TitleWrapper.defaultProps, defaultProps);

Title.defaultProps = {};
Object.setPrototypeOf(Title.defaultProps, defaultProps);

SubTitle.defaultProps = {};
Object.setPrototypeOf(SubTitle.defaultProps, defaultProps);

export { TitleWrapper, Title, SubTitle };
