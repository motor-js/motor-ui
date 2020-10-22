import React, { useMemo } from "react";

import {
  AnimatedAxis,
  AnimatedGrid,
  DataProvider,
  BarGroup,
  BarSeries,
  BarStack,
  LineSeries,
  Tooltip,
  XYChart,
} from "../visx";

import { colorByExpression, selectColor } from "../../utils";
import { buildChartTheme } from "../visx";
import { lightTheme, darkTheme } from "../visx";

import ExampleControls from "./ExampleControls";
import CustomChartBackground from "./CustomChartBackground";

const dateScaleConfig = { type: "band", paddingInner: 0.3 };
const temperatureScaleConfig = { type: "linear" };
const getDate = (d) => d.date;
const getSfTemperature = (d) => Number(d["San Francisco"]);
const getNyTemperature = (d) => Number(d["New York"]);
const getAustinTemperature = (d) => Number(d.Austin);

export default function CreateXYChart({
  height,
  qLayout: {
    qHyperCube,
    qHyperCube: { qMeasureInfo: measureInfo, qDimensionInfo: dimensionInfo },
  },
  xAxisOrientation,
  yAxisOrientation,
  renderHorizontally,
  theme,
}) {
  // Check if conditionalColors and if so get the returned color pallette
  // const colors = colorByExpression(qHyperCube, data, colorPalette);
  // const {
  //   global: { chart },
  //   crossHair: crossHairStyle,
  // } = theme;

  const chartTheme = {
    ...theme.global.chart,
    bar: { ...theme.bar },
    points: { ...theme.points },
    stackedArea: { ...theme.stackedArea },
    scatter: { ...theme.scatter },
    ...darkTheme,
    // colors,
  };

  const accessors = useMemo(
    () => ({
      x: {
        "San Francisco": renderHorizontally ? getSfTemperature : getDate,
        "New York": renderHorizontally ? getNyTemperature : getDate,
        Austin: renderHorizontally ? getAustinTemperature : getDate,
      },
      y: {
        "San Francisco": renderHorizontally ? getDate : getSfTemperature,
        "New York": renderHorizontally ? getDate : getNyTemperature,
        Austin: renderHorizontally ? getDate : getAustinTemperature,
      },
      date: getDate,
    }),
    [renderHorizontally]
  );

  const config = useMemo(
    () => ({
      x: renderHorizontally ? temperatureScaleConfig : dateScaleConfig,
      y: renderHorizontally ? dateScaleConfig : temperatureScaleConfig,
    }),
    [renderHorizontally]
  );

  return (
    <ExampleControls>
      {({
        // accessors,
        animationTrajectory,
        // config,
        data,
        numTicks,
        renderBarGroup,
        renderBarSeries,
        renderBarStack,
        // renderHorizontally,
        renderLineSeries,
        sharedTooltip,
        showGridColumns,
        showGridRows,
        showHorizontalCrosshair,
        showTooltip,
        showVerticalCrosshair,
        snapTooltipToDatumX,
        snapTooltipToDatumY,
        theme,
        //  xAxisOrientation,
        //  yAxisOrientation,
      }) => (
        <DataProvider theme={chartTheme} xScale={config.x} yScale={config.y}>
          <XYChart height={Math.min(400, height)}>
            {/* <XYChart height={height}> */}
            <CustomChartBackground />
            <AnimatedGrid
              key={`grid-${animationTrajectory}`} // force animate on update
              rows={showGridRows}
              columns={showGridColumns}
              animationTrajectory={animationTrajectory}
              numTicks={numTicks}
            />
            {renderBarStack && (
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
            {renderBarGroup && (
              <BarGroup horizontal={renderHorizontally}>
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
              </BarGroup>
            )}
            {renderBarSeries && (
              <BarSeries
                dataKey="New York"
                data={data}
                xAccessor={accessors.x["New York"]}
                yAccessor={accessors.y["New York"]}
                horizontal={renderHorizontally}
              />
            )}
            {renderLineSeries && (
              <>
                <LineSeries
                  dataKey="San Francisco"
                  data={renderBarStack ? data : data}
                  xAccessor={accessors.x["San Francisco"]}
                  yAccessor={accessors.y["San Francisco"]}
                  horizontal={!renderHorizontally}
                />
                <LineSeries
                  dataKey="Austin"
                  data={renderBarStack ? data : data}
                  xAccessor={accessors.x.Austin}
                  yAccessor={accessors.y.Austin}
                  horizontal={!renderHorizontally}
                />
              </>
            )}
            <AnimatedAxis
              key={`time-axis-${animationTrajectory}-${renderHorizontally}`}
              orientation={
                renderHorizontally ? yAxisOrientation : xAxisOrientation
              }
              numTicks={numTicks}
              animationTrajectory={animationTrajectory}
            />
            <AnimatedAxis
              key={`temp-axis-${animationTrajectory}-${renderHorizontally}`}
              label="Temperature (°F)"
              orientation={
                renderHorizontally ? xAxisOrientation : yAxisOrientation
              }
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
                  !renderBarGroup
                }
                showSeriesGlyphs={sharedTooltip && !renderBarGroup}
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
                          </em>{" "}
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
      )}
    </ExampleControls>
  );
}
