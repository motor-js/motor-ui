import React, { useContext } from "react";
import PropTypes from "prop-types";
import { ThemeContext } from "styled-components";
import StyledXYChart from "./StyledXYChart";
import { ConfigContext } from "../../../contexts/ConfigProvider";
import { EngineContext } from "../../../contexts/EngineProvider";
import useEngine from "../../../hooks/useEngine";

function XYChart({ ...rest }) {
  const myConfig = useContext(ConfigContext);
  const theme = useContext(ThemeContext);
  const { engine, engineError } =
    useContext(EngineContext) || useEngine(myConfig);

  return (
    <StyledXYChart
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

XYChart.propTypes = {
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
  sortOrder: PropTypes.array,
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
  // showLabels: PropTypes.oneOf(["top", "none", "inside"]),
  showLabels: PropTypes.bool,
  // /** Show text on Axis */
  showAxisLabels: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.oneOf(["both", "yAxis", "xAxis", "none"]),
  ]),
  // /** Spacing of Ticks on Y Axis */
  // tickSpacing: PropTypes.oneOf(["wide", "normal", "narrow"]),
  /** Display Axis and ticks  */
  hideAxisLine: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.oneOf(["both", "yAxis", "xAxis", "none"]),
  ]),
  /** Show gridline rows on Axis */
  gridRows: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  /** Show gridline columns on Axis */
  gridColumns: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  /** Show shadow around XYChart */
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
  /** SelectionMethod */
  selectionMethod: PropTypes.oneOf(["click", "brush", "none"]),
  // /** Maximum Width of the Bar */
  // maxWidth: PropTypes.number,
  // /** Force supression of Scroll / Overview chart */
  // suppressScroll: PropTypes.bool,
  // // /** Allow for bushes to be resized on chart */
  // // allowZoom: PropTypes.bool, // Descoped to later version
  // // /** Ratio of the size 0f the scroll bar (Range 0 - 1) */
  // // scrollRatio: PropTypes.number, // Descoped to later version
  /** Pddding for each bar */
  padding: PropTypes.number,
  /** Shape of the symbol to be used on the line. This will apply to all series on the chart */
  showPoints: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string, // { symbol : "circle","cross","diamond","square","star","triangle","wye","none", size}
  ]),
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
  type: PropTypes.string,
  useAnimatedAxes: PropTypes.bool,
  autoWidth: PropTypes.bool,
  renderHorizontally: PropTypes.bool,
  includeZero: PropTypes.bool,
  xAxisOrientation: PropTypes.oneOf(["top", "bottom"]),
  yAxisOrientation: PropTypes.oneOf(["left", "right"]),
  legendLeftRight: PropTypes.oneOf(["left", "right"]),
  legendTopBottom: PropTypes.oneOf(["top", "bottom"]),
  legendDirection: PropTypes.oneOf(["row", "column"]),
  legendShape: PropTypes.string,
  backgroundPattern: PropTypes.oneOf(["Lines", "Circles", "Hexagon", "Waves"]),
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

  /** fillStyle */
  /** either : style of one of below or fillFrom and FillTo */
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
  fillStyle: PropTypes.object,

  multiColor: PropTypes.bool,
  events: PropTypes.bool,
  /** Use dual Y axis on the the chart  */
  dualAxis: PropTypes.bool,
  showVerticalCrosshair: PropTypes.bool,
  legendLabelStyle: PropTypes.object,
  valueLabelStyle: PropTypes.object,
  /** Used for tooltip. If true only show the item that hovered over. If fasle show all items for that stack / group  */
  showClosestItem: PropTypes.bool,
  useSingleColor: PropTypes.bool,
  /** Number of ticks for the X Axis. Leave blank to auto calculate */
  numDimensionTicks: PropTypes.number,
  /** Input format of date supplied from engine (in qText) */
  parseDateFormat: PropTypes.string,
  /** Format of dates to be displayed on XAxis. */
  formatAxisDate: PropTypes.string,
  /** Format of dates to be displayed on Tooltip. */
  formatTooltipDate: PropTypes.string,
  /** Line stroke width */
  strokeWidth: PropTypes.number,
};

XYChart.defaultProps = {
  calcCondition: undefined,
  width: "100%",
  height: "400px", // 100%
  size: "medium",
  border: true,
  /** Use dual Y axis on the the chart  */
  dualAxis: false,
  colorTheme: null,
  sortOrder: [],
  sortDirection: "",
  // stacked: false,
  showAsPercent: false,
  gridArea: null,
  type: null, // Logic to determine default chart type in CreateXYChart
  xAxisOrientation: "bottom",
  yAxisOrientation: "left",
  legendLeftRight: "right",
  legendTopBottom: "top",
  legendDirection: "row",
  legendShape: "auto",
  parseDateFormat: null,
  formatAxisDate: null,
  formatTooltipDate: null,
  strokeWidth: null,
  numDimensionTicks: null,
};

export default XYChart;
