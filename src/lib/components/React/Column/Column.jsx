// help.qlik.com/en-US/sense/April2020/Subsystems/Hub/Content/Sense_Hub/Visualizations/Bar-Chart/bar-chart.htm

import React, { useContext } from "react";
import PropTypes from "prop-types";
import { ThemeContext } from "styled-components";
import StyledColumn from "./StyledColumn";
import { ConfigContext } from "../../../contexts/ConfigProvider";
import defaultTheme from "../../../themes/defaultTheme";
import { EngineContext } from "../../../contexts/EngineProvider";
import useEngine from "../../../hooks/useEngine";

function Column({ config, ...rest }) {
  const myConfig = config || useContext(ConfigContext);
  const theme = useContext(ThemeContext) || defaultTheme;
  const { engine, engineError } =
    useContext(EngineContext) || useEngine(myConfig);

  return (
    <StyledColumn
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

Column.propTypes = {
  /** Configuration object to connect to the Qlik Engine. Must include Qlik site URL and an App name */
  config: PropTypes.object,
  /** cols from Qlik Data Model to render in the Column  */
  cols: PropTypes.array.isRequired,
  /** Calc condition for the chart  */
  calcCondition: PropTypes.object,
  /** Supress zeo values in the the chart  */
  suppressZero: PropTypes.bool,
  /** Column Sort Order */
  columnSortOrder: PropTypes.array,
  /** Sort Ascending or descending */
  sortDirection: PropTypes.string,
  /** Column width */
  width: PropTypes.string,
  /** The height of the Column */
  height: PropTypes.string,
  /** The amount of margin around the component */
  margin: PropTypes.string,
  /** Size of the Column */
  size: PropTypes.oneOf(["tiny", "small", "medium", "large", "xlarge"]),
  /** Label position */
  showLabels: PropTypes.oneOf(["top", "none", "inside"]),
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
  /** Color of the Column label */
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
  /** Stacked Chart  */
  stacked: PropTypes.bool,
  /** Stacked Chart  */
  percentStacked: PropTypes.bool,
  /** RoundNum of the Column */
  roundNum: PropTypes.bool,
  /** Title of the Column */
  title: PropTypes.string,
  /** Sub Title of the Column */
  subTitle: PropTypes.string,
  /** Legend of the Column */
  showLegend: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.oneOf(["right", "bottom"]),
  ]),
  /** Allow Selections */
  allowSelections: PropTypes.bool,
  /** Maximum width of the Column */
  maxWidth: PropTypes.number,
  /** Display Axis and ticks  */
  showAxis: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.oneOf(["both", "yAxis", "xAxis", "none"]),
  ]),
  showXAxisText: PropTypes.bool,
  /** Max length of chart axis (in pixels) */
  maxAxisLength: PropTypes.number,
  /** Force supression of Scroll / Overview chart */
  suppressScroll: PropTypes.bool,
  // /** Allow for bushes to be resized on chart */
  // allowZoom: PropTypes.bool, // Descoped to later version
  // /** Ratio of the size 0f the scroll bar (Range 0 - 1) */
  // scrollRatio: PropTypes.number, // Descoped to later version
  /** Pddding for each column */
  columnPadding: PropTypes.number,
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
  /** Name of the parent grid area to place the box */
  gridArea: PropTypes.string,
};

Column.defaultProps = {
  config: null,
  calcCondition: undefined,
  suppressZero: null,
  width: "100%",
  height: "100%",
  margin: null,
  size: "medium",
  showLabels: null,
  fontColor: null,
  border: true,
  borderRadius: null,
  backgroundColor: null,
  colorTheme: null,
  tickSpacing: undefined,
  allowSelections: null,
  textOnAxis: null,
  showGridlines: null,
  showAxis: null,
  showXAxisText: true,
  roundNum: true,
  columnSortOrder: [],
  sortDirection: "",
  stacked: false,
  percentStacked: false,
  title: null,
  subTitle: null,
  showLegend: null,
  maxWidth: null,
  maxAxisLength: null,
  suppressScroll: null,
  columnPadding: null,
  dimensionErrMsg: null,
  measureErrMsg: null,
  otherTotalSpec: null,
  gridArea: null,
};

export default Column;
