/* eslint-disable unicorn/consistent-function-scoping */
import React, { useState, useMemo, useEffect } from "react";
// import defaultTheme from "../..//VX/theme/default";
import { isNull } from "lodash";
import Axis from "./xy-chart/components/Axis";
import AnimatedAxis from "./xy-chart/components/AnimatedAxis";
import ChartProvider from "./xy-chart/components/providers/ChartProvider";
import XYChart from "./xy-chart/components/XYChart";
import BarSeries from "./xy-chart/components/series/BarSeries";
import LineSeries from "./xy-chart/components/series/LineSeries";
import AreaSeries from "./xy-chart/components/series/AreaSeries";
import PointSeries from "./xy-chart/components/series/PointSeries";
import ChartBackground from "./xy-chart/components/ChartBackground";
import EventProvider from "./xy-chart/components/providers/TooltipProvider";
import Tooltip, { RenderTooltipArgs } from "./xy-chart/components/Tooltip";
import Legend from "./xy-chart/components/Legend";
import CustomLegendShape from "./xy-chart/components/CustomLegendShape";
import Group from "./xy-chart/components/series/Group";
import Stack from "./xy-chart/components/series/Stack";
import Gradient from "./xy-chart/components/aesthetic/Gradient";
// import { LinearGradient } from "@vx/gradient";
// import Grid from "./xy-chart/components/grids/Grid";
// import { GridRows, GridColumns } from "@vx/grid";

import { colorByExpression } from "../../../utils";

const numDimensionTicks = 5;

// const Console = (prop) => (
//   console[Object.keys(prop)[0]](...Object.values(prop)),
//   null // ➜ React components must return something
// );

const getDimension = (d) => d[0].qText;

// const getDimension = (d) =>
//   new Date(
//     d[0].qText.split("/")[2],
//     d[0].qText.split("/")[1] - 1,
//     d[0].qText.split("/")[0]
//   );

const legendLabelFormat = (d) => d;

const axisTopMargin = {
  top: 40,
  right: 50,
  bottom: 30,
  left: 50,
};
const axisBottomMargin = {
  top: 30,
  right: 50,
  bottom: 40,
  left: 50,
};

/** memoize the accessor functions to prevent re-registering data. */
function useAccessors(valueAccessor, column, renderHorizontally) {
  return useMemo(
    () => ({
      xAccessor: (d) =>
        renderHorizontally ? valueAccessor(d, column) : getDimension(d),
      yAccessor: (d) =>
        renderHorizontally ? getDimension(d) : valueAccessor(d, column),
    }),
    [renderHorizontally, valueAccessor]
  );
}

export default function CreateXYChart({
  width,
  height,
  events = false,
  qData: { qMatrix },
  qLayout: {
    qHyperCube,
    qHyperCube: { qMeasureInfo: measureInfo, qDimensionInfo: dimensionInfo },
  },
  setRefreshChart,
  beginSelections,
  select,
  setSelectionXYChartVisible,
  useSelectionColours,
  pendingSelections,
  SetPendingSelections,
  theme,
  padding,
  colorPalette,
  type,
  useAnimatedAxes,
  autoWidth,
  renderHorizontally,
  includeZero,
  xAxisOrientation,
  yAxisOrientation,
  legendLeftRight,
  showLegend,
  legendTopBottom,
  legendDirection,
  legendShape,
  snapTooltipToDataX,
  snapTooltipToDataY,
  backgroundPattern,
  multiColor,
  showLabels,
  showPoints,
  dualAxis,
  roundNum,
  precision,
  showVerticalCrosshair,
  showAxis,
}) {
  // console.log("render");
  const getChartType = () =>
    type ||
    (dimensionInfo.length === 1 && measureInfo.length === 1
      ? "bar"
      : "groupedbar");

  const [chartType, setchartType] = useState([getChartType()]);

  // let datum = [];
  let series = [];
  let dimID = null;
  const items = [];
  const keys = [];
  // series.push(dim);

  if (dimensionInfo.length !== 1 && !chartType.includes("scatter")) {
    qMatrix.forEach((d, i) => {
      if (isNull(dimID)) {
        dimID = d[0].qText;
        series.push(d[0]);
      }

      if (dimID !== d[0].qText) {
        items.push(series);
        series = [];
        series.push(d[0]);
        dimID = d[0].qText;
      }
      const measure = d[1];
      measure.qNum = d[2].qNum;
      if (!keys.includes(measure.qText)) {
        keys.push(measure.qText);
      }
      series.push(measure);
    });

    items.push(series);
  }

  const data = dimensionInfo.length === 1 ? qMatrix : items;

  const [currData, setCurrData] = useState(data);

  const getSeriesValues = (d, colIndex) => Number(d[colIndex].qNum);

  // const getSeriesValues = (d, colIndex) => {
  //   return dimensionInfo.length !== 1
  //     ? Number(d[1].qNum)
  //     : Number(d[colIndex].qNum);
  // };

  const dataKeys =
    multiColor &&
    dimensionInfo.length == 1 &&
    measureInfo.length === 1 &&
    chartType.includes("bar")
      ? data.map((d) => d[0].qText)
      : dimensionInfo.length === 2
      ? keys
      : null;

  const canSnapTooltipToDataX =
    (chartType.includes("groupedbar") && renderHorizontally) ||
    (chartType.includes("stackedbar") && !renderHorizontally) ||
    (chartType.includes("combo") && !renderHorizontally) ||
    chartType.includes("bar");

  const canSnapTooltipToDataY =
    (chartType.includes("groupedbar") && !renderHorizontally) ||
    (chartType.includes("stackedbar") && renderHorizontally) ||
    (chartType.includes("combo") && renderHorizontally) ||
    chartType.includes("bar");

  const dateScaleConfig = useMemo(() => ({ type: "band", padding }), []);

  const valueScaleConfig = useMemo(
    () => ({
      type: "linear",
      clamp: true,
      nice: true,
      domain: undefined,
      includeZero,
    }),
    [includeZero]
  );

  const colorScaleConfig = useMemo(
    () => ({
      domain: dataKeys || measureInfo.map((d) => d.qFallbackTitle),
    }),
    [chartType]
  );

  const dataAccessors =
    dimensionInfo.length <= 1
      ? measureInfo.map((measure, index) =>
          useAccessors(
            getSeriesValues,
            dimensionInfo.length + index,
            renderHorizontally
          )
        )
      : keys.map((measure, index) =>
          useAccessors(getSeriesValues, index, renderHorizontally)
        );

  useEffect(() => {
    setCurrData(data);
  }, [data]);

  // Check if conditionalColors and if so get the returned color pallette
  const colors = colorByExpression(qHyperCube, data, colorPalette);

  const {
    //  global: { colorTheme: globalColorTheme },
    xyChart,
  } = theme;

  const themeObj = {
    // ...defaultTheme,
    ...theme.xyChart.defaultTheme,
    colors,
  };

  const AxisComponent = useAnimatedAxes ? AnimatedAxis : Axis;

  const legend = showLegend ? (
    <Legend
      labelFormat={legendLabelFormat}
      alignLeft={legendLeftRight === "left"}
      direction={legendDirection}
      shape={
        legendShape === "auto"
          ? undefined
          : legendShape === "custom"
          ? CustomLegendShape
          : legendShape
      }
    />
  ) : null;

  // const gridColor = "#6e0fca";
  // const numTickColumns = 5;
  // const scaleHeight = height / axes.length - scalePadding;
  const background = "#3b6978";
  const background2 = "#204051";
  const accentColor = "#edffea";

  return (
    // <div className="container">

    <ChartProvider
      xScale={renderHorizontally ? valueScaleConfig : dateScaleConfig}
      yScale={renderHorizontally ? dateScaleConfig : valueScaleConfig}
    >
      <XYChart
        height={height}
        width={autoWidth ? undefined : width}
        margin={xAxisOrientation === "top" ? axisTopMargin : axisBottomMargin}
        dualAxis={dualAxis}
      >
        <BarSeries
          key={measureInfo[0].qFallbackTitle}
          dataKey={measureInfo[0].qFallbackTitle}
          data={currData}
          showLabels={showLabels}
          roundNum={roundNum}
          precision={precision}
          // xScale={renderHorizontally ? valueScaleConfig : dateScaleConfig}
          // yScale={renderHorizontally ? dateScaleConfig : valueScaleConfig}
          {...dataAccessors[0]}
        />
      </XYChart>
    </ChartProvider>
  );
}
