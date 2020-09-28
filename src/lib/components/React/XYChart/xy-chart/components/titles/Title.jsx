import React from "react";
import { TitleWrapper, Title as TitleText, SubTitle } from "./TitleTheme";
import SmartHeading from "../../../../SmartHeading";

function Title({ title, subTitle }) {
  const titleText = title.startsWith("=") ? (
    <SmartHeading level={4} margin="0px"></SmartHeading>
  ) : (
    title
  );

  const subTitleText = subTitle.startsWith("=") ? (
    <SmartHeading level={5} margin="0px"></SmartHeading>
  ) : (
    subTitle
  );

  return (
    <TitleWrapper>
      <TitleText>{titleText}</TitleText>
      <SubTitle>{subTitleText}</SubTitle>
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
