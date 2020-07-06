import React, { useRef, useEffect, useState, useContext } from "react";
import PropTypes from "prop-types";
import { ThemeContext } from "styled-components";
import StyledScatter from "./StyledScatter";
import { ConfigContext } from "../../../contexts/ConfigProvider";
import defaultTheme from "../../../themes/defaultTheme";
import { EngineContext } from "../../../contexts/EngineProvider";
import useEngine from "../../../hooks/useEngine";

function Scatter({ config, ...rest }) {
  const myConfig = config || useContext(ConfigContext);
  const theme = useContext(ThemeContext) || defaultTheme;
  const { engine, engineError } =
    useContext(EngineContext) || useEngine(myConfig);

  return (
    <StyledScatter
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

Scatter.propTypes = {
  /** Configuration object to connect to the Qlik Engine. Must include Qlik site URL and an App name */
  config: PropTypes.object,
  /** cols from Qlik Data Model to render in the Scatter  */
  cols: PropTypes.array.isRequired,
  /** Calc condition for the chart  */
  calcCondition: PropTypes.object,
  /** Supress zeo vlaues in the the chart  */
  suppressZero: PropTypes.bool,
  /** Label Position */
  showLabels: PropTypes.oneOf(["top", "none"]),
  /** Show text on Axis */
  textOnAxis: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.oneOf(["both", "yAxis", "xAxis", "none"]),
  ]),
  /** Spacing of Ticks on Y Axis */
  tickSpacing: PropTypes.oneOf(["wide", "normal", "narrow"]),
  /** Supress scrollbar in the the chart  */
  suppressScroll: PropTypes.bool,
  // /** Allow for bushes to be resized on chart */
  // allowZoom: PropTypes.bool, // Descoped to later version
  // /** Ratio of the size 0f the scroll bar (Range 0 - 1) */
  // scrollRatio: PropTypes.number, // Descoped to later version
  /** Show Gridlines in Chart */
  showGridlines: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.oneOf(["solid", "dashes", "dots", "none"]),
  ]),
  /** Scatter Sort Order */
  columnSortOrder: PropTypes.array,
  /** Sort Ascending or descending */
  sortDirection: PropTypes.string,
  /** Scatter theme try juno, classic or night. Default theme is 'classic' */
  theme: PropTypes.string,
  /** Scatter width */
  width: PropTypes.string,
  /** The height of the Scatter */
  height: PropTypes.string,
  /** The amount of margin around the component */
  margin: PropTypes.string,
  /** Size of the Scatter */
  size: PropTypes.oneOf(["tiny", "small", "medium", "large", "xlarge"]),
  /** Color of the Scatter Labels */
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
  /** RoundNum of the Scatter */
  roundNum: PropTypes.bool,
  /** Title of the Scatter */
  title: PropTypes.string,
  /** Sub Title of the Scatter */
  subTitle: PropTypes.string,
  /** Legend of the Scatter */
  showLegend: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.oneOf(["right", "bottom"]),
  ]),
  /** Allow Selections */
  allowSelections: PropTypes.bool,
  /** Display Axis and ticks  */
  showAxis: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.oneOf(["both", "yAxis", "xAxis", "none"]),
  ]),
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

Scatter.defaultProps = {
  config: null,
  calcCondition: undefined,
  allowSelections: true,
  width: "100%",
  height: "100%",
  margin: "5px",
  size: "medium",
  fontColor: "",
  border: true,
  backgroundColor: null,
  tickSpacing: undefined,
  textOnAxis: undefined,
  showGridlines: undefined,
  showAxis: undefined,
  roundNum: true,
  columnSortOrder: [],
  sortDirection: "",
};

export default Scatter;
