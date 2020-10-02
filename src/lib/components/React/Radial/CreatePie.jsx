/* eslint-disable unicorn/consistent-function-scoping */
import React, { useState, useMemo, useEffect } from "react";
import ChartProvider from "../visx/components/providers/ChartProvider";
import ChartPattern from "../visx/components/ChartPattern";
import EventProvider from "../visx/components/providers/TooltipProvider";
import Tooltip from "../visx/components/PieTooltip";
// import Legend from "../visx/components/Legend";
// import CustomLegendShape from "../visx/components/CustomLegendShape";
import Title from "../visx/components/titles/Title";

import PieSeries from "../visx/components/PieChart";

import { roundNumber } from "../visx/utils/roundNumber";
import { PatternLines } from "../visx/components/aesthetic/Patterns";
import { colorByExpression, selectColor } from "../../../utils";
import { valueIfUndefined, isDefined } from "../visx/utils/chartUtils";

// const legendLabelFormat = (d) => d;

// const axisTopMargin = { top: 40, right: 50, bottom: 30, left: 50 };
// const axisBottomMargin = { top: 30, right: 50, bottom: 40, left: 50 };
// const margin = { top: 0, left: 0, bottom: 0, right: 0 };

export default function CreatePie({
  width,
  height,
  events = false,
  data,
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
  cornerRadius,
  padAngle,
  donutThickness,
  isDonut,
  margin,
}) {
  const [currData, setCurrData] = useState(data);

  useEffect(() => {
    setCurrData(data);
  }, [data]);

  // Check if conditionalColors and if so get the returned color pallette
  const colors = colorByExpression(qHyperCube, data, colorPalette);

  // const colorScaleConfig = () => ({
  //   domain: dataKeys ? dataKeys : measureInfo.map((d) => d.qFallbackTitle),
  // });
  // const colorScale = () => ({
  //   domain: dataKeys ? dataKeys : measureInfo.map((d) => d.qFallbackTitle),
  //   range:colors
  // });

  const { xyChart } = theme;

  const themeObj = {
    ...theme.xyChart,
    colors,
  };

  const formatValue = (val) => {
    // if (val === 0) return roundNumber(Math.abs(val), 0);

    const valPrecision = valueIfUndefined(precision, xyChart.precision);
    const valRoundNum = valueIfUndefined(roundNum, xyChart.roundNum);

    if (showAsPercent) return `${(val * 100).toFixed(valPrecision)}%`;
    let formattedValue = valRoundNum
      ? roundNumber(Math.abs(val), valPrecision)
      : Math.abs(val);

    return val < 0 ? `-${formattedValue}` : formattedValue;
  };

  /* eslint-disable react/prop-types */
  // const chartProps = {
  //   // width,
  //   // height,
  //   renderTooltip: ({ datum, fraction }) => (
  //     <div>
  //       <div>
  //         <strong>{datum.label}</strong>
  //       </div>
  //       <div>{(fraction * 100).toFixed()}%</div>
  //     </div>
  //   ),
  // };

  return (
    <ChartProvider
      theme={themeObj}
      // colorScale={colorScaleConfig}
      // showLabels={valueIfUndefined(showLabels, xyChart.showLabels)}
      // roundNum={valueIfUndefined(roundNum, xyChart.roundNum)}
      // precision={valueIfUndefined(precision, xyChart.precision)}
      size={size}
      // dimensionInfo={dimensionInfo}
      // measureInfo={measureInfo}
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
      // parseDateFormat={parseDateFormat}
      // formatTooltipDate={formatTooltipDate}
    >
      <EventProvider>
        {title && <Title title={title} subTitle={subTitle} size={size} />}
        <div
          className="container"
          style={{
            position: "relative",
            width: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <PieSeries
            height={height}
            data={currData}
            backgroundStyle={backgroundStyle}
            cornerRadius={valueIfUndefined(
              cornerRadius,
              xyChart.pie.cornerRadius
            )}
            legendTopBottom={legendTopBottom}
            legendLeftRight={legendLeftRight}
            legendShape={legendShape}
            legendDirection={legendDirection}
            showLegend={showLegend}
            padAngle={valueIfUndefined(padAngle, xyChart.pie.padAngle)}
            isDonut={valueIfUndefined(isDonut, xyChart.pie.isDonut)}
            donutThickness={valueIfUndefined(
              donutThickness,
              xyChart.pie.donutThickness
            )}
            margin={valueIfUndefined(margin, xyChart.pie.margin)}
            valPrecision={valueIfUndefined(precision, xyChart.precision)}
            // captureEvents={selectionMethod === "none"}
          />
          {showTooltip && (
            <Tooltip
              // showClosestItem={valueIfUndefined(
              //   showClosestItem,
              //   xyChart.tooltip.showClosestItem
              // )}
              // valueOnly={valueIfUndefined(valueOnly, xyChart.tooltip.valueOnly)}
              // valueWithText={valueIfUndefined(
              //   valueWithText,
              //   xyChart.tooltip.valueWithText
              // )}
              shiftTooltipTop={shiftTooltipTop}
              shiftTooltipLeft={shiftTooltipLeft}
              // useSingleColor={valueIfUndefined(
              //   useSingleColor,
              //   xyChart.tooltip.useSingleColor
              // )}
            />
          )}
          {/* {legendTopBottom === "bottom" && legend} */}
        </div>
      </EventProvider>
    </ChartProvider>
  );
}
