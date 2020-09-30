/* eslint-disable unicorn/consistent-function-scoping */
import React, { useState, useMemo, useEffect } from "react";
import ChartProvider from "../visx/components/providers/ChartProvider";
import XYChart from "../visx/components/XYChart";
import RadialChart from "../visx/components/RadialChart";
import ChartPattern from "../visx/components/ChartPattern";
import EventProvider from "../visx/components/providers/TooltipProvider";
import Tooltip from "../visx/components/Tooltip";
import Legend from "../visx/components/Legend";
import CustomLegendShape from "../visx/components/CustomLegendShape";
import Title from "../visx/components/titles/Title";
import ChartBackground from "../visx/components/aesthetic/Gradient";
import { timeParse, timeFormat } from "d3-time-format";

import ArcSeries from "../visx/components/series/ArcSeries";
import ArcLabel from "../visx/components/label/ArcLabel";

import { roundNumber } from "../visx/utils/roundNumber";
import { PatternLines } from "../visx/components/aesthetic/Patterns";
import { colorByExpression, selectColor } from "../../../utils";
import { valueIfUndefined, isDefined } from "../visx/utils/chartUtils";

import { browserUsage } from "@visx/mock-data";

const legendLabelFormat = (d) => d;

const axisTopMargin = { top: 40, right: 50, bottom: 30, left: 50 };
const axisBottomMargin = { top: 30, right: 50, bottom: 40, left: 50 };

export default function CreatePie({
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
  colorPalette,
  type,
  size,
  renderHorizontally,
  includeZero,
  xAxisOrientation,
  showLegend,
  legendLeftRight,
  legendTopBottom,
  legendDirection,
  legendShape,
  backgroundStyle,
  fillStyle,
  showLabels,
  roundNum,
  precision,
  selectionMethod,
  enableBrush,
  showAsPercent,
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
  parseDateFormat,
  formatTooltipDate,
  strokeWidth,
  showTooltip,

  shiftTooltipTop,
  shiftTooltipLeft,
  valueOnly,
  valueWithText,
}) {
  const [currData, setCurrData] = useState(data);

  // const dateFormatter = (d) => formatDate(timeParse(parseDateFormat)(d));

  // const getDimension = (d) => d[0].qText;
  // const getSeriesValues = (d, colIndex) =>
  //   isDefined(d[colIndex]) ? Number(d[colIndex].qNum) : 0;
  // const getElementNumber = (d) => d[0].qElemNumber;

  useEffect(() => {
    setCurrData(data);
  }, [data]);

  // const dateScaleConfig = useMemo(() => ({ type: "band", padding }), []);

  // const valueScaleConfig = useMemo(
  //   () => ({
  //     type: "linear",
  //     clamp: true,
  //     nice: true,
  //     domain: undefined,
  //     includeZero,
  //   }),
  //   [includeZero]
  // );

  const colorScaleConfig = () => ({
    domain: dataKeys ? dataKeys : measureInfo.map((d) => d.qFallbackTitle),
  });

  // Check if conditionalColors and if so get the returned color pallette
  const colors = colorByExpression(qHyperCube, data, colorPalette);

  const { xyChart } = theme;

  const themeObj = {
    ...theme.xyChart,
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

  /* eslint-disable react/prop-types */
  const chartProps = {
    ariaLabel: "This is a radial-chart chart of...",
    margin: { top: 0, left: 0, bottom: 0, right: 0 },
    width,
    height,
    renderTooltip: ({ datum, fraction }) => (
      <div>
        <div>
          <strong>{datum.label}</strong>
        </div>
        <div>{(fraction * 100).toFixed()}%</div>
      </div>
    ),
  };

  const browsersLast = browserUsage[browserUsage.length - 1];
  const browserFractions = Object.entries(browsersLast)
    .filter(([key]) => key !== "date")
    .map(([key, fraction]) => ({
      value: parseFloat(fraction),
      label: key,
    }));

  // const seriesProps = {
  //   data: browserFractions,
  //   pieValue: (d) => d.value,
  //   label: (arc) => `${arc.data.value.toFixed(1)}%`,
  //   labelComponent: <ArcLabel fill="#fff" fontSize={10} />,
  //   innerRadius: (radius) => 0.35 * radius,
  //   outerRadius: (radius) => 0.6 * radius,
  //   labelRadius: (radius) => 0.47 * radius,
  //   stroke: "#fff",
  //   strokeWidth: 1.5,
  // };

  return (
    <ChartProvider
      theme={themeObj}
      // chartType={chartType}
      // xScale={renderHorizontally ? valueScaleConfig : dateScaleConfig}
      // yScale={renderHorizontally ? dateScaleConfig : valueScaleConfig}
      colorScale={colorScaleConfig}
      showLabels={valueIfUndefined(showLabels, xyChart.showLabels)}
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
        {title && <Title title={title} subTitle={subTitle} size={size} />}
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
          {/* <XYChart
            height={height}
            // width={autoWidth ? undefined : width}
            margin={
              xAxisOrientation === "top" ? axisTopMargin : axisBottomMargin
            }
            captureEvents={selectionMethod === "none"}
            onMouseDown={selectionMethod === "brush" ? enableBrush : null}
          > */}
          <RadialChart
            {...chartProps}
            renderTooltip={({ datum, fraction }) => {
              const { label } = datum;
              const style = { color: categoryColorScale(label) };

              return (
                <div>
                  <div>
                    <strong style={style}>{label}</strong>
                  </div>
                  <div>{(fraction * 100).toFixed()}%</div>
                </div>
              );
            }}
          >
            {/* <ChartBackground
              style={backgroundStyle.style}
              id="area-background-gradient"
              from={backgroundStyle.styleFrom}
              to={backgroundStyle.styleTo}
            /> */}

            <ArcSeries
              // {...seriesProps}
              data={browserFractions}
              pieValue={(d) => d.value}
              label={(arc) => `${arc.data.value.toFixed(1)}%`}
              // labelComponent={<ArcLabel fill="#fff" fontSize={10} />}
              innerRadius={(radius) => 0.35 * radius}
              outerRadius={(radius) => 0.6 * radius}
              labelRadius={(radius) => 0.47 * radius}
              stroke={"#fff"}
              strokeWidth={1.5}
              labelComponent={
                <ArcLabel stroke="#222" fill="#fff" fontSize={10} />
              }
              innerRadius={0}
              // fill={(arc) => categoryColorScale(arc.data.label)}
              // fill={(arc) => colorScale(arc.data.label)}
              fill="red" // AG
            />
          </RadialChart>
          {/* </XYChart> */}
          {showTooltip && (
            <Tooltip
              showClosestItem={valueIfUndefined(
                showClosestItem,
                xyChart.tooltip.showClosestItem
              )}
              valueOnly={valueIfUndefined(valueOnly, xyChart.tooltip.valueOnly)}
              valueWithText={valueIfUndefined(
                valueWithText,
                xyChart.tooltip.valueWithText
              )}
              shiftTooltipTop={shiftTooltipTop}
              shiftTooltipLeft={shiftTooltipLeft}
              useSingleColor={valueIfUndefined(
                useSingleColor,
                xyChart.tooltip.useSingleColor
              )}
            />
          )}
          {legendTopBottom === "bottom" && legend}
        </div>
      </EventProvider>
    </ChartProvider>
  );
}
