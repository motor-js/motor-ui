import React, { useMemo } from "react";

import {
  AnimatedAreaSeries,
  AnimatedAxis,
  AnimatedBarGroup,
  AnimatedBarSeries,
  AnimatedBarStack,
  AnimatedGlyphSeries,
  AnimatedGrid,
  AnimatedLineSeries,
  AreaSeries,
  DataProvider,
  GlyphSeries,
  BarGroup,
  BarSeries,
  BarStack,
  LineSeries,
  Tooltip,
  XYChart,
} from "../visx";

import cityTemperature from "@visx/mock-data/lib/mocks/cityTemperature";

import { colorByExpression, selectColor } from "../../utils";
import { buildChartTheme } from "../visx";
import { lightTheme, darkTheme } from "../visx";

import CustomChartBackground from "./CustomChartBackground";
import CustomChartPattern from "./CustomChartPattern";

import { isDefined } from "../visx/typeguards/isDefined";

const dateScaleConfig = { type: "band", paddingInner: 0.3 };
// const dateScaleConfig = useMemo(() => ({ type: "band", padding }), []);
const valueScaleConfig = { type: "linear" };
//  const valueScaleConfig = useMemo(
//    () => ({
//      type: "linear",
//      clamp: true,
//      nice: true,
//      domain: undefined,
//      includeZero,
//    }),
//    [includeZero]
//  );

// const getDate = (d) => d.date;
// const getSfTemperature = (d) => Number(d["San Francisco"]);
// const getNyTemperature = (d) => Number(d["New York"]);
// const getAustinTemperature = (d) => Number(d.Austin);

// const data = cityTemperature.slice(200, 275);
// const dataSmall = data.slice(0, 25);

export default function CreateXYChart({
  height,
  qLayout: {
    qHyperCube,
    qHyperCube: { qMeasureInfo: measureInfo, qDimensionInfo: dimensionInfo },
  },
  data,
  xAxisOrientation,
  yAxisOrientation,
  renderHorizontally,
  beginSelections,
  select,
  setCurrentSelectionIds,
  currentSelectionIds,
  colorPalette,
  theme,
  size,
  type,
  backgroundPattern,
  backgroundStyle,
  singleDimension,
  singleMeasure,
  measureCount,
  dimensionCount,

  animationTrajectory = "center", // "outside","min","max"
  numTicks = 4,
  sharedTooltip = true,
  showGridColumns = true,
  showGridRows = true,
  showHorizontalCrosshair = false,
  showTooltip = true,
  showVerticalCrosshair = true,
  snapTooltipToDatumX = false,
  snapTooltipToDatumY = false,
}) {
  // Check if conditionalColors and if so get the returned color pallette
  const colors = colorByExpression(qHyperCube, data, colorPalette);
  const chartType = type;
  // const {
  //   global: { chart },
  //   crossHair: crossHairStyle,
  // } = theme;

  // console.log(darkTheme);
  // const isContinuousAxes = dimensionInfo[0].qContinuousAxes || false;

  const isScatter = chartType.includes("scatter");

  // const getDimension = (d) => (isContinuousAxes ? d[0].qNum : d[0].qText);
  const getDimension = (d) => d[0].qText;

  const getSeriesValues = (d, dataKey) => {
    if (!d) return null;
    let colIndex;
    measureInfo.some(function(x, i) {
      if (x.qFallbackTitle === dataKey) return (colIndex = i);
    });
    colIndex += dimensionInfo.length;
    return isDefined(d[colIndex]) ? Number(d[colIndex].qNum) : 0;
  };

  const getElementNumber = (d) => d[0].qElemNumber;

  const chartTheme = {
    ...theme.global.chart,
    bar: { ...theme.bar },
    points: { ...theme.points },
    stackedArea: { ...theme.stackedArea },
    scatter: { ...theme.scatter },
    ...darkTheme,
    // colors,
  };

  //  const accessors = useMemo(
  //    () => ({
  //      x: {
  //        "San Francisco": renderHorizontally ? getSfTemperature : getDate,
  //        "New York": renderHorizontally ? getNyTemperature : getDate,
  //        Austin: renderHorizontally ? getAustinTemperature : getDate,
  //      },
  //      y: {
  //        "San Francisco": renderHorizontally ? getDate : getSfTemperature,
  //        "New York": renderHorizontally ? getDate : getNyTemperature,
  //        Austin: renderHorizontally ? getDate : getAustinTemperature,
  //      },
  //      date: getDate,
  //    }),
  //    [renderHorizontally]
  //  );

  // console.log(data);

  const xAaccessors = measureInfo
    .map((measure) => {
      return {
        id: [measure.qFallbackTitle],
        function: renderHorizontally ? getSeriesValues : getDimension,
      };
    })
    .reduce((acc, cur) => ({ ...acc, [cur.id]: cur.function }), {});

  const yAaccessors = measureInfo
    .map((measure) => {
      return {
        id: [measure.qFallbackTitle],
        function: renderHorizontally ? getDimension : getSeriesValues,
      };
    })
    .reduce((acc, cur) => ({ ...acc, [cur.id]: cur.function }), {});

  const accessors = useMemo(
    () => ({
      x: xAaccessors,
      y: yAaccessors,
      date: getDimension,
    }),
    [renderHorizontally]
  );

  const config = useMemo(
    () => ({
      x: renderHorizontally ? valueScaleConfig : dateScaleConfig,
      y: renderHorizontally ? dateScaleConfig : valueScaleConfig,
    }),
    [renderHorizontally]
  );

  return (
    <DataProvider theme={chartTheme} xScale={config.x} yScale={config.y}>
      <XYChart height={Math.min(400, height)}>
        {/* <XYChart height={height}> */}
        <CustomChartBackground
          style={backgroundStyle.style}
          from={backgroundStyle.styleFrom}
          to={backgroundStyle.styleTo}
        />
        <CustomChartPattern backgroundPattern={backgroundPattern} />
        <AnimatedGrid
          key={`grid-${animationTrajectory}`} // force animate on update
          rows={showGridRows}
          columns={showGridColumns}
          animationTrajectory={animationTrajectory}
          numTicks={numTicks}
        />
        {chartType === "barstack" && (
          <BarStack horizontal={renderHorizontally}>
            <BarSeries
              dataKey="New York"
              data={data}
              xAccessor={accessors.x["New York"]}
              yAccessor={accessors.y["New York"]}
            />
            <BarSeries
              dataKey="San Francisco"
              data={data}
              xAccessor={accessors.x["San Francisco"]}
              yAccessor={accessors.y["San Francisco"]}
            />
            <BarSeries
              dataKey="Austin"
              data={data}
              xAccessor={accessors.x.Austin}
              yAccessor={accessors.y.Austin}
            />
          </BarStack>
        )}
        {chartType === "bargroup" && (
          <BarGroup horizontal={renderHorizontally}>
            {/* <BarSeries
              dataKey="New York"
              data={data}
              xAccessor={accessors.x["New York"]}
              yAccessor={accessors.y["New York"]}
            />
            <BarSeries
              dataKey="San Francisco"
              data={data}
              xAccessor={accessors.x["San Francisco"]}
              yAccessor={accessors.y["San Francisco"]}
            />
            <BarSeries
              dataKey="Austin"
              data={data}
              xAccessor={accessors.x.Austin}
              yAccessor={accessors.y.Austin}
            /> */}
            {singleDimension
              ? measureInfo.map((measure, index) => (
                  <BarSeries
                    key={measureInfo[index].qFallbackTitle}
                    // dataKey={measureInfo[index].qFallbackTitle}
                    // data={currData}
                    // {...dataAccessors[index]}
                    dataKey={measureInfo[index].qFallbackTitle}
                    data={data}
                    xAccessor={accessors.x[measureInfo[index].qFallbackTitle]}
                    yAccessor={accessors.y[measureInfo[index].qFallbackTitle]}
                  />
                ))
              : dataKeys.map((measure, index) => (
                  <BarSeries
                    key={measure}
                    // dataKey={measure}
                    // data={currData}
                    // {...dataAccessors[index]}
                    dataKey={measure}
                    data={data}
                    xAccessor={accessors.x[measure]}
                    yAccessor={accessors.y[measure]}
                  />
                ))}
          </BarGroup>
        )}
        {chartType === "bar" && (
          <BarSeries
            dataKey={measureInfo[0].qFallbackTitle}
            data={data}
            xAccessor={accessors.x[measureInfo[0].qFallbackTitle]}
            yAccessor={accessors.y[measureInfo[0].qFallbackTitle]}
            horizontal={renderHorizontally}
          />
        )}
        {chartType === "line" && (
          <>
            <LineSeries
              dataKey="San Francisco"
              data={data}
              xAccessor={accessors.x["San Francisco"]}
              yAccessor={accessors.y["San Francisco"]}
              horizontal={!renderHorizontally}
            />
            <LineSeries
              dataKey="Austin"
              data={data}
              xAccessor={accessors.x.Austin}
              yAccessor={accessors.y.Austin}
              horizontal={!renderHorizontally}
            />
          </>
        )}
        {chartType === "combo" && (
          <>
            <BarSeries
              dataKey="San Francisco"
              data={data}
              xAccessor={accessors.x["San Francisco"]}
              yAccessor={accessors.y["San Francisco"]}
              horizontal={renderHorizontally}
            />
            <LineSeries
              dataKey="Austin"
              data={data}
              xAccessor={accessors.x.Austin}
              yAccessor={accessors.y.Austin}
              horizontal={renderHorizontally}
            />
          </>
        )}
        {chartType === "area" && (
          <>
            <>
              <AreaSeries
                dataKey="Austin"
                data={data}
                xAccessor={accessors.x.Austin}
                yAccessor={accessors.y.Austin}
                horizontal={renderHorizontally}
                fillOpacity={0.3}
              />
              <AreaSeries
                dataKey="San Francisco"
                data={data}
                xAccessor={accessors.x["San Francisco"]}
                yAccessor={accessors.y["San Francisco"]}
                horizontal={renderHorizontally}
                fillOpacity={0.3}
              />
            </>
          </>
        )}
        {chartType === "areastack" && (
          <>
            <BarSeries
              dataKey="San Francisco"
              data={data}
              xAccessor={accessors.x["San Francisco"]}
              yAccessor={accessors.y["San Francisco"]}
              horizontal={renderHorizontally}
            />
            <LineSeries
              dataKey="Austin"
              data={data}
              xAccessor={accessors.x.Austin}
              yAccessor={accessors.y.Austin}
              horizontal={renderHorizontally}
            />
          </>
        )}
        {chartType === "scatter" && (
          <GlyphSeries
            dataKey="San Francisco"
            data={data}
            xAccessor={accessors.x["San Francisco"]}
            yAccessor={accessors.y["San Francisco"]}
            renderGlyph={renderGlyph}
          />
        )}
        <AnimatedAxis
          key={`time-axis-${animationTrajectory}-${renderHorizontally}`}
          orientation={renderHorizontally ? yAxisOrientation : xAxisOrientation}
          numTicks={numTicks}
          animationTrajectory={animationTrajectory}
        />
        <AnimatedAxis
          key={`temp-axis-${animationTrajectory}-${renderHorizontally}`}
          label="Temperature (°F)"
          orientation={renderHorizontally ? xAxisOrientation : yAxisOrientation}
          numTicks={numTicks}
          animationTrajectory={animationTrajectory}
        />
        {showTooltip && (
          <Tooltip
            showHorizontalCrosshair={showHorizontalCrosshair}
            showVerticalCrosshair={showVerticalCrosshair}
            snapTooltipToDatumX={snapTooltipToDatumX}
            snapTooltipToDatumY={snapTooltipToDatumY}
            showDatumGlyph={
              (snapTooltipToDatumX || snapTooltipToDatumY) &&
              chartType !== "bargroup"
            }
            showSeriesGlyphs={sharedTooltip && chartType !== "bargroup"}
            renderTooltip={({ tooltipData, colorScale }) => (
              <>
                {/** date */}
                {(tooltipData?.nearestDatum?.datum &&
                  accessors.date(tooltipData?.nearestDatum?.datum)) ||
                  "No date"}
                <br />
                <br />
                {/** temperatures */}
                {(sharedTooltip
                  ? Object.keys(tooltipData?.datumByKey ?? {})
                  : [tooltipData?.nearestDatum?.key]
                )
                  .filter((city) => city)
                  .map((city) => (
                    <div key={city}>
                      <em
                        style={{
                          color: colorScale?.(city),
                          textDecoration:
                            tooltipData?.nearestDatum?.key === city
                              ? "underline"
                              : undefined,
                        }}
                      >
                        {city}
                      </em>
                      {tooltipData?.nearestDatum?.datum
                        ? accessors[renderHorizontally ? "x" : "y"][city](
                            tooltipData?.nearestDatum?.datum
                          )
                        : "–"}
                      ° F
                    </div>
                  ))}
              </>
            )}
          />
        )}
      </XYChart>
    </DataProvider>
  );
}
