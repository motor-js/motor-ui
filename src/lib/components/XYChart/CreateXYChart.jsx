import React from "react";

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

import ExampleControls from "./ExampleControls";
import CustomChartBackground from "./CustomChartBackground";

export default function CreateXYChart({ height }) {
  return (
    <ExampleControls>
      {({
        accessors,
        animationTrajectory,
        config,
        data,
        numTicks,
        renderBarGroup,
        renderBarSeries,
        renderBarStack,
        renderHorizontally,
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
        xAxisOrientation,
        yAxisOrientation,
      }) => (
        <DataProvider theme={theme} xScale={config.x} yScale={config.y}>
          <XYChart height={Math.min(400, height)}>
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
