/* eslint-disable unicorn/consistent-function-scoping */
import React, { useState, useEffect } from "react";
import {
  ChartProvider,
  EventProvider,
  PatternLines,
  PieChart,
  Title,
  PieTooltip as Tooltip,
} from "../visx";

import { roundNumber } from "../visx/utils/roundNumber";
import { colorByExpression, selectColor } from "../../utils";
import { valueIfUndefined } from "../visx/utils/chartUtils";

export default function CreatePie({
  width,
  height,
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
  size,
  showLegend,
  legendLeftRight,
  legendTopBottom,
  legendDirection,
  legendShape,
  backgroundStyle,
  // fillStyle,
  showLabels,
  roundNum,
  precision,
  selectionMethod,
  showAsPercent,
  singleMeasure,
  singleDimension,
  // dimensionCount,
  // measureCount,
  title,
  subTitle,
  legendLabelStyle,
  valueLabelStyle,
  // showClosestItem,
  // useSingleColor,
  // parseDateFormat,
  // formatTooltipDate,
  strokeWidth,
  stroke,
  showTooltip,
  // valueOnly,
  // valueWithText,
  cornerRadius,
  padAngle,
  donutThickness,
  isDonut,
  margin,
  pieSort,
  pieSortValues,
}) {
  const [currData, setCurrData] = useState(data);

  useEffect(() => {
    setCurrData(data);
  }, [data]);

  // Check if conditionalColors and if so get the returned color pallette
  const colors = colorByExpression(qHyperCube, data, colorPalette);

  const {
    global: { chart },
    pie,
  } = theme;

  const themeObj = {
    ...theme.global.chart,
    pie: { ...theme.pie },
    colors,
  };

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

  return (
    <ChartProvider
      theme={themeObj}
      // colorScale={colorScaleConfig}
      showLabels={valueIfUndefined(showLabels, chart.showLabels)}
      // roundNum={valueIfUndefined(roundNum, chart.roundNum)}
      // precision={valueIfUndefined(precision, chart.precision)}
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
      pieSort={pieSort}
      pieSortValues={pieSortValues}
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
          <PieChart
            height={height}
            data={currData}
            backgroundStyle={backgroundStyle}
            cornerRadius={valueIfUndefined(cornerRadius, pie.cornerRadius)}
            legendTopBottom={legendTopBottom}
            legendLeftRight={legendLeftRight}
            legendShape={legendShape}
            legendDirection={legendDirection}
            showLegend={showLegend}
            padAngle={valueIfUndefined(padAngle, pie.padAngle)}
            isDonut={valueIfUndefined(isDonut, pie.isDonut)}
            strokeWidth={valueIfUndefined(strokeWidth, pie.strokeWidth)}
            stroke={selectColor(valueIfUndefined(isDonut, pie.stroke), theme)}
            donutThickness={valueIfUndefined(
              donutThickness,
              pie.donutThickness
            )}
            margin={valueIfUndefined(margin, pie.margin)}
            valPrecision={valueIfUndefined(precision, chart.precision)}
            selectionMethod={selectionMethod}
          />
          {showTooltip && (
            <Tooltip
            // showClosestItem={valueIfUndefined(
            //   showClosestItem,
            //   chart.tooltip.showClosestItem
            // )}
            // valueOnly={valueIfUndefined(valueOnly, chart.tooltip.valueOnly)}
            // valueWithText={valueIfUndefined(
            //   valueWithText,
            //   chart.tooltip.valueWithText
            // )}
            // useSingleColor={valueIfUndefined(
            //   useSingleColor,
            //   chart.tooltip.useSingleColor
            // )}
            />
          )}
          {/* {legendTopBottom === "bottom" && legend} */}
        </div>
      </EventProvider>
    </ChartProvider>
  );
}
