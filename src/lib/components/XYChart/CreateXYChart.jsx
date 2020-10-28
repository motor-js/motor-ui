import React, { useMemo } from "react";

import {
  // AnimatedAreaSeries,
  Axis,
  AnimatedAxis,
  // AnimatedBarGroup,
  // AnimatedBarSeries,
  // AnimatedBarStack,
  // AnimatedGlyphSeries,
  Grid,
  AnimatedGrid,
  // AnimatedLineSeries,
  AreaSeries,
  DataProvider,
  // GlyphSeries,
  BarGroup,
  BarSeries,
  BarStack,
  LineSeries,
  Tooltip,
  Title,
  XYChart,
} from "../visx";

import Legend from "../visx/components/legend/Legend";
// import { Brush } from "@visx/brush";
// import Brush from "../visx/selection/Brush";

import {
  colorByExpression,
  selectColor,
  valueIfUndefined,
  isDefined,
  roundNumber,
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
  // dimensionCount,
  selectionMethod,
  showLabels,
  padding,
  multiColor,
  showClosestItem,
  useAnimatedAxes,
  useAnimatedGrid,
  animationTrajectory,
  dualAxis,
  roundNum,
  precision,
  showGridColumns,
  showGridRows,
  showAsPercent,
  hideAxisLine,
  showAxisLabels,
  numDimensionTicks,
  numMeasureTicks,
  numMeasureDualTicks,
  numGridRows,
  numGridColumns,
  parseDateFormat,
  formatAxisDate,
  title,
  subTitle,
  showTooltip,
  borderRadius,

  //-----

  showLegend,
  legendLeftRight,
  legendTopBottom,
  legendDirection,
  legendShape,
  // fillStyle,
  // showPoints,
  // curveShape,
  // crossHairStyles,
  // enableBrush,
  // showBrush,
  // legendLabelStyle,
  // valueLabelStyle,
  // useSingleColor,
  // formatTooltipDate,
  // strokeWidth,
  // showCrossHair,
  // snapToDataX,
  // snapToDataY,
  // shiftTooltipTop,
  // shiftTooltipLeft,
  // valueOnly,
  // valueWithText,
  // xAxisStyles,
  // yAxisStyles,
  // xTickStyles,
  // yTickStyles,
  // tooltipStyles,

  //-----

  showHorizontalCrosshair = false,

  showVerticalCrosshair = false,
  snapTooltipToDatumX = false,
  snapTooltipToDatumY = false,
}) {
  // Check if conditionalColors and if so get the returned color pallette
  const colors = colorByExpression(qHyperCube, data, colorPalette);
  const chartType = type;
  const sharedTooltip = !showClosestItem;

  const {
    global: { chart },
    crossHair: crossHairStyle,
  } = theme;

  const legendLabelFormat = (d) => d;

  const AxisComponent = useAnimatedAxes ? AnimatedAxis : Axis;
  const GridComponent = useAnimatedGrid ? AnimatedGrid : Grid;

  const chartHideAxisLine = valueIfUndefined(hideAxisLine, chart.hideAxisLine);

  const chartShowAxisLabels = valueIfUndefined(
    showAxisLabels,
    chart.showAxisLabels
  );

  // chartShowAxisLabels === true ||  // AG
  // chartShowAxisLabels === "both" ||
  // chartShowAxisLabels === "xAxis"
  //   ? (axisBottomMargin.bottom = 60)
  //   : (axisBottomMargin.bottom = 40);

  const formatValue = (val) => {
    // if (val === 0) return roundNumber(Math.abs(val), 0);

    const valPrecision = valueIfUndefined(precision, chart.precision);
    const valRoundNum = valueIfUndefined(roundNum, chart.roundNum);

    if (showAsPercent) return `${(val * 100).toFixed(valPrecision)}%`;
    let formattedValue = valRoundNum
      ? roundNumber(Math.abs(val), valPrecision)
      : Math.abs(val);

    return val < 0 ? `-${formattedValue}` : formattedValue;
  };

  const dateScaleConfig = {
    type: "band",
    paddingInner: padding,
  };
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

  // console.log(darkTheme);
  // const isContinuousAxes = dimensionInfo[0].qContinuousAxes || false;

  // const isScatter = chartType.includes("scatter");

  // const getDimension = (d) => (isContinuousAxes ? d[0].qNum : d[0].qText);
  const getDimension = (d) => (d[0] ? d[0].qText : null);

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

  const valueIndex = (key) =>
    singleDimension
      ? measureInfo
          .reduce(
            (combined, entry) =>
              entry ? combined.concat(entry.qFallbackTitle) : combined,
            []
          )
          .indexOf(key) + dimensionInfo.length
      : dataKeys.indexOf(key) + 1;

  // const colorScale = createOrdinalScale({
  //   domain: dataKeys ? dataKeys : measureInfo.map((d) => d.qFallbackTitle),
  //   range: colors,
  // });

  // // console.log(chart.legendLabelStyles, chart.legendStyles);

  const shape =
    legendShape === "auto"
      ? type === "line" || type === "area"
        ? "line"
        : "rect"
      : legendShape;

  return (
    <DataProvider
      theme={chartTheme}
      xScale={config.x}
      yScale={config.y}
      currentSelectionIds={currentSelectionIds}
      beginSelections={beginSelections}
      select={select}
      setCurrentSelectionIds={setCurrentSelectionIds}
      horizontal={renderHorizontally}
      showLabels={valueIfUndefined(showLabels, chart.showLabels)}
      includeZero={includeZero}
      multiColor={multiColor}
    >
      {title && (
        <Title
          borderRadius={borderRadius}
          title={title}
          subTitle={subTitle}
          size={size}
        />
      )}
      {legendTopBottom === "top" && <Legend shape={shape} size={size}></Legend>}
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
        <GridComponent
          key={`grid-${animationTrajectory}`} // force animate on update
          rows={showGridRows}
          columns={showGridColumns}
          animationTrajectory={animationTrajectory}
          numGridRows={valueIfUndefined(numGridRows, chart.numGridRows)}
          numGridColumns={valueIfUndefined(
            numGridColumns,
            chart.numGridColumns
          )}
        />
        {chartType === "bar" && (
          <BarSeries
            dataKey={measureInfo[0].qFallbackTitle}
            data={data}
            index={dimensionInfo.length}
            xAccessor={accessors.x[measureInfo[0].qFallbackTitle]}
            yAccessor={accessors.y[measureInfo[0].qFallbackTitle]}
            elAccessor={accessors.el[measureInfo[0].qFallbackTitle]}
            // legendShape="dashed-line"
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
                    opacity={0.3}
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
                    opacity={0.3}
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
        {chartType === "scatter" && singleDimension && measureCount >= 2 && (
          <GlyphSeries
            dataKey="San Francisco"
            data={data}
            xAccessor={accessors.x["San Francisco"]}
            yAccessor={accessors.y["San Francisco"]}
            renderGlyph={renderGlyph}
          />
        )}
        {/** X axis */}
        <AxisComponent
          key={`time-axis-${animationTrajectory}-${renderHorizontally}`}
          label={
            chartShowAxisLabels === true ||
            chartShowAxisLabels === "both" ||
            chartShowAxisLabels === "xAxis"
              ? chartType !== "scatter"
                ? dimensionInfo[0].qFallbackTitle
                : measureInfo[1].qFallbackTitle
              : null
          }
          orientation={renderHorizontally ? yAxisOrientation : xAxisOrientation}
          hideAxisLine={
            chartHideAxisLine === true ||
            chartHideAxisLine === "both" ||
            chartHideAxisLine === "xAxis"
              ? true
              : false
          }
          tickValues={
            numDimensionTicks === null
              ? null
              : data
                  .filter(
                    (d, i, arr) =>
                      i % Math.round((arr.length - 1) / numDimensionTicks) === 0
                  )
                  .map((d) => getDimension(d))
          }
          tickFormat={(d) =>
            parseDateFormat && formatAxisDate ? dateFormatter(d) : d
          }
          animationTrajectory={animationTrajectory}
          // width > 400 || isContinuousAxes ? dateFormatter(d) : null
        />
        {/* Y axis */}
        <AxisComponent
          key={`temp-axis-${animationTrajectory}-${renderHorizontally}`}
          label={
            chartShowAxisLabels === true ||
            chartShowAxisLabels === "both" ||
            chartShowAxisLabels === "yAxis"
              ? measureInfo[0].qFallbackTitle
              : null
          }
          orientation={renderHorizontally ? xAxisOrientation : yAxisOrientation}
          numTicks={numMeasureTicks}
          hideAxisLine={
            chartHideAxisLine === true ||
            chartHideAxisLine === "both" ||
            chartHideAxisLine === "yAxis"
              ? true
              : false
          }
          tickFormat={(d) => formatValue(d)}
          animationTrajectory={animationTrajectory}
        />
        {/* Y axis (dual)*/}
        {dualAxis && (
          <AxisComponent
            label={
              chartShowAxisLabels === true ||
              chartShowAxisLabels === "both" ||
              chartShowAxisLabels === "yAxis"
                ? measureInfo[1].qFallbackTitle
                : null
            }
            orientation="right"
            numTicks={numMeasureDualTicks}
            hideAxisLine={
              chartHideAxisLine === true ||
              chartHideAxisLine === "both" ||
              chartHideAxisLine === "yAxis"
                ? true
                : false
            }
          />
        )}
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
                {/** values */}
                {(sharedTooltip
                  ? Object.keys(tooltipData?.datumByKey ?? {})
                  : [tooltipData?.nearestDatum?.key]
                )
                  .filter((datum) => datum)
                  .map((datum) => (
                    <div key={datum}>
                      <em
                        style={{
                          color: dataKeys
                            ? colorScale?.(
                                accessors.date(tooltipData?.nearestDatum?.datum)
                              )
                            : colorScale?.(datum),
                          textDecoration:
                            tooltipData?.nearestDatum?.key === datum
                              ? "underline"
                              : undefined,
                        }}
                      >
                        {`${datum} `}
                      </em>
                      {tooltipData?.nearestDatum?.datum
                        ? accessors[renderHorizontally ? "x" : "y"][datum](
                            tooltipData?.nearestDatum?.datum,
                            valueIndex(datum)
                          )
                        : "–"}
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
      {legendTopBottom === "bottom" && legend}
    </DataProvider>
  );
}
