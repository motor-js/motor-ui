import React, { useContext } from "react";
import PropTypes from "prop-types";
import { ThemeContext } from "styled-components";
import StyledLine from "./StyledLine";
import { ConfigContext } from "../../../contexts/ConfigProvider";
import defaultTheme from "../../../themes/defaultTheme";
import { EngineContext } from "../../../contexts/EngineProvider";
import useEngine from "../../../hooks/useEngine";

function Line({ config, ...rest }) {
  const myConfig = config || useContext(ConfigContext);
  const theme = useContext(ThemeContext) || defaultTheme;
  const { engine, engineError } =
    useContext(EngineContext) || useEngine(myConfig);

  return (
    <StyledLine
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

Line.propTypes = {
  /** Configuration object to connect to the Qlik Engine. Must include Qlik site URL and an App name */
  config: PropTypes.object,
  /** cols from Qlik Data Model to render in the Line  */
  cols: PropTypes.array.isRequired,
  /** Calc condition for the chart  */
  calcCondition: PropTypes.object,
  /** Supress zeo values in the the chart  */
  suppressZero: PropTypes.bool,
  /** Use dual Y axis on the the chart  */
  dualAxis: PropTypes.bool,
  /** Line Sort Order */
  columnSortOrder: PropTypes.array,
  /** Sort Ascending or descending */
  sortDirection: PropTypes.string,
  /** Line width */
  width: PropTypes.string,
  /** The height of the Line */
  height: PropTypes.string,
  /** The amount of margin around the component */
  margin: PropTypes.string,
  /** Size of the Line */
  size: PropTypes.oneOf(["tiny", "small", "medium", "large", "xlarge"]),
  /** Labels on markers of the Lines */
  showLabels: PropTypes.oneOf(["top", "none"]),
  /** Show text on Axis */
  textOnAxis: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.oneOf(["both", "yAxis", "xAxis", "none"]),
  ]),
  /** Spacing of Ticks on Y Axis */
  tickSpacing: PropTypes.oneOf(["wide", "normal", "narrow"]),
  /** Show gridlines on Axis */
  showGridlines: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.oneOf(["solid", "dashes", "dots", "none"]),
  ]),
  /** Fontcolor of the Line labels */
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
  /** Shape of the curve for the chart */
  curve: PropTypes.oneOf([
    "Linear",
    "Basis",
    "Bundle",
    "Cardinal",
    "CatmullRom",
    "MonotoneX",
    "MonotoneY",
    "Natural",
    "Step",
    "StepAfter",
    "StepBefore",
    "BasisClosed",
  ]),
  /** Shape of the symbol to be used on the line */
  symbol: PropTypes.oneOf([
    "circle",
    "cross",
    "diamond",
    "square",
    "star",
    "triangle",
    "wye",
    "none",
  ]),
  /** RoundNum of the Line */
  roundNum: PropTypes.bool,
  /** Title of the Line */
  title: PropTypes.string,
  /** Sub Title of the Line */
  subTitle: PropTypes.string,
  /** Legend of the Line */
  showLegend: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.oneOf(["right", "bottom"]),
  ]) /** Allow Selections */,
  allowSelections: PropTypes.bool,
  /** Display Axis and ticks  */
  showAxis: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.oneOf(["both", "yAxis", "xAxis", "none"]),
  ]),
  /** Max length of chart axis (in pixels) */
  maxAxisLength: PropTypes.number,
  /** Display chart as Area chart */
  areaChart: PropTypes.bool,
  /** Display chart as Stacked Area chart */
  stacked: PropTypes.bool,
  /** Force supression of Scroll / Overview chart */
  suppressScroll: PropTypes.bool,
  // /** Allow for bushes to be resized on chart */
  // allowZoom: PropTypes.bool, // Descoped to later version
  // /** Ratio of the size 0f the scroll bar (Range 0 - 1) */
  // scrollRatio: PropTypes.number, // Descoped to later version
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

Line.defaultProps = {
  config: null,
  calcCondition: undefined,
  suppressZero: true,
  dualAxis: false,
  width: "100%",
  height: "100%",
  margin: "5px",
  size: "medium",
  fontColor: "",
  border: true,
  backgroundColor: null,
  tickSpacing: undefined,
  allowSelections: true,
  showGridlines: "solid",
  showAxis: undefined,
  textOnAxis: undefined,
  showGridlines: undefined,
  curve: "Linear",
  symbol: "circle",
  roundNum: true,
  columnSortOrder: [],
  sortDirection: "",
  areaChart: false,
  stacked: false,
};

export default Line;
