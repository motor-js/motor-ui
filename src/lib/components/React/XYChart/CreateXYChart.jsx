/* eslint-disable unicorn/consistent-function-scoping */
import React, { useState, useMemo, useEffect } from "react";
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
import StackedBar from "./xy-chart/components/series/StackedBar";
import StackedArea from "./xy-chart/components/series/StackedArea";
import ChartBackground from "./xy-chart/components/aesthetic/Gradient";
import Grid from "./xy-chart/components/grids/Grid";
import Brush from "./xy-chart/components/selection/Brush";

import { PatternLines } from "./xy-chart/components/aesthetic/Patterns";

import { colorByExpression, isNull } from "../../../utils";

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
  // qData: { qMatrix },
  qMatrix,
  qLayout: {
    qHyperCube,
    qHyperCube: { qMeasureInfo: measureInfo, qDimensionInfo: dimensionInfo },
  },
  beginSelections,
  select,
  setCurrentSelectionIds,
  currentSelectionIds,
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
  fillStyle,
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
  selectionMethod,
  enableBrush,
  showBrush,
  asPercent,
}) {
  const dimensionCount = dimensionInfo.length;
  const measureCount = measureInfo.length;
  const singleDimension = dimensionCount === 1;
  const singleMeasure = measureCount === 1;

  const getChartType = () =>
    type ? type : singleDimension && singleMeasure ? "bar" : "groupedbar";

  // const [chartType, setchartType] = useState([getChartType()]);
  const chartType = [getChartType()];

  let series = [];
  let dimID = null;
  let items = [];
  let keys = [];

  if (dimensionCount !== 1 && !chartType.includes("scatter")) {
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

  if (asPercent) {
    if (singleDimension) {
      qMatrix.forEach((d, i) => {
        let positiveSum = 0;
        let negativeSum = 0;
        measureInfo.forEach((m, mi) => {
          const value = d[dimensionCount + mi].qNum;
          value >= 0 ? (positiveSum += value) : (negativeSum += value);
        });
        measureInfo.forEach((m, mi) => {
          const value = d[dimensionCount + mi].qNum;
          d[dimensionCount + mi].qNum =
            Math.abs(value) / (value >= 0 ? positiveSum : negativeSum);
        });
      });
    } else {
      if (singleDimension) {
        qMatrix.forEach((d, i) => {
          let positiveSum = 0;
          let negativeSum = 0;
          measureInfo.forEach((m, mi) => {
            const value = d[dimensionCount + mi].qNum;
            value >= 0 ? (positiveSum += value) : (negativeSum += value);
          });
          measureInfo.forEach((m, mi) => {
            const value = d[dimensionCount + mi].qNum;
            d[dimensionCount + mi].qNum =
              Math.abs(value) / (value >= 0 ? positiveSum : negativeSum);
          });
        });
      }
    }
  }

  const data = singleDimension ? qMatrix : items;

  const [currData, setCurrData] = useState(data);

  const getSeriesValues = (d, colIndex) => Number(d[colIndex].qNum);

  // const getSeriesValues = (d, colIndex) => {
  //   return dimensionCount !== 1
  //     ? Number(d[1].qNum)
  //     : Number(d[colIndex].qNum);
  // };

  const dataKeys =
    multiColor &&
    dimensionCount == 1 &&
    singleMeasure &&
    chartType.includes("bar")
      ? data.map((d) => d[0].qText)
      : dimensionCount === 2
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

  useEffect(() => {
    setCurrData(data);
  }, [data]);

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
    dimensionCount <= 1
      ? measureInfo.map((measure, index) =>
          useAccessors(
            getSeriesValues,
            dimensionCount + index,
            renderHorizontally
          )
        )
      : keys.map((measure, index) =>
          useAccessors(
            getSeriesValues,
            dimensionCount - 1 + index,
            renderHorizontally
          )
        );

  // Check if conditionalColors and if so get the returned color pallette
  const colors = colorByExpression(qHyperCube, data, colorPalette);

  const { xyChart } = theme;

  const themeObj = {
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

  const selectedBoxStyle = {
    fill: "url(#brush_pattern)",
    stroke: "#329af0",
  };

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
      beginSelections={beginSelections}
      select={select}
      setCurrentSelectionIds={setCurrentSelectionIds}
      currentSelectionIds={currentSelectionIds}
      singleDimension={singleDimension}
      singleMeasure={singleMeasure}
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
            captureEvents={selectionMethod === "none"}
            onMouseDown={selectionMethod === "brush" ? enableBrush : null}
          >
            <ChartBackground
              style={backgroundStyle.style}
              id="area-background-gradient"
              from={backgroundStyle.styleFrom}
              to={backgroundStyle.styleTo}
            />
            <ChartPattern backgroundPattern={backgroundPattern} />
            {showBrush && (
              <PatternLines
                id="brush_pattern"
                height={12}
                width={12}
                stroke={"#a3daff"}
                strokeWidth={1}
                orientation={["diagonal"]}
              />
            )}
            {(gridRows !== false || gridColumns !== false) && (
              <Grid gridRows={gridRows} gridColumns={gridColumns} />
            )}
            {chartType.includes("bar") && (
              <BarSeries
                horizontal={renderHorizontally}
                dataKeys={dataKeys ? dataKeys : null}
                // dataKey={dataKeys ? null : measureInfo[0].qFallbackTitle}
                dataKey={measureInfo[0].qFallbackTitle}
                data={currData}
                {...dataAccessors[0]}
              />
            )}
            {chartType.includes("stackedbar") && (
              <StackedBar horizontal={renderHorizontally}>
                {dimensionCount <= 1
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
              </StackedBar>
            )}
            {chartType.includes("groupedbar") && (
              <Group horizontal={renderHorizontally}>
                {dimensionCount <= 1
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
                {measureInfo.map((measure, index) => (
                  <LineSeries
                    key={measureInfo[index].qFallbackTitle}
                    dataKey={measureInfo[index].qFallbackTitle}
                    glyph={measureInfo[index].qShowPoints}
                    strokeDasharray={measure.qLegendShape}
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
              measureCount > 1 &&
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
                    glyph={measure.qShowPoints}
                    strokeDasharray={measure.qLegendShape}
                    data={currData}
                    {...dataAccessors[index]}
                    strokeWidth={1.5}
                  />
                )
              )}
            {chartType.includes("area") &&
              dimensionCount <= 1 &&
              measureInfo.map((measure, index) => (
                <AreaSeries
                  key={measureInfo[index].qFallbackTitle}
                  dataKey={measureInfo[index].qFallbackTitle}
                  glyph={measureInfo[index].qShowPoints}
                  fillStyle={measureInfo[index].qFillStyle || fillStyle}
                  data={currData}
                  {...dataAccessors[index]}
                  strokeWidth={1.5}
                />
              ))}
            {chartType.includes("stackedarea") && (
              <StackedArea>
                {dimensionCount <= 1
                  ? measureInfo.map((measure, index) => (
                      <AreaSeries
                        key={measureInfo[index].qFallbackTitle}
                        dataKey={measureInfo[index].qFallbackTitle}
                        glyph={measureInfo[index].qShowPoints}
                        fillStyle={measureInfo[index].qFillStyle || fillStyle}
                        data={currData}
                        {...dataAccessors[index]}
                        strokeWidth={1.5}
                      />
                    ))
                  : dataKeys.map((measure, index) => (
                      <AreaSeries
                        key={measureInfo[index].qFallbackTitle}
                        dataKey={measureInfo[index].qFallbackTitle}
                        glyph={measureInfo[index].qShowPoints}
                        fillStyle={measureInfo[index].qFillStyle || fillStyle}
                        data={currData}
                        {...dataAccessors[index]}
                        strokeWidth={1.5}
                      />
                    ))}
              </StackedArea>
            )}
            {chartType.includes("scatter") &&
              singleDimension &&
              measureCount === 2 && (
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
            {showBrush && (
              <Brush
                xAxisOrientation={xAxisOrientation}
                yAxisOrientation={yAxisOrientation}
                selectedBoxStyle={selectedBoxStyle}
                brushDirection={"horizontal"}
                brushRegion={"chart"}
                handleSize={8}
              />
            )}
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
