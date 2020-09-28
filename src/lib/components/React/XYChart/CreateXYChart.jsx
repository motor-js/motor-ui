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
import Tooltip from "./xy-chart/components/Tooltip";
import CrossHair from "./xy-chart/components/CrossHair";
import Legend from "./xy-chart/components/Legend";
import CustomLegendShape from "./xy-chart/components/CustomLegendShape";
import Group from "./xy-chart/components/series/Group";
import Title from "./xy-chart/components/titles/Title";
import StackedBar from "./xy-chart/components/series/StackedBar";
import StackedArea from "./xy-chart/components/series/StackedArea";
import ChartBackground from "./xy-chart/components/aesthetic/Gradient";
import Grid from "./xy-chart/components/grids/Grid";
import Brush from "./xy-chart/components/selection/Brush";
import { timeParse, timeFormat } from "d3-time-format";

import { roundNumber } from "./xy-chart/utils/roundNumber";
import { selectColor } from "../../../utils/colors";
import { PatternLines } from "./xy-chart/components/aesthetic/Patterns";
import { colorByExpression } from "../../../utils";
import { valueIfUndefined, isDefined } from "./xy-chart/utils/chartUtils";

// const Console = (prop) => (
//   console[Object.keys(prop)[0]](...Object.values(prop)),
//   null // ➜ React components must return something
// );

// formatDate(new Date((d - (25567 + 1)) * 86400 * 1000));

const legendLabelFormat = (d) => d;

const axisTopMargin = { top: 40, right: 50, bottom: 30, left: 50 };
const axisBottomMargin = { top: 30, right: 50, bottom: 40, left: 50 };

export default function CreateXYChart({
  width,
  height,
  events = false,
  data,
  keys,
  dataKeys,
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
  size,
  renderHorizontally,
  includeZero,
  xAxisOrientation,
  yAxisOrientation,
  showLegend,
  legendLeftRight,
  legendTopBottom,
  legendDirection,
  legendShape,
  backgroundPattern,
  backgroundStyle,
  fillStyle,
  showLabels,
  showPoints,
  dualAxis,
  roundNum,
  precision,
  crossHairStyles,
  hideAxisLine,
  gridRows,
  gridColumns,
  selectionMethod,
  enableBrush,
  showBrush,
  showAsPercent,
  showAxisLabels,
  singleMeasure,
  singleDimension,
  dimensionCount,
  measureCount,
  title,
  subTitle,
  legendLabelStyle,
  valueLabelStyle,
  showClosestItem,
  useSingleColor,
  numDimensionTicks,
  numMeasureTicks,
  numMeasureDualTicks,
  parseDateFormat,
  formatAxisDate,
  formatTooltipDate,
  strokeWidth,
  showCrossHair,
}) {
  // const showTitles = true; // resize height of chart if title shown
  const getChartType = () =>
    type ? type : singleDimension && singleMeasure ? "bar" : "groupedbar";

  const chartType = [getChartType()];

  const [currData, setCurrData] = useState(data);

  //  const formatDate = timeFormat("%d %B, %Y");
  const formatDate = timeFormat(formatAxisDate);

  const dateFormatter = (d) => formatDate(timeParse(parseDateFormat)(d));
  // const dateFormatter = (d) => {
  //   return formatDate(
  //     parseDateFormat === "Excel"
  //       ? new Date((d - (25567 + 1)) * 86400 * 1000)
  //       : timeParse(parseDateFormat)(d)
  //   );
  // };

  // const isContinuousAxes = dimensionInfo[0].qContinuousAxes || false;

  // const getDimension = (d) => (isContinuousAxes ? d[0].qNum : d[0].qText);
  const getDimension = (d) => d[0].qText;
  const getSeriesValues = (d, colIndex) =>
    isDefined(d[colIndex]) ? Number(d[colIndex].qNum) : 0;
  const getElementNumber = (d) => d[0].qElemNumber;

  // const getDimension = (d) =>
  //   new Date(
  //     d[0].qText.split("/")[2],
  //     d[0].qText.split("/")[1] - 1,
  //     d[0].qText.split("/")[0]
  //   );

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
  // const dateScaleConfig = useMemo(() => ({ type: "time" }), []);

  // const dateScaleConfig = useMemo(
  //   () => (isContinuousAxes ? { type: "time" } : { type: "band", padding }),
  //   []
  // );

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
    ...theme.xyChart,
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
    stroke: selectColor(xyChart?.brush.stroke, theme) ?? "#329af0",
  };

  const chartHideAxisLine = valueIfUndefined(
    hideAxisLine,
    xyChart.hideAxisLine
  );

  const chartShowAxisLabels = valueIfUndefined(
    showAxisLabels,
    xyChart.showAxisLabels
  );

  chartShowAxisLabels === true ||
  chartShowAxisLabels === "both" ||
  chartShowAxisLabels === "xAxis"
    ? (axisBottomMargin.bottom = 60)
    : (axisBottomMargin.bottom = 40);

  const formatValue = (val) => {
    // if (val === 0) return roundNumber(Math.abs(val), 0);

    const valPrecision = valueIfUndefined(precision, xyChart.precision);
    const valRoundNum = valueIfUndefined(roundNum, xyChart.roundNum);

    if (showAsPercent) return `${(val * 100).toFixed(valPrecision ? 2 : 0)}%`;
    let formattedValue = valRoundNum
      ? roundNumber(Math.abs(val), valPrecision)
      : Math.abs(val);

    return val < 0 ? `-${formattedValue}` : formattedValue;
  };

  return (
    // <div className="container">

    <ChartProvider
      theme={themeObj}
      chartType={chartType}
      xScale={renderHorizontally ? valueScaleConfig : dateScaleConfig}
      yScale={renderHorizontally ? dateScaleConfig : valueScaleConfig}
      // isContinuousAxes={isContinuousAxes}
      colorScale={colorScaleConfig}
      showLabels={valueIfUndefined(showLabels, xyChart.showLabels)}
      showPoints={valueIfUndefined(showPoints, xyChart.showPoints)}
      roundNum={valueIfUndefined(roundNum, xyChart.roundNum)}
      precision={valueIfUndefined(precision, xyChart.precision)}
      size={size}
      dimensionInfo={dimensionInfo}
      measureInfo={measureInfo}
      dataKeys={dataKeys}
      beginSelections={beginSelections}
      select={select}
      setCurrentSelectionIds={setCurrentSelectionIds}
      currentSelectionIds={currentSelectionIds}
      singleDimension={singleDimension}
      singleMeasure={singleMeasure}
      formatValue={formatValue}
      legendLabelStyle={legendLabelStyle}
      valueLabelStyle={valueLabelStyle}
      parseDateFormat={parseDateFormat}
      formatTooltipDate={formatTooltipDate}
    >
      <EventProvider>
        {title && <Title title={title} subTitle={subTitle} />}
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
            // width={autoWidth ? undefined : width}
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
                height={xyChart?.brush.patternHeight ?? 12}
                width={xyChart?.brush.patternWidth ?? 12}
                stroke={
                  selectColor(xyChart?.brush.patternStroke, theme) ?? "#a3daff"
                }
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
                {dimensionCount <= 1
                  ? measureInfo.map((measure, index) => (
                      <LineSeries
                        key={measureInfo[index].qFallbackTitle}
                        dataKey={measureInfo[index].qFallbackTitle}
                        glyph={measureInfo[index].qShowPoints}
                        strokeDasharray={measure.qLegendShape}
                        data={currData}
                        {...dataAccessors[index]}
                        strokeWidth={strokeWidth}
                      />
                    ))
                  : dataKeys.map((measure, index) => (
                      <LineSeries
                        key={measure}
                        dataKey={measure}
                        data={currData}
                        {...dataAccessors[index]}
                        strokeWidth={strokeWidth}
                      />
                    ))}
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
                    strokeWidth={strokeWidth}
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
                  strokeWidth={strokeWidth}
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
                        strokeWidth={strokeWidth}
                      />
                    ))
                  : dataKeys.map((measure, index) => (
                      <AreaSeries
                        key={measure}
                        dataKey={measure}
                        // glyph={measureInfo[index].qShowPoints}
                        // fillStyle={measureInfo[index].qFillStyle || fillStyle}
                        data={currData}
                        {...dataAccessors[index]}
                        strokeWidth={strokeWidth}
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
            {/* Y axis */}
            <AxisComponent
              label={
                chartShowAxisLabels === true ||
                chartShowAxisLabels === "both" ||
                chartShowAxisLabels === "yAxis"
                  ? measureInfo[0].qFallbackTitle
                  : null
              }
              orientation={
                renderHorizontally ? xAxisOrientation : yAxisOrientation
              }
              numTicks={numMeasureTicks}
              hideAxisLine={
                chartHideAxisLine === true ||
                chartHideAxisLine === "both" ||
                chartHideAxisLine === "yAxis"
                  ? true
                  : false
              }
              tickFormat={(d) => formatValue(d)}
              // tickFormat={(d) => `${d * 100}%`}
              // tickLabelProps={() => ({
              //   fill: "red",
              //   fontSize: 11,
              //   textAnchor: "end",
              //   dy: "0.33em",
              // })}
              // labelProps={{
              //   x: width + 30,
              //   y: -10,
              //   fill: labelColor,
              //   fontSize: 18,
              //   strokeWidth: 0,
              //   stroke: "#fff",
              //   paintOrder: "stroke",
              //   fontFamily: "sans-serif",
              //   textAnchor: "start",
              // }}
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
            {/** Dimension axis */}
            <AxisComponent
              // label={dimensionInfo[0].qFallbackTitle}
              label={
                chartShowAxisLabels === true ||
                chartShowAxisLabels === "both" ||
                chartShowAxisLabels === "xAxis"
                  ? dimensionInfo[0].qFallbackTitle
                  : null
              }
              orientation={
                renderHorizontally ? yAxisOrientation : xAxisOrientation
              }
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
                  : currData
                      .filter(
                        (d, i, arr) =>
                          i %
                            Math.round((arr.length - 1) / numDimensionTicks) ===
                          0
                      )
                      .map((d) => getDimension(d))
              }
              tickFormat={(d) =>
                parseDateFormat && formatAxisDate ? dateFormatter(d) : d
              }
              // width > 400 || isContinuousAxes ? dateFormatter(d) : null
            />
            {showCrossHair && (
              <CrossHair
                fullHeight={valueIfUndefined(
                  crossHairStyles && crossHairStyles.fullHeight,
                  xyChart.crossHair.fullHeight
                )}
                fullWidth={valueIfUndefined(
                  crossHairStyles && crossHairStyles.fullWidth,
                  xyChart.crossHair.fullWidth
                )}
                circleSize={valueIfUndefined(
                  crossHairStyles && crossHairStyles.circleSize,
                  xyChart.crossHair.circleSize
                )}
                showHorizontalLine={valueIfUndefined(
                  crossHairStyles && crossHairStyles.showHorizontalLine,
                  xyChart.crossHair.showHorizontalLine
                )}
                showVerticalLine={valueIfUndefined(
                  crossHairStyles && crossHairStyles.showVerticalLine,
                  xyChart.crossHair.showVerticalLine
                )}
                strokeDasharray=""
                circleStyles={valueIfUndefined(
                  crossHairStyles && crossHairStyles.circleStyles,
                  xyChart.crossHair.circleStyles
                )}
                lineStyles={valueIfUndefined(
                  crossHairStyles && crossHairStyles.lineStyles,
                  xyChart.crossHair.lineStyles
                )}
                showCircle={valueIfUndefined(
                  crossHairStyles && crossHairStyles.showCircle,
                  xyChart.crossHair.showCircle
                )}
                showMultipleCircles={valueIfUndefined(
                  crossHairStyles && crossHairStyles.showMultipleCircles,
                  xyChart.crossHair.showMultipleCircles
                )}
                stroke={valueIfUndefined(
                  crossHairStyles && crossHairStyles.stroke,
                  xyChart.crossHair.stroke
                )}
                strokeDasharray={valueIfUndefined(
                  crossHairStyles && crossHairStyles.strokeDasharray,
                  xyChart.crossHair.strokeDasharray
                )}
                strokeWidth={valueIfUndefined(
                  crossHairStyles && crossHairStyles.strokeWidth,
                  xyChart.crossHair.strokeWidth
                )}
              />
            )}
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
            snapToDataX={canSnapTooltipToDataX}
            snapToDataY={canSnapTooltipToDataY}
            showClosestItem={valueIfUndefined(
              showClosestItem,
              xyChart.tooltip.showClosestItem
            )}
            useSingleColor={valueIfUndefined(
              useSingleColor,
              xyChart.tooltip.useSingleColor
            )}
          />
          {legendTopBottom === "bottom" && legend}
        </div>
      </EventProvider>
    </ChartProvider>
  );
}
