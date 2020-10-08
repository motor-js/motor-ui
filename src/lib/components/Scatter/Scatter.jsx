import React from "react";
import PropTypes from "prop-types";
import XYChart from "../XYChart";

function Scatter({ cols, stacked, ...rest }) {
  return (
    <XYChart // width={750} height={400}  events={true}
      type="scatter"
      showClosestItem={true}
      showAsPercent={false}
      stacked={false}
      showLegend={false}
      dualAxis={false}
      cols={cols}
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
  /** cols from Qlik Data Model to render in the Scatter  */
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
  /** Scatter Sort Order */
  sortOrder: PropTypes.array,
  /** Sort Ascending or descending */
  sortDirection: PropTypes.string,
  /** Scatter width */
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  /** The height of the Scatter */
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  /** The amount of margin around the component */
  margin: PropTypes.string,
  /** Size of the Scatter */
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
  /** Show shadow around Scatter Chart */
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
  // /** Stacked Chart  */
  // showAsPercent: PropTypes.bool,
  /** RoundNum of the Scatter */
  roundNum: PropTypes.bool,
  /** Decimai precision for RoundNum of the Scatter */
  precision: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
  /** Title of the Scatter */
  title: PropTypes.string,
  /** Sub Title of the Scatter */
  subTitle: PropTypes.string,
  // /** Legend of the chart */
  // showLegend: PropTypes.oneOfType([
  //   PropTypes.bool,
  //   PropTypes.oneOf(["right", "bottom"]),
  // ]),
  /** Show tooltip */
  showTooltip: PropTypes.bool,
  /** SelectionMethod */
  selectionMethod: PropTypes.oneOf(["click", "brush", "none"]),
  // /** Maximum Width of the Scatter */
  // maxWidth: PropTypes.number,
  // /** Force supression of Scroll / Overview chart */
  // suppressScroll: PropTypes.bool,
  // // /** Allow for bushes to be resized on chart */
  // // allowZoom: PropTypes.bool, // Descoped to later version
  // // /** Ratio of the size 0f the scroll bar (Range 0 - 1) */
  // // scrollRatio: PropTypes.number, // Descoped to later version
  // /** Pddding for each bar */
  // padding: PropTypes.number,
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
  useAnimatedAxes: PropTypes.bool,
  autoWidth: PropTypes.bool,
  renderHorizontally: PropTypes.bool,
  includeZero: PropTypes.bool,
  xAxisOrientation: PropTypes.oneOf(["top", "bottom"]),
  yAxisOrientation: PropTypes.oneOf(["left", "right"]),
  // legendLeftRight: PropTypes.oneOf(["left", "right"]),
  // legendTopBottom: PropTypes.oneOf(["top", "bottom"]),
  // legendDirection: PropTypes.oneOf(["row", "column"]),
  // legendShape: PropTypes.string,
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
  // /** Use dual Y axis on the the chart  */
  // dualAxis: PropTypes.bool,
  /** Show CrossHair on the chart  */
  showCrossHair: PropTypes.bool,
  /** Styling of the CrossHair. */
  crossHairStyles: PropTypes.object,
  /** Styling of the Legend labels. */
  legendLabelStyle: PropTypes.object,
  /** Styling of the Value labels. */
  valueLabelStyle: PropTypes.object,
  // /** Used for tooltip. If true only show the item that hovered over. If fasle show all items for that stack / group  */
  // showClosestItem: PropTypes.bool,
  /** Only use one color for the toolyip instead of multi color per item. */
  useSingleColor: PropTypes.bool,
  /** Snap to X Axis (normally true for bar or combo) */
  snapToDataX: PropTypes.bool,
  /** Snap to Y Axis (normally true for bar or combo) */
  snapToDataY: PropTypes.bool,
  /** Show value only for Tooltip */
  valueOnly: PropTypes.bool,
  /** Show single line fo text and value for tooltip */
  valueWithText: PropTypes.bool,
  /** Input format of date supplied from engine (in qText) */
  parseDateFormat: PropTypes.string,
  /** Format of dates to be displayed on Tooltip. */
  formatTooltipDate: PropTypes.string,
  /** Reposition the tooltip. */
  shiftTooltipTop: PropTypes.number,
  /** Reposition the tooltip. */
  shiftTooltipLeft: PropTypes.number,
  /** Number of ticks for the X Axis. Leave blank to auto calculate */
  numDimensionTicks: PropTypes.number,
  /** Number of ticks for the Y Axis. Leave blank to auto calculate */
  numMeasureTicks: PropTypes.number,
  // /** Number of ticks for the dual Y Axis. Leave blank to auto calculate */
  // numMeasureDualTicks: PropTypes.number,
  /** Format of dates to be displayed on XAxis. */
  formatAxisDate: PropTypes.string,
  /** Line stroke width */
  strokeWidth: PropTypes.number,
  /** Styles for the X Axis */
  xAxisStyles: PropTypes.object,
  /** Styles for the Y Axis */
  yAxisStyles: PropTypes.object,
  /** Styles for the X Axis ticks */
  xTickStyles: PropTypes.object,
  /** Styles for the Y Axis ticks */
  yTickStyles: PropTypes.object,
  /** Styling for the tooltip */
  tooltipStyles: PropTypes.object,
};

Scatter.defaultProps = {
  calcCondition: undefined,
  width: "100%",
  height: "400px", // 100%
  size: "medium",
  border: true,
  borderRadius: null,
  backgroundColor: null,
  margin: null,
  /** Use dual Y axis on the the chart  */
  // dualAxis: false,
  colorTheme: null,
  sortOrder: [],
  sortDirection: "",
  // stacked: false,
  // showAsPercent: false,
  gridArea: null,
  xAxisOrientation: "bottom",
  yAxisOrientation: "left",
  // legendLeftRight: "right",
  // legendTopBottom: "top",
  // legendDirection: "row",
  // legendShape: "auto",
  parseDateFormat: null,
  formatAxisDate: null,
  formatTooltipDate: null,
  strokeWidth: null,
  numDimensionTicks: null,
  numMeasureTicks: null,
  // numMeasureDualTicks: null,
  showCrossHair: true,
  showTooltip: true,
  // showLegend: false,
  // showClosestItem,true,
};

export default Scatter;
