import React from "react";
import { TitleWrapper, Title as TitleText, SubTitle } from "./TitleTheme";
// import SmartHeading from "../../../../SmartHeading";

function Title({ title, subTitle, size }) {
  // const titleText = title.startsWith("=") ? (
  //   <SmartHeading level={4} margin="0px"></SmartHeading>
  // ) : (
  //   title
  // );
  const titleText = title;

  // const subTitleText = subTitle.startsWith("=") ? (
  //   <SmartHeading level={5} margin="0px"></SmartHeading>
  // ) : (
  //   subTitle
  // );
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
