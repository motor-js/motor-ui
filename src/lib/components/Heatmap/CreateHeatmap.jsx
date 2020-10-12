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
  ChartProvider,
  XYChart,
  BarSeries,
  Group,
  Title,
  ChartBackground,
} from "../visx";

import { timeParse, timeFormat } from "d3-time-format";

import { roundNumber } from "../visx/utils/roundNumber";
import { PatternLines } from "../visx/components/aesthetic/Patterns";
import { colorByExpression, selectColor } from "../../utils";
import { valueIfUndefined, isDefined } from "../visx/utils/chartUtils";
import { ParentSize } from "@visx/responsive";

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
  // renderHorizontally,
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
  multiColor,
}) {
  // const showTitles = true; // resize height of chart if title shown
  const getChartType = () =>
    type ? type : singleDimension && singleMeasure ? "bar" : "groupedbar";

  const chartType = [getChartType()];

  const [currData, setCurrData] = useState(data);

  const getDimension = (d) => d[0].qText;

  const getSeriesValues = (d, colIndex) => {
    return isDefined(d[colIndex]) ? Number(d[colIndex].qNum) : 0;
  };

  const getElementNumber = (d) => d[0].qElemNumber;

  /** memoize the accessor functions to prevent re-registering data. */
  function useAccessors(valueAccessor, column) {
    const xAccessor = (d) => getDimension(d);
    const yAccessor = (d) => valueAccessor(d, column);

    const elAccessor = (d) => getElementNumber(d);

    return useMemo(
      () => ({
        xAccessor,
        yAccessor,
        elAccessor,
      }),
      [valueAccessor]
    );
  }

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
          useAccessors(getSeriesValues, dimensionCount + index)
        )
      : keys.map((measure, index) =>
          useAccessors(getSeriesValues, dimensionCount - 1 + index)
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
    // points: { ...theme.points },
    // stackedArea: { ...theme.stackedArea },
    // scatter: { ...theme.scatter },
    colors,
  };

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

    if (showAsPercent) return `${(val * 100).toFixed(valPrecision)}%`;
    let formattedValue = valRoundNum
      ? roundNumber(Math.abs(val), valPrecision)
      : Math.abs(val);

    return val < 0 ? `-${formattedValue}` : formattedValue;
  };

  const xScale = dateScaleConfig;
  const yScale = valueScaleConfig;

  return (
    // <div className="container">

    <ChartProvider
      theme={themeObj}
      chartType={chartType}
      xScale={xScale}
      yScale={yScale}
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
      multiColor={multiColor}
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

            {chartType.includes("groupedbar") && (
              <Group horizontal={false}>
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
          </XYChart>
          {showTooltip && (
            <Tooltip
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
