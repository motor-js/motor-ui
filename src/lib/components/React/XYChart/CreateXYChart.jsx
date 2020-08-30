/* eslint-disable unicorn/consistent-function-scoping */
import React, { useState, useMemo, useEffect } from "react";
// import defaultTheme from "../..//VX/theme/default";
import Axis from "./xy-chart/components/Axis";
import AnimatedAxis from "./xy-chart/components/AnimatedAxis";
import ChartProvider from "./xy-chart/components/providers/ChartProvider";
import XYChart from "./xy-chart/components/XYChart";
import BarSeries from "./xy-chart/components/series/BarSeries";
import LineSeries from "./xy-chart/components/series/LineSeries";
import ChartBackground from "./xy-chart/components/ChartBackground";
import EventProvider from "./xy-chart/components/providers/TooltipProvider";
import Tooltip, { RenderTooltipArgs } from "./xy-chart/components/Tooltip";
import Legend from "./xy-chart/components/Legend";
import CustomLegendShape from "./xy-chart/components/CustomLegendShape";
import Group from "./xy-chart/components/series/Group";
import Stack from "./xy-chart/components/series/Stack";
// import Grid from "./xy-chart/components/grids/Grid";

import { roundNumber, colorByExpression } from "../../../utils";

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
  dualAxis,
  roundNum,
  precision,
}) {
  // let datum = [];

  // const newData = qMatrix.map((d, i) => {
  //   const dim = d[0];
  //   const measure = d[1];
  //   measure.qNum = d[2].qNum;
  //   console.log(i, d);
  //   datum.push(measure);
  //   if (i !== 0 || i === ) {
  //   }

  //   // return [d[0], d[1]];
  // });
  const newData = qMatrix;

  const data = dimensionInfo.length === 1 ? qMatrix : newData;

  const [currData, setCurrData] = useState(data);

  // const dualAxis = false; // add to props and theme

  const getSeriesValues = (d, colIndex) =>
    dimensionInfo.length !== 1 ? Number(d[1].qNum) : Number(d[colIndex].qNum);

  const getChartType = () =>
    type
      ? type
      : dimensionInfo.length === 1 && measureInfo.length === 1
      ? "bar"
      : "groupedbar";

  const [chartType, setchartType] = useState([getChartType()]);

  // console.log(chartType, newData);
  // console.log(qMatrix);

  const dataKeys =
    multiColor && dimensionInfo.length == 1 && measureInfo.length === 1
      ? data.map((d) => d[0].qText)
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

  const renderTooltip = ({ closestData, closestDatum, colorScale }) => (
    <>
      <div>{closestDatum.datum[0].qText}</div>
      {/* <Console log={closestDatum.datum[0].qText} /> */}
      <br />
      {dimensionInfo.length === 1 && measureInfo.length === 1 && dataKeys && (
        <div
          style={{
            color: colorScale(`${closestDatum.datum[0].qText}`),
            textDecoration: "underline solid currentColor",
          }}
        >
          {measureInfo[0].qFallbackTitle} {closestDatum.datum[1].qNum}
        </div>
      )}
      {measureInfo.map(
        (measure, index) =>
          closestData?.[`${measure.qFallbackTitle}`] &&
          closestDatum.datum[0].qText ===
            closestData[`${measure.qFallbackTitle}`].datum[0].qText && (
            <div
              key={measure.qFallbackTitle}
              style={{
                color: colorScale(`${measure.qFallbackTitle}`),
                textDecoration:
                  closestDatum.key === `${measure.qFallbackTitle}`
                    ? "underline solid currentColor"
                    : "none",
              }}
            >
              {measure.qFallbackTitle}{" "}
              {closestData[`${measure.qFallbackTitle}`].datum[index + 1].qNum}
            </div>
          )
      )}
    </>
  );

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

  const dataAccessors = measureInfo.map((measure, index) =>
    useAccessors(
      getSeriesValues,
      dimensionInfo.length + index,
      renderHorizontally
    )
  );

  useEffect(() => {
    setCurrData(data);
  }, [data]);

  // Check if conditionalColors and if so get the returned color pallette
  const colors = colorByExpression(qHyperCube, data, colorPalette);

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

  return (
    // <div className="container">

    <ChartProvider
      theme={themeObj}
      xScale={renderHorizontally ? valueScaleConfig : dateScaleConfig}
      yScale={renderHorizontally ? dateScaleConfig : valueScaleConfig}
      colorScale={colorScaleConfig}
      roundNum={roundNum}
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
          >
            (
            <ChartBackground backgroundPattern={backgroundPattern} />)
            {/* <Grid
          top={margin.top}
          left={margin.left}
          xScale={dateScale}
          yScale={temperatureScale}
          width={xMax}
          height={yMax}
          stroke="black"
          strokeOpacity={0.1}
          xOffset={dateScale.bandwidth() / 2}
        /> */}
            {chartType.includes("bar") && (
              <BarSeries
                horizontal={renderHorizontally}
                showLabels={showLabels}
                // dataKey={measureInfo[0].qFallbackTitle}
                dataKeys={dataKeys ? dataKeys : null}
                dataKey={dataKeys ? null : measureInfo[0].qFallbackTitle}
                data={currData}
                roundNum={roundNum}
                precision={precision}
                {...dataAccessors[0]}
              />
            )}
            {chartType.includes("stackedbar") && (
              <Stack horizontal={renderHorizontally}>
                {measureInfo.map((measure, index) => (
                  <BarSeries
                    key={measureInfo[index].qFallbackTitle}
                    dataKey={measureInfo[index].qFallbackTitle}
                    data={currData}
                    {...dataAccessors[index]}
                  />
                ))}
              </Stack>
            )}
            {chartType.includes("groupedbar") && (
              <Group horizontal={renderHorizontally} showLabels={showLabels}>
                {measureInfo.map((measure, index) => (
                  <BarSeries
                    key={measureInfo[index].qFallbackTitle}
                    dataKey={measureInfo[index].qFallbackTitle}
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
                    data={currData}
                    {...dataAccessors[index]}
                    strokeWidth={1.5}
                  />
                ))}
              </>
            )}
            {chartType.includes("combo") && measureInfo.length > 1 && (
              <>
                <BarSeries
                  key={measureInfo[0].qFallbackTitle}
                  dataKey={measureInfo[0].qFallbackTitle}
                  data={currData}
                  {...dataAccessors[0]}
                />
                <LineSeries
                  dataKey={measureInfo[1].qFallbackTitle}
                  data={currData}
                  {...dataAccessors[1]}
                  strokeWidth={1.5}
                />
              </>
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
            renderTooltip={renderTooltip}
          />
          {legendTopBottom === "bottom" && legend}
        </div>
      </EventProvider>
    </ChartProvider>
  );
}
