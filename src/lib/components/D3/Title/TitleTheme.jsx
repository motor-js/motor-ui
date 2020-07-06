import screenSize from "../../../hooks/useScreenSize";

function TitleTheme(theme, responsive, size) {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { global, title } = theme;

  // global settings (cannot be overridden by filter)
  const { fontFamily } = global;

  // grab the screen size
  const { screen } = screenSize();

  const sizing = global.deviceBreakpoints[screen];

  // font size
  let fontSizeTitle;
  responsive
    ? (fontSizeTitle = global.size.title[sizing])
    : (fontSizeTitle = global.size.title[size]);

  let fontSizeSubTitle;
  responsive
    ? (fontSizeSubTitle = global.size.subTitle[sizing])
    : (fontSizeSubTitle = global.size.subTitle[size]);

  let textAnchor;
  switch (title.textPostion) {
    case "left":
      textAnchor = "start";
      break;
    case "middle":
      textAnchor = "middle";
      break;
    default:
      textAnchor = "middle";
  }

  const TitleStyle = {
    "text-anchor": textAnchor,
    "font-size": fontSizeTitle,
    "font-weight": title.main.fontWeight,
    fill: title.main.fontColor,
    padding: title.main.padding,
    "-webkit-user-select": "none",
    "-khtml-user-select": "none",
    "-moz-user-select": "none",
    "-ms-user-select": "none",
    "user-select": "none",
  };

  const SubTitleStyle = {
    "text-anchor": textAnchor,
    "font-size": fontSizeSubTitle,
    fill: title.sub.fontColor,
    padding: title.sub.padding,
    opacity: title.sub.opacity,
    "-webkit-user-select": "none",
    "-khtml-user-select": "none",
    "-moz-user-select": "none",
    "-ms-user-select": "none",
    "user-select": "none",
  };

  const TitleThemes = {
    TitleStyle,
    SubTitleStyle,
  };

  return { TitleThemes };
}

export default TitleTheme;
