import React, { useContext } from "react";
import PropTypes from "prop-types";
import { ThemeContext } from "styled-components";
import StyledPie from "./StyledPie";
import { ConfigContext } from "../../contexts/ConfigProvider";
import { EngineContext } from "../../contexts/EngineProvider";
import useEngine from "../../hooks/useEngine";

function Pie({ ...rest }) {
  const myConfig = useContext(ConfigContext);
  const theme = useContext(ThemeContext);
  const { engine, engineError } =
    useContext(EngineContext) || useEngine(myConfig);

  return (
    <StyledPie
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

Pie.propTypes = {
  /** cols from Qlik Data Model to render in the Bar  */
  cols: PropTypes.array.isRequired,
  /** Calc condition for the chart  */
  calcCondition: PropTypes.shape({
    qCond: PropTypes.string,
    qMsg: PropTypes.string,
  }),
  /** Supress zero values in the the chart  */
  suppressZero: PropTypes.bool,
  /** Supress missing values in the the chart  */
  suppressMissing: PropTypes.bool,
  /** Bar Sort Order */
  sortOrder: PropTypes.array,
  /** Sort Ascending or descending */
  sortDirection: PropTypes.string,
  /** Bar width */
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  /** The height of the Bar */
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  /** The amount of margin around the component */
  margin: PropTypes.string,
  /** The amount of margin around the chart */
  chartMargin: PropTypes.object,
  /** Size of the Bar */
  size: PropTypes.oneOf(["tiny", "small", "medium", "large", "xlarge"]),
  // showLabels: PropTypes.oneOf(["top", "none", "inside"]),
  showLabels: PropTypes.bool,
  /** Show shadow around Pie */
  showBoxShadow: PropTypes.bool,
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
  // /** Border radius of the chart */
  borderRadius: PropTypes.string,
  // /** Background Color of the chart */
  backgroundColor: PropTypes.string,
  // /** color scheme of the chart */
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
      "light",
      "dark",
    ]),
    PropTypes.array,
  ]),
  // /** Stacked Chart  */
  // stacked: PropTypes.bool,
  /** Stacked Chart  */
  showAsPercent: PropTypes.bool,
  /** RoundNum of the Bar */
  roundNum: PropTypes.bool,
  /** Decimai precision for RoundNum of the Bar */
  precision: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
  /** Title of the Bar */
  title: PropTypes.string,
  /** Sub Title of the Bar */
  subTitle: PropTypes.string,
  /** Legend of the chart */
  showLegend: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.oneOf(["right", "bottom"]),
  ]),
  /** Show tooltip */
  showTooltip: PropTypes.bool,
  /** SelectionMethod */
  selectionMethod: PropTypes.oneOf(["click", "none"]),
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
  legendLeftRight: PropTypes.oneOf(["left", "right"]),
  legendTopBottom: PropTypes.oneOf(["top", "bottom"]),
  legendDirection: PropTypes.oneOf(["row", "column"]),
  legendShape: PropTypes.string,
  /** BackgroundSTyle */
  /** either : style of one of below or bckgroundFrom and bckgroundTo */
  /**  Linear  */
  /**  Radial  */
  /**  DarkGreen  */
  /**  LightGreen  */
  /**  OrangeRed  */
  /**  PinkBlue  */
  /**  PinkRed  */
  /**  PurpleOrangle  */
  /**  PurpleRed  */
  /**  PurpleTeal  */
  /**  SteelPurple  */
  /**  TealBlue  */
  backgroundStyle: PropTypes.object,
  // multiColor: PropTypes.bool,
  events: PropTypes.bool,
  /** Styling of the Legend labels. */
  legendLabelStyle: PropTypes.object,
  /** Styling of the Value labels. */
  valueLabelStyle: PropTypes.object,
  // /** Used for tooltip. If true only show the item that hovered over. If fasle show all items for that stack / group  */
  // showClosestItem: PropTypes.bool,
  // /** Only use one color for the toolyip instead of multi color per item. */
  // useSingleColor: PropTypes.bool,
  // /** Show value only for Tooltip */
  // valueOnly: PropTypes.bool,
  // /** Show single line fo text and value for tooltip */
  // valueWithText: PropTypes.bool,
  // /** Input format of date supplied from engine (in qText) */
  // parseDateFormat: PropTypes.string,
  // /** Format of dates to be displayed on Tooltip. */
  // formatTooltipDate: PropTypes.string,
  /** Line stroke width around each segemnt */
  strokeWidth: PropTypes.number,
  /** Line stroke color around each segemnt */
  stroke: PropTypes.string,
  /** Corner radius */
  cornerRadius: PropTypes.number,
  /** Padding Angle */
  padAngle: PropTypes.number,
  /** Dispaly charta s donut */
  isDonut: PropTypes.bool,
  /** Thickness of the donut */
  donutThickness: PropTypes.number,
  /** Margin of the chart */
  margin: PropTypes.object,
  /** Sort by Labels */
  pieSort: PropTypes.oneOf([
    "asc",
    "desc",
    "ASC",
    "DESC",
    "Ascending",
    "ASCENDING",
    "Descending",
    "DESCENDING",
  ]),
  /** Sort by Values */
  pieSortValues: PropTypes.oneOf([
    "asc",
    "desc",
    "ASC",
    "DESC",
    "Ascending",
    "ASCENDING",
    "Descending",
    "DESCENDING",
  ]),
};

Pie.defaultProps = {
  calcCondition: undefined,
  width: "100%",
  height: "400px", // 100%
  size: "medium",
  border: true,
  colorTheme: null,
  sortOrder: [],
  sortDirection: "",
  // stacked: false,
  showAsPercent: false,
  gridArea: null,
  showLegend: false,
  legendLeftRight: "right",
  legendTopBottom: "top",
  legendDirection: "row",
  legendShape: "auto",
  parseDateFormat: null,
  formatTooltipDate: null,
  strokeWidth: null,
  showTooltip: true,
  pieSort: "asc",
};

export default Pie;
