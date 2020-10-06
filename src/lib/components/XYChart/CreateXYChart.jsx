/* eslint-disable unicorn/consistent-function-scoping */
import React, { useState, useMemo, useEffect } from "react";

import {
  AreaSeries,
  PointSeries,
  ChartPattern,
  EventProvider,
  Tooltip,
  CrossHair,
  Legend,
  CustomLegendShape,
  Axis,
  AnimatedAxis,
  ChartProvider,
  XYChart,
  BarSeries,
  LineSeries,
  Group,
  Title,
  StackedBar,
  StackedArea,
  ChartBackground,
  Grid,
  Brush,
} from "../visx";

import { timeParse, timeFormat } from "d3-time-format";

import { roundNumber } from "../visx/utils/roundNumber";
import { PatternLines } from "../visx/components/aesthetic/Patterns";
import { colorByExpression, selectColor } from "../../utils";
import { valueIfUndefined, isDefined } from "../visx/utils/chartUtils";
import { ParentSize } from "@visx/responsive";

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
  borderRadius,
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
  showTooltip,
  snapToDataX,
  snapToDataY,
  shiftTooltipTop,
  shiftTooltipLeft,
  valueOnly,
  valueWithText,
  xAxisStyles,
  yAxisStyles,
  xTickStyles,
  yTickStyles,
  tooltipStyles,
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

  const canSnapTooltipToDataX = valueIfUndefined(
    snapToDataX,
    (chartType.includes("groupedbar") && renderHorizontally) ||
      (chartType.includes("stackedbar") && !renderHorizontally) ||
      (chartType.includes("combo") && !renderHorizontally) ||
      chartType.includes("bar")
  );

  const canSnapTooltipToDataY = valueIfUndefined(
    snapToDataY,
    (chartType.includes("groupedbar") && !renderHorizontally) ||
      (chartType.includes("stackedbar") && renderHorizontally) ||
      (chartType.includes("combo") && !renderHorizontally) ||
      chartType.includes("bar")
  );

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
  const {
    global: { chart },
    crossHair: crossHairStyle,
  } = theme;

  const themeObj = {
    ...theme.global.chart,
    bar: { ...theme.bar },
    points: { ...theme.points },
    stackedArea: { ...theme.stackedArea },
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
    stroke: selectColor(chart?.brush.stroke, theme) ?? "#329af0",
  };

  const chartHideAxisLine = valueIfUndefined(hideAxisLine, chart.hideAxisLine);

  const chartShowAxisLabels = valueIfUndefined(
    showAxisLabels,
    chart.showAxisLabels
  );

  chartShowAxisLabels === true ||
  chartShowAxisLabels === "both" ||
  chartShowAxisLabels === "xAxis"
    ? (axisBottomMargin.bottom = 60)
    : (axisBottomMargin.bottom = 40);

  const formatValue = (val) => {
    // if (val === 0) return roundNumber(Math.abs(val), 0);

    const valPrecision = valueIfUndefined(precision, chart.precision);
    const valRoundNum = valueIfUndefined(roundNum, chart.roundNum);

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
      showLabels={valueIfUndefined(showLabels, chart.showLabels)}
      showPoints={valueIfUndefined(showPoints, chart.showPoints)}
      roundNum={valueIfUndefined(roundNum, chart.roundNum)}
      precision={valueIfUndefined(precision, chart.precision)}
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
      xAxisStyles={xAxisStyles}
      yAxisStyles={yAxisStyles}
      xTickStyles={xTickStyles}
      yTickStyles={yTickStyles}
      tooltipStyles={tooltipStyles}
    >
      <EventProvider>
        {title && (
          <Title
            borderRadius={borderRadius}
            title={title}
            subTitle={subTitle}
            size={size}
          />
        )}
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
              id="visx-background-gradient"
              from={backgroundStyle.styleFrom}
              to={backgroundStyle.styleTo}
            />
            <ChartPattern backgroundPattern={backgroundPattern} />
            {showBrush && (
              <PatternLines
                id="brush_pattern"
                height={chart?.brush.patternHeight ?? 12}
                width={chart?.brush.patternWidth ?? 12}
                stroke={
                  selectColor(chart?.brush.patternStroke, theme) ?? "#a3daff"
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
                {singleDimension
                  ? measureInfo.map((measure, index) => (
                      <LineSeries
                        key={measureInfo[index].qFallbackTitle}
                        dataKey={measureInfo[index].qFallbackTitle}
                        glyph={measureInfo[index].qShowPoints}
                        strokeDasharray={measureInfo[index].qLegendShape}
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
                        glyph={measure.qShowPoints}
                        strokeDasharray={measure.qLegendShape}
                        {...dataAccessors[index]}
                        strokeWidth={strokeWidth}
                      />
                    ))}
              </>
            )}
            {chartType.includes("combo") &&
              !singleMeasure &&
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
            {chartType.includes("area") && (
              <>
                {singleDimension
                  ? measureInfo.map((measure, index) => (
                      <AreaSeries
                        key={measureInfo[index].qFallbackTitle}
                        dataKey={measureInfo[index].qFallbackTitle}
                        glyph={measureInfo[index].qShowPoints}
                        strokeDasharray={measureInfo[index].qLegendShape}
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
                        data={currData}
                        glyph={measure.qShowPoints}
                        fillStyle={measure.qFillStyle || fillStyle}
                        strokeDasharray={measure.qLegendShape}
                        {...dataAccessors[index]}
                        strokeWidth={strokeWidth}
                      />
                    ))}
              </>
            )}
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
                        glyph={measureInfo.qShowPoints}
                        fillStyle={measureInfo.qFillStyle || fillStyle}
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
                horizontal={renderHorizontally}
                fullHeight={valueIfUndefined(
                  crossHairStyles && crossHairStyles.fullHeight,
                  crossHairStyle.fullHeight
                )}
                fullWidth={valueIfUndefined(
                  crossHairStyles && crossHairStyles.fullWidth,
                  crossHairStyle.fullWidth
                )}
                circleSize={valueIfUndefined(
                  crossHairStyles && crossHairStyles.circleSize,
                  crossHairStyle.circleSize
                )}
                showHorizontalLine={valueIfUndefined(
                  crossHairStyles && crossHairStyles.showHorizontalLine,
                  crossHairStyle.showHorizontalLine
                )}
                showVerticalLine={valueIfUndefined(
                  crossHairStyles && crossHairStyles.showVerticalLine,
                  crossHairStyle.showVerticalLine
                )}
                strokeDasharray=""
                circleStyles={valueIfUndefined(
                  crossHairStyles && crossHairStyles.circleStyles,
                  crossHairStyle.circleStyles
                )}
                lineStyles={valueIfUndefined(
                  crossHairStyles && crossHairStyles.lineStyles,
                  crossHairStyle.lineStyles
                )}
                showCircle={valueIfUndefined(
                  crossHairStyles && crossHairStyles.showCircle,
                  crossHairStyle.showCircle
                )}
                showMultipleCircles={valueIfUndefined(
                  crossHairStyles && crossHairStyles.showMultipleCircles,
                  crossHairStyle.showMultipleCircles
                )}
                stroke={valueIfUndefined(
                  crossHairStyles && crossHairStyles.stroke,
                  crossHairStyle.stroke
                )}
                circleStroke={valueIfUndefined(
                  crossHairStyles && crossHairStyles.circleStroke,
                  crossHairStyle.circleStroke
                )}
                circleFill={valueIfUndefined(
                  crossHairStyles && crossHairStyles.circleFill,
                  crossHairStyle.circleFill
                )}
                circleClosestFill={valueIfUndefined(
                  crossHairStyles && crossHairStyles.circleClosestFill,
                  crossHairStyle.circleClosestFill
                )}
                circleClosestStroke={valueIfUndefined(
                  crossHairStyles && crossHairStyles.circleClosestStroke,
                  crossHairStyle.circleClosestStroke
                )}
                circleStrokeWidth={valueIfUndefined(
                  crossHairStyles && crossHairStyles.circleStrokeWidth,
                  crossHairStyle.circleStrokeWidth
                )}
                strokeDasharray={valueIfUndefined(
                  crossHairStyles && crossHairStyles.strokeDasharray,
                  crossHairStyle.strokeDasharray
                )}
                strokeWidth={valueIfUndefined(
                  crossHairStyles && crossHairStyles.strokeWidth,
                  crossHairStyle.strokeWidth
                )}
                highlightClosetsCircle={valueIfUndefined(
                  crossHairStyles && crossHairStyles.highlightClosetsCircle,
                  crossHairStyle.highlightClosetsCircle
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
          {showTooltip && (
            <Tooltip
              snapToDataX={canSnapTooltipToDataX}
              snapToDataY={canSnapTooltipToDataY}
              showClosestItem={valueIfUndefined(
                showClosestItem,
                chart.tooltip.showClosestItem
              )}
              valueOnly={valueIfUndefined(valueOnly, chart.tooltip.valueOnly)}
              valueWithText={valueIfUndefined(
                valueWithText,
                chart.tooltip.valueWithText
              )}
              shiftTooltipTop={shiftTooltipTop}
              shiftTooltipLeft={shiftTooltipLeft}
              useSingleColor={valueIfUndefined(
                useSingleColor,
                chart.tooltip.useSingleColor
              )}
            />
          )}
          {legendTopBottom === "bottom" && legend}
        </div>
      </EventProvider>
    </ChartProvider>
  );
}
