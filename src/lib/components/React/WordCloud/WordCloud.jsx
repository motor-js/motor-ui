import React, { useContext } from "react";
import PropTypes from "prop-types";
import { ThemeContext } from "styled-components";
import StyledWordCloud from "./StyledWordCloud";
import { ConfigContext } from "../../../contexts/ConfigProvider";
import defaultTheme from "../../../themes/defaultTheme";
import { EngineContext } from "../../../contexts/EngineProvider";
import useEngine from "../../../hooks/useEngine";

function WordCloud({ config, ...rest }) {
  const myConfig = config || useContext(ConfigContext);
  const theme = useContext(ThemeContext) || defaultTheme;
  const { engine, engineError } =
    useContext(EngineContext) || useEngine(myConfig);

  return (
    <StyledWordCloud
      engine={engine}
      theme={theme}
      engineError={engineError}
      {...rest}
    />
  );
}

const BORDER_SHAPE = PropTypes.shape({
  color: PropTypes.oneOfType([PropTypes.string]),
  side: PropTypes.oneOf([
    "top",
    "left",
    "bottom",
    "right",
    "start",
    "end",
    "horizontal",
    "vertical",
    "all",
    "between",
  ]),
  size: PropTypes.oneOfType([PropTypes.string]),
  style: PropTypes.oneOf([
    "solid",
    "dashed",
    "dotted",
    "double",
    "groove",
    "ridge",
    "inset",
    "outset",
    "hidden",
  ]),
});

WordCloud.propTypes = {
  /** Configuration object to connect to the Qlik Engine. Must include Qlik site URL and an App name */
  config: PropTypes.object,
  /** cols from Qlik Data Model to render in the WordCloud  */
  cols: PropTypes.array.isRequired,
  /** Calc condition for the chart  */
  calcCondition: PropTypes.object,
  /** Supress zeo vlaues in the the chart  */
  suppressZero: PropTypes.bool,
  /** WordCloud width */
  width: PropTypes.string,
  /** The height of the WordCloud */
  height: PropTypes.string,
  /** The amount of margin around the component */
  margin: PropTypes.string,
  /** Size of the WordCloud */
  size: PropTypes.string,
  /** Allow Selections */
  allowSelections: PropTypes.bool,
  // /** Color of the Labels on the WordCloud */
  // fontColor: PropTypes.string,
  /** Border of the Pie Chart, need desc */
  border: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.oneOf([
      "top",
      "left",
      "bottom",
      "right",
      "start",
      "end",
      "horizontal",
      "vertical",
      "all",
      "between",
      "none",
    ]),
    PropTypes.shape({
      color: PropTypes.oneOfType([PropTypes.string]),
      side: PropTypes.oneOf([
        "top",
        "left",
        "bottom",
        "right",
        "start",
        "end",
        "horizontal",
        "vertical",
        "all",
        "between",
      ]),
      size: PropTypes.oneOfType([PropTypes.string]),
      style: PropTypes.oneOf([
        "solid",
        "dashed",
        "dotted",
        "double",
        "groove",
        "ridge",
        "inset",
        "outset",
        "hidden",
      ]),
    }),
    PropTypes.arrayOf(BORDER_SHAPE),
  ]),
  /** Border Radius of the chart */
  borderRadius: PropTypes.string,
  /** Background Color of the chart */
  backgroundColor: PropTypes.string,
  /** color scheme of the chart */
  colorTheme: PropTypes.oneOfType([
    PropTypes.oneOf([
      "motor",
      "divergent9",
      "divergent13",
      "eco",
      "bio",
      "red",
      "blue",
      "gray",
      "pink",
      "grape",
      "violet",
      "indigo",
      "blue",
      "cyan",
      "teal",
      "green",
      "lime",
      "yellow",
      "orange",
      "base",
    ]),
    PropTypes.array,
  ]),
  /** RoundNum of the WordCloud */
  roundNum: PropTypes.bool,
  /** Title of the WordCloud */
  title: PropTypes.string,
  /** Sub Title of the WordCloud */
  subTitle: PropTypes.string,
  /** Error messgae to display when invalid dimension */
  dimensionErrMsg: PropTypes.string,
  /** Error messgae to display when invalid measure */
  measureErrMsg: PropTypes.string,
  /** Show values as Other */
  otherTotalSpec: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.shape({
      qOtherLabel: PropTypes.string,
      qOtherCount: PropTypes.string,
    }),
  ]),
};

WordCloud.defaultProps = {
  config: null,
  calcCondition: undefined,
  width: "100%",
  height: "100%",
  margin: "5px",
  size: "medium",
  allowSelections: null,
  border: true,
  backgroundColor: null,
  roundNum: true,
};

export default WordCloud;
