import React, { useContext } from "react";
import { TitleWrapper, Title as TitleText, SubTitle } from "./TitleTheme";
import SmartHeading from "../../../../SmartHeading";

function Title({ title, subTitle }) {
  const titleText =
    typeof title === "string" && title.charAt(0) === "=" ? (
      <SmartHeading level={4}></SmartHeading>
    ) : (
      title
    );

  const subTitleText =
    typeof subTitle === "string" && subTitle.charAt(0) === "=" ? (
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
