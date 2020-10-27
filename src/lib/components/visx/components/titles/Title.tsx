import React from "react";
import { TitleWrapper, Title as TitleText, SubTitle } from "./TitleTheme";
// import SmartHeading from "../../../../SmartHeading";

type Props = {
  title?: string;
  subTitle?: string;
  size?: string;
};

function Title(props: Props) {
  const { title, subTitle, size } = props;
  const titleText = title;
  const subTitleText = subTitle;

  return (
    <TitleWrapper>
      <TitleText size={size}>{titleText}</TitleText>
      <SubTitle size={size}>{subTitleText}</SubTitle>
    </TitleWrapper>
  );
}

TitleText.defaultProps = {
  margin: "0px",
};

SubTitle.defaultProps = {
  margin: "0px",
};

export default Title;
