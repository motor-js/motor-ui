/* eslint-disable unicorn/consistent-function-scoping */
import React, { useState, useMemo, useEffect } from "react";
// import defaultTheme from "../..//VX/theme/default";
import Axis from "./xy-chart/components/Axis";
import AnimatedAxis from "./xy-chart/components/AnimatedAxis";
import ChartProvider from "./xy-chart/components/providers/ChartProvider";
import XYChart from "./xy-chart/components/XYChart";
import BarSeries from "./xy-chart/components/series/BarSeries";
import LineSeries from "./xy-chart/components/series/LineSeries";
import AreaSeries from "./xy-chart/components/series/AreaSeries";
import PointSeries from "./xy-chart/components/series/PointSeries";
import ChartPattern from "./xy-chart/components/ChartPattern";
import EventProvider from "./xy-chart/components/providers/TooltipProvider";
import Tooltip, { RenderTooltipArgs } from "./xy-chart/components/Tooltip";
import Legend from "./xy-chart/components/Legend";
import CustomLegendShape from "./xy-chart/components/CustomLegendShape";
import Group from "./xy-chart/components/series/Group";
import Stack from "./xy-chart/components/series/Stack";
import ChartBackground from "./xy-chart/components/aesthetic/Gradient";
import Grid from "./xy-chart/components/grids/Grid";

import { colorByExpression } from "../../../utils";
import { isNull } from "lodash";

const numDimensionTicks = 5;

// const Console = (prop) => (
//   console[Object.keys(prop)[0]](...Object.values(prop)),
//   null // ➜ React components must return something
// );

const getDimension = (d) => d[0].qText;
const getElementNumber = (d) => d[0].qElemNumber;

// const getDimension = (d) =>
//   new Date(
//     d[0].qText.split("/")[2],
//     d[0].qText.split("/")[1] - 1,
//     d[0].qText.split("/")[0]
//   );

const legendLabelFormat = (d) => d;

const axisTopMargin = { top: 40, right: 50, bottom: 30, left: 50 };
const axisBottomMargin = { top: 30, right: 50, bottom: 40, left: 50 };

/** memoize the accessor functions to prevent re-registering data. */
function useAccessors(valueAccessor, column, renderHorizontally) {
  return useMemo(
    () => ({
      xAccessor: (d) =>
        renderHorizontally ? valueAccessor(d, column) : getDimension(d),
      yAccessor: (d) =>
        renderHorizontally ? getDimension(d) : valueAccessor(d, column),
      elAccessor: (d) => getElementNumber(d),
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
  backgroundStyle,
  backgroundFrom,
  backgroundTo,
  multiColor,
  showLabels,
  showPoints,
  dualAxis,
  roundNum,
  precision,
  showVerticalCrosshair,
  showAxis,
  gridRows,
  gridColumns,
  allowSelections,
}) {
  const getChartType = () =>
    type
      ? type
      : dimensionInfo.length === 1 && measureInfo.length === 1
      ? "bar"
      : "groupedbar";

  const [chartType, setchartType] = useState([getChartType()]);

  let series = [];
  let dimID = null;
  let items = [];
  let keys = [];

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
      domain: dataKeys ? dataKeys : measureInfo.map((d) => d.qFallbackTitle),
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
  // const background = "#3b6978";
  // const background2 = "#204051";
  // const accentColor = "#edffea";

  return (
    // <div className="container">

    <ChartProvider
      theme={themeObj}
      chartType={chartType}
      xScale={renderHorizontally ? valueScaleConfig : dateScaleConfig}
      yScale={renderHorizontally ? dateScaleConfig : valueScaleConfig}
      colorScale={colorScaleConfig}
      showLabels={showLabels === undefined ? xyChart.showLabels : showLabels}
      showPoints={showPoints === undefined ? xyChart.showPoints : showPoints}
      showAxis={showAxis === undefined ? xyChart.showAxis : showAxis}
      roundNum={roundNum === undefined ? xyChart.roundNum : roundNum}
      precision={precision === undefined ? xyChart.precision : precision}
      dimensionInfo={dimensionInfo}
      measureInfo={measureInfo}
      dataKeys={dataKeys}
    >
      <EventProvider>
        {legendTopBottom === "top" && legend}
        <div
          className="container"
          style={{
            position: "relative",
            width: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <XYChart
            height={height}
            width={autoWidth ? undefined : width}
            margin={
              xAxisOrientation === "top" ? axisTopMargin : axisBottomMargin
            }
            dualAxis={dualAxis}
            captureEvents={!allowSelections}
          >
            <ChartBackground
              style={backgroundStyle}
              id="area-background-gradient"
              from={backgroundFrom}
              to={backgroundTo}
            />
            <ChartPattern backgroundPattern={backgroundPattern} />

            {(gridRows !== false || gridColumns !== false) && (
              <Grid
                gridRows={gridRows}
                gridColumns={gridColumns}
                // strokeWidth={strokeWidth}
                // strokeDasharray={strokeDasharray}
                // numTicks={numTicksRows}
                // lineStyle={rowLineStyle}
                // offset={yOffset}
                // tickValues={rowTickValues}
              />
            )}

            {chartType.includes("bar") && (
              <BarSeries
                horizontal={renderHorizontally}
                // dataKey={measureInfo[0].qFallbackTitle}
                dataKeys={dataKeys ? dataKeys : null}
                dataKey={dataKeys ? null : measureInfo[0].qFallbackTitle}
                data={currData}
                {...dataAccessors[0]}
              />
            )}
            {chartType.includes("stackedbar") && (
              <Stack horizontal={renderHorizontally}>
                {dimensionInfo.length <= 1
                  ? measureInfo.map((measure, index) => (
                      <BarSeries
                        key={measureInfo[index].qFallbackTitle}
                        dataKey={measureInfo[index].qFallbackTitle}
                        data={currData}
                        {...dataAccessors[index]}
                      />
                    ))
                  : dataKeys.map((measure, index) => (
                      <BarSeries
                        key={measure}
                        dataKey={measure}
                        data={currData}
                        {...dataAccessors[index]}
                      />
                    ))}
              </Stack>
            )}
            {chartType.includes("groupedbar") && (
              <Group horizontal={renderHorizontally}>
                {dimensionInfo.length <= 1
                  ? measureInfo.map((measure, index) => (
                      <BarSeries
                        key={measureInfo[index].qFallbackTitle}
                        dataKey={measureInfo[index].qFallbackTitle}
                        data={currData}
                        {...dataAccessors[index]}
                      />
                    ))
                  : dataKeys.map((measure, index) => (
                      <BarSeries
                        key={measure}
                        dataKey={measure}
                        data={currData}
                        {...dataAccessors[index]}
                      />
                    ))}
              </Group>
            )}
            {chartType.includes("line") && (
              <>
                {// dimensionInfo.length <= 1
                //   ?
                measureInfo.map((measure, index) => (
                  <LineSeries
                    key={measureInfo[index].qFallbackTitle}
                    dataKey={measureInfo[index].qFallbackTitle}
                    data={currData}
                    {...dataAccessors[index]}
                    strokeWidth={1.5}
                  />
                ))
                // : dataKeys.map((measure, index) => (
                //     <LineSeries
                //       key={measure}
                //       dataKey={measure}
                //       data={currData}
                //       {...dataAccessors[index]}
                //       strokeWidth={1.5}
                //     />
                //   ))
                }
              </>
            )}
            {chartType.includes("combo") &&
              measureInfo.length > 1 &&
              measureInfo.map((measure, index) =>
                measure.qChartType === "bar" ? (
                  <BarSeries
                    key={measure.qFallbackTitle}
                    dataKey={measure.qFallbackTitle}
                    data={currData}
                    {...dataAccessors[index]}
                  />
                ) : (
                  <LineSeries
                    key={measure.qFallbackTitle}
                    dataKey={measure.qFallbackTitle}
                    data={currData}
                    {...dataAccessors[index]}
                    strokeWidth={1.5}
                  />
                )
              )}
            {chartType.includes("area") &&
              dimensionInfo.length <= 1 &&
              measureInfo.map((measure, index) => (
                <AreaSeries
                  key={measureInfo[index].qFallbackTitle}
                  dataKey={measureInfo[index].qFallbackTitle}
                  data={currData}
                  {...dataAccessors[index]}
                  strokeWidth={1.5}
                />
              ))}
            {chartType.includes("scatter") &&
              dimensionInfo.length === 1 &&
              measureInfo.length === 2 && (
                // measureInfo.map((measure, index) => (
                <PointSeries
                  dataKeys={dataKeys ? dataKeys : null}
                  dataKey={dataKeys ? null : measureInfo[0].qFallbackTitle}
                  data={currData}
                  {...dataAccessors[0]}
                />
              )}
            {/** Temperature axis */}

            <AxisComponent
              label={measureInfo[0].qFallbackTitle}
              orientation={
                renderHorizontally ? xAxisOrientation : yAxisOrientation
              }
              numTicks={5}
            />

            {dualAxis && (
              <AxisComponent
                label={measureInfo[1].qFallbackTitle}
                orientation="right"
                numTicks={9}
              />
            )}
            {/** Dimension axis */}

            <AxisComponent
              // label={dimensionInfo[0].qFallbackTitle}
              orientation={
                renderHorizontally ? yAxisOrientation : xAxisOrientation
              }
              tickValues={currData
                .filter(
                  (d, i, arr) =>
                    i % Math.round((arr.length - 1) / numDimensionTicks) === 0
                )
                .map((d) => getDimension(d))}
              tickFormat={(d) =>
                d.toISOString?.().split?.("T")[0] ?? d.toString()
              }
            />
          </XYChart>

          <Tooltip
            snapToDataX={snapTooltipToDataX && canSnapTooltipToDataX}
            snapToDataY={snapTooltipToDataY && canSnapTooltipToDataY}
            // renderTooltip={renderTooltip}
            showVerticalCrosshair={showVerticalCrosshair}
          />
          {legendTopBottom === "bottom" && legend}
        </div>
      </EventProvider>
    </ChartProvider>
  );
}
