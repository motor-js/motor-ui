import React, { useMemo } from "react";

import {
  // AnimatedAreaSeries,
  AnimatedAxis,
  // AnimatedBarGroup,
  // AnimatedBarSeries,
  // AnimatedBarStack,
  // AnimatedGlyphSeries,
  AnimatedGrid,
  // AnimatedLineSeries,
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

// import { Brush } from "@visx/brush";
// import Brush from "../visx/selection/Brush";

import {
  colorByExpression,
  selectColor,
  valueIfUndefined,
  isDefined,
} from "../../utils";
// import { PatternLines } from "@visx/pattern";
// import { buildChartTheme } from "../visx";
// import { lightTheme, darkTheme } from "../visx";
import { darkTheme } from "../visx";

import CustomChartBackground from "./CustomChartBackground";
import CustomChartPattern from "./CustomChartPattern";

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
  handleClick,
  beginSelections,
  select,
  setCurrentSelectionIds,
  currentSelectionIds,
  colorPalette,
  theme,
  dataKeys,
  includeZero,
  size,
  type,
  backgroundPattern,
  backgroundStyle,
  singleDimension,
  singleMeasure,
  measureCount,
  dimensionCount,
  selectionMethod,
  showLabels,
  padding,
  multiColor,
  // showBrush,
  // enableBrush,

  animationTrajectory = "center", // "outside","min","max"
  numTicks = 4,
  sharedTooltip = true,
  showGridColumns = true,
  showGridRows = true,
  showHorizontalCrosshair = false,
  showTooltip = false,
  showVerticalCrosshair = false,
  snapTooltipToDatumX = false,
  snapTooltipToDatumY = false,
}) {
  // Check if conditionalColors and if so get the returned color pallette
  const colors = colorByExpression(qHyperCube, data, colorPalette);
  const chartType = type;

  const dateScaleConfig = { type: "band", paddingInner: padding };
  // const dateScaleConfig = useMemo(() => ({ type: "band", padding }), []);
  // const dateScaleConfig = useMemo(() => ({ type: "time" }), []);

  // const dateScaleConfig = useMemo(
  //   () => (isContinuousAxes ? { type: "time" } : { type: "band", padding }),
  //   []
  // );
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

  const {
    global: { chart },
    crossHair: crossHairStyle,
  } = theme;

  // console.log(darkTheme);
  // const isContinuousAxes = dimensionInfo[0].qContinuousAxes || false;

  const isScatter = chartType.includes("scatter");

  // const getDimension = (d) => (isContinuousAxes ? d[0].qNum : d[0].qText);
  const getDimension = (d) => d[0].qText;

  const getSeriesValues = (d, i) => (isDefined(d[i]) ? Number(d[i].qNum) : 0);

  // const getSeriesValues = (d, index) => {
  //   if (!d) return null;
  //   return isDefined(d[index]) ? Number(d[index].qNum) : 0;
  // };

  const getElementNumber = (d) => d[0].qElemNumber;

  const selectedBoxStyle = {
    fill: "url(#brush_pattern)",
    stroke: selectColor(chart?.brush.stroke, theme) ?? "#329af0",
  };

  const chartTheme = {
    ...theme.global.chart,
    bar: { ...theme.bar },
    points: { ...theme.points },
    stackedArea: { ...theme.stackedArea },
    scatter: { ...theme.scatter },
    ...darkTheme,
    // colors,
  };

  const xAaccessors = singleDimension
    ? measureInfo
        .map((measure) => {
          return {
            id: [measure.qFallbackTitle],
            function: renderHorizontally ? getSeriesValues : getDimension,
          };
        })
        .reduce((acc, cur) => ({ ...acc, [cur.id]: cur.function }), {})
    : dataKeys
        .map((key) => {
          return {
            id: [key],
            function: renderHorizontally ? getSeriesValues : getDimension,
          };
        })
        .reduce((acc, cur) => ({ ...acc, [cur.id]: cur.function }), {});

  const yAaccessors = singleDimension
    ? measureInfo
        .map((measure) => {
          return {
            id: [measure.qFallbackTitle],
            function: renderHorizontally ? getDimension : getSeriesValues,
          };
        })
        .reduce((acc, cur) => ({ ...acc, [cur.id]: cur.function }), {})
    : dataKeys
        .map((key) => {
          return {
            id: [key],
            function: renderHorizontally ? getDimension : getSeriesValues,
          };
        })
        .reduce((acc, cur) => ({ ...acc, [cur.id]: cur.function }), {});

  const elAaccessors = singleDimension
    ? measureInfo
        .map((measure) => {
          return {
            id: [measure.qFallbackTitle],
            function: getElementNumber,
          };
        })
        .reduce((acc, cur) => ({ ...acc, [cur.id]: cur.function }), {})
    : dataKeys
        .map((key) => {
          return {
            id: [key],
            function: getElementNumber,
          };
        })
        .reduce((acc, cur) => ({ ...acc, [cur.id]: cur.function }), {});

  const accessors = useMemo(
    () => ({
      x: xAaccessors,
      y: yAaccessors,
      el: elAaccessors,
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
    <DataProvider
      theme={chartTheme}
      xScale={config.x}
      yScale={config.y}
      currentSelectionIds={currentSelectionIds}
      beginSelections={beginSelections}
      select={select}
      setCurrentSelectionIds={setCurrentSelectionIds}
      showTooltip={showTooltip}
      horizontal={renderHorizontally}
      showLabels={valueIfUndefined(showLabels, chart.showLabels)}
      includeZero={includeZero}
      multiColor={multiColor ? dataKeys : null}
    >
      <XYChart
        height={Math.min(400, height)}
        captureEvents={selectionMethod === "none"}
        // onMouseDown={selectionMethod === "brush" ? enableBrush : null}
      >
        {/* <XYChart height={height}> */}
        <CustomChartBackground
          style={backgroundStyle.style}
          from={backgroundStyle.styleFrom}
          to={backgroundStyle.styleTo}
        />
        <CustomChartPattern backgroundPattern={backgroundPattern} />
        {/* {showBrush && (
          <PatternLines
            id="brush_pattern"
            height={chart?.brush.patternHeight ?? 12}
            width={chart?.brush.patternWidth ?? 12}
            stroke={selectColor(chart?.brush.patternStroke, theme) ?? "#a3daff"}
            strokeWidth={1}
            orientation={["diagonal"]}
          />
        )} */}
        <AnimatedGrid
          key={`grid-${animationTrajectory}`} // force animate on update
          rows={showGridRows}
          columns={showGridColumns}
          animationTrajectory={animationTrajectory}
          numTicks={numTicks}
        />
        {chartType === "bar" && (
          <BarSeries
            dataKey={measureInfo[0].qFallbackTitle}
            data={data}
            index={dimensionInfo.length}
            xAccessor={accessors.x[measureInfo[0].qFallbackTitle]}
            yAccessor={accessors.y[measureInfo[0].qFallbackTitle]}
            elAccessor={accessors.el[measureInfo[0].qFallbackTitle]}
          />
        )}
        {chartType === "barstack" && (
          <BarStack horizontal={renderHorizontally}>
            {singleDimension
              ? measureInfo.map((measure, index) => (
                  <BarSeries
                    key={measureInfo[index].qFallbackTitle}
                    dataKey={measureInfo[index].qFallbackTitle}
                    index={index + dimensionInfo.length}
                    data={data}
                    xAccessor={accessors.x[measureInfo[index].qFallbackTitle]}
                    yAccessor={accessors.y[measureInfo[index].qFallbackTitle]}
                    elAccessor={accessors.el[measureInfo[index].qFallbackTitle]}
                  />
                ))
              : dataKeys.map((measure, index) => (
                  <BarSeries
                    key={measure}
                    dataKey={measure}
                    index={index + 1}
                    data={data}
                    xAccessor={accessors.x[measure]}
                    yAccessor={accessors.y[measure]}
                    elAccessor={accessors.el[measure]}
                  />
                ))}
          </BarStack>
        )}
        {chartType === "bargroup" && (
          <BarGroup horizontal={renderHorizontally}>
            {singleDimension
              ? measureInfo.map((measure, index) => (
                  <BarSeries
                    key={measureInfo[index].qFallbackTitle}
                    dataKey={measureInfo[index].qFallbackTitle}
                    data={data}
                    index={index + dimensionInfo.length}
                    xAccessor={accessors.x[measureInfo[index].qFallbackTitle]}
                    yAccessor={accessors.y[measureInfo[index].qFallbackTitle]}
                    elAccessor={accessors.el[measureInfo[index].qFallbackTitle]}
                  />
                ))
              : dataKeys.map((measure, index) => (
                  <BarSeries
                    key={measure}
                    dataKey={measure}
                    data={data}
                    index={index + 1}
                    xAccessor={accessors.x[measure]}
                    yAccessor={accessors.y[measure]}
                    elAccessor={accessors.el[measure]}
                  />
                ))}
          </BarGroup>
        )}
        {chartType === "combo" &&
          !singleMeasure &&
          measureInfo.map((measure, index) =>
            measure.qChartType === "bar" ? (
              <BarSeries
                key={measureInfo[index].qFallbackTitle}
                dataKey={measureInfo[index].qFallbackTitle}
                data={data}
                index={index + dimensionInfo.length}
                xAccessor={accessors.x[measureInfo[index].qFallbackTitle]}
                yAccessor={accessors.y[measureInfo[index].qFallbackTitle]}
                elAccessor={accessors.el[measureInfo[index].qFallbackTitle]}
              />
            ) : (
              <LineSeries
                key={measureInfo[index].qFallbackTitle}
                dataKey={measureInfo[index].qFallbackTitle}
                data={data}
                index={index + dimensionInfo.length}
                xAccessor={accessors.x[measureInfo[index].qFallbackTitle]}
                yAccessor={accessors.y[measureInfo[index].qFallbackTitle]}
                elAccessor={accessors.el[measureInfo[index].qFallbackTitle]}
              />
            )
          )}
        {chartType === "line" && (
          <>
            {singleDimension
              ? measureInfo.map((measure, index) => (
                  <LineSeries
                    key={measureInfo[index].qFallbackTitle}
                    dataKey={measureInfo[index].qFallbackTitle}
                    index={index + dimensionInfo.length}
                    data={data}
                    xAccessor={accessors.x[measureInfo[index].qFallbackTitle]}
                    yAccessor={accessors.y[measureInfo[index].qFallbackTitle]}
                    elAccessor={accessors.el[measureInfo[index].qFallbackTitle]}
                  />
                ))
              : dataKeys.map((measure, index) => (
                  <LineSeries
                    key={measure}
                    dataKey={measure}
                    index={index + 1}
                    data={data}
                    xAccessor={accessors.x[measure]}
                    yAccessor={accessors.y[measure]}
                    elAccessor={accessors.el[measure]}
                  />
                ))}
          </>
        )}
        {chartType === "area" && (
          <>
            {singleDimension
              ? measureInfo.map((measure, index) => (
                  <AreaSeries
                    key={measureInfo[index].qFallbackTitle}
                    dataKey={measureInfo[index].qFallbackTitle}
                    data={data}
                    index={index + dimensionInfo.length}
                    xAccessor={accessors.x[measureInfo[index].qFallbackTitle]}
                    yAccessor={accessors.y[measureInfo[index].qFallbackTitle]}
                    elAccessor={accessors.el[measureInfo[index].qFallbackTitle]}
                    fillOpacity={0.3}
                  />
                ))
              : dataKeys.map((measure, index) => (
                  <AreaSeries
                    key={measure}
                    dataKey={measure}
                    data={data}
                    index={index + 1}
                    xAccessor={accessors.x[measure]}
                    yAccessor={accessors.y[measure]}
                    elAccessor={accessors.el[measure]}
                    fillOpacity={0.3}
                  />
                ))}
          </>
        )}
        {chartType === "areastack" && (
          <>
            <BarSeries
              dataKey="San Francisco"
              data={data}
              xAccessor={accessors.x["San Francisco"]}
              yAccessor={accessors.y["San Francisco"]}
            />
            <LineSeries
              dataKey="Austin"
              data={data}
              xAccessor={accessors.x.Austin}
              yAccessor={accessors.y.Austin}
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
        {/* {showBrush && (
          <Brush
            chartType={chartType}
            measureInfo={measureInfo}
            dataKeys={dataKeys}
            singleDimension={singleDimension}
            xAxisOrientation={xAxisOrientation}
            yAxisOrientation={yAxisOrientation}
            selectedBoxStyle={selectedBoxStyle}
            brushDirection={renderHorizontally ? "vertical" : "horizontal"}
            brushRegion={"chart"}
            handleSize={8}
          />
        )} */}
      </XYChart>
    </DataProvider>
  );
}
