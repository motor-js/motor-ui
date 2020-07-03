import React, { useContext } from "react";
import PropTypes from "prop-types";
import { ThemeContext } from "styled-components";
import StyledBar from "./StyledBar";
import { ConfigContext } from "../../../contexts/ConfigProvider";
import defaultTheme from "../../../themes/defaultTheme";
import { EngineContext } from "../../../contexts/EngineProvider";
import useEngine from "../../../hooks/useEngine";

function Bar({ config, ...rest }) {
  const myConfig = config || useContext(ConfigContext);
  const theme = useContext(ThemeContext) || defaultTheme;
  const { engine, engineError } =
    useContext(EngineContext) || useEngine(myConfig);

  return (
    <StyledBar
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

Bar.propTypes = {
  /** Configuration object to connect to the Qlik Engine. Must include Qlik site URL and an App name */
  config: PropTypes.object,
  /** cols from Qlik Data Model to render in the Bar  */
  cols: PropTypes.array.isRequired,
  /** Calc condition for the chart  */
  calcCondition: PropTypes.shape({
    qCond: PropTypes.string,
    qMsg: PropTypes.string,
  }),
  /** Supress zeo vlaues in the the chart  */
  suppressZero: PropTypes.bool,
  /** Bar Sort Order */
  columnSortOrder: PropTypes.array,
  /** Sort Ascending or descending */
  sortDirection: PropTypes.string,
  /** Bar width */
  width: PropTypes.string,
  /** The height of the Bar */
  height: PropTypes.string,
  /** The amount of margin around the component */
  margin: PropTypes.string,
  /** Size of the Bar */
  size: PropTypes.oneOf(["tiny", "small", "medium", "large", "xlarge"]),
  /** Size of the Bar */
  showLabels: PropTypes.oneOf(["top", "none", "inside"]),
  /** Show text on Axis */
  textOnAxis: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.oneOf(["both", "yAxis", "xAxis", "none"]),
  ]),
  /** Spacing of Ticks on Y Axis */
  tickSpacing: PropTypes.oneOf(["wide", "normal", "narrow"]),
  /** Display Axis and ticks  */
  showAxis: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.oneOf(["both", "yAxis", "xAxis", "none"]),
  ]),
  /** Max length of chart axis (in pixels) */
  maxAxisLength: PropTypes.number,
  /** Allow for the Y axis to be dsiapleyd at 45 degrees */
  allowSlantedYAxis: PropTypes.bool,
  /** Show gridlines on Axis */
  showGridlines: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.oneOf(["solid", "dashes", "dots", "none"]),
  ]),
  /** Color of the Bar label */
  fontColor: PropTypes.string,
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
  /** Background Color of the chart */
  backgroundColor: PropTypes.string,
  /** color scheme of the chart */
  chartColor: PropTypes.oneOfType([
    PropTypes.oneOf([
      "divergent13",
      "divergent9",
      "goya",
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
  /** Stacked Chart  */
  stacked: PropTypes.bool,
  /** Stacked Chart  */
  percentStacked: PropTypes.bool,
  /** RoundNum of the Bar */
  roundNum: PropTypes.bool,
  /** Title of the Bar */
  title: PropTypes.string,
  /** Sub Title of the Bar */
  subTitle: PropTypes.string,
  /** Legend of the Bar */
  showLegend: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.oneOf(["right", "bottom"]),
  ]),
  /** Allow Selections */
  allowSelections: PropTypes.bool,
  /** Maximum Width of the Bar */
  maxWidth: PropTypes.number,
  /** Force supression of Scroll / Overview chart */
  suppressScroll: PropTypes.bool,
  // /** Allow for bushes to be resized on chart */
  // allowZoom: PropTypes.bool, // Descoped to later version
  // /** Ratio of the size 0f the scroll bar (Range 0 - 1) */
  // scrollRatio: PropTypes.number, // Descoped to later version
  /** Pddding for each bar */
  barPadding: PropTypes.number,
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

Bar.defaultProps = {
  config: null,
  calcCondition: undefined,
  width: "100%",
  height: "100%",
  margin: "5px",
  size: "medium",
  fontColor: "",
  border: true,
  allowSelections: true,
  showAxis: undefined,
  allowSlantedYAxis: undefined,
  showGridlines: undefined,
  textOnAxis: undefined,
  tickSpacing: undefined,
  backgroundColor: null,
  roundNum: true,
  columnSortOrder: [],
  sortDirection: "",
  stacked: false,
  percentStacked: false,
};

export default Bar;
