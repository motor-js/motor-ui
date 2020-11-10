import React, { useMemo, useCallback } from "react";
import {
  GlyphCross,
  // GlyphDot,
  GlyphStar,
  GlyphDiamond,
  GlyphSquare,
  GlyphTriangle,
  GlyphWye,
  GlyphCircle,
} from "@visx/glyph";

import {
  curveBasis,
  curveStep,
  curveBasisClosed,
  curveBasisOpen,
  curveStepAfter,
  curveStepBefore,
  curveBundle,
  curveLinear,
  curveLinearClosed,
  curveMonotoneX,
  curveMonotoneY,
  curveCardinal,
  curveCardinalClosed,
  curveCardinalOpen,
  curveCatmullRom,
  curveCatmullRomClosed,
  curveCatmullRomOpen,
  curveNatural,
} from "@visx/curve";

import {
  // AnimatedAreaSeries,
  Axis,
  AnimatedAxis,
  Grid,
  AnimatedGrid,
  AreaSeries,
  DataProvider,
  BarGroup,
  // AnimatedBarGroup,
  BarSeries,
  // AnimatedBarSeries,
  BarStack,
  // AnimatedBarStack,
  GlyphSeries,
  // AnimatedGlyphSeries,
  LineSeries,
  // AnimatedLineSeries,
  Tooltip,
  Title,
  Pie,
  Legend,
  Brush,
} from "../visx";

import {
  selectColor,
  valueIfUndefined,
  isDefined,
  roundNumber,
} from "../../utils";

import { PatternLines } from "@visx/pattern";

import CustomChartBackground from "./CustomChartBackground";
import CustomChartPattern from "./CustomChartPattern";

export default function CreatePie({
  height,
  qLayout: {
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
  theme,
  dataKeys,
  includeZero,
  size,
  chartMargin,
  type,
  backgroundPattern,
  backgroundStyle,
  singleDimension,
  singleMeasure,
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
  showLegend,
  legendLeftRight,
  legendTopBottom,
  legendDirection,
  legendShape,
  legendLabelStyle,
  showPoints,
  valueLabelStyle,
  useSingleColor,
  snapTooltipToDatumX,
  snapTooltipToDatumY,
  showHorizontalCrosshair,
  showVerticalCrosshair,
  horizontalCrosshairStyle,
  verticalCrosshairStyle,
  shiftTooltipTop,
  shiftTooltipLeft,
  valueOnly,
  valueWithText,
  curveShape,
  enableBrush,
  showBrush,
  fillStyle,
  strokeWidth,

  // tooltipStyles,

  //-----
}) {
  const chartType = type;
  const sharedTooltip = !showClosestItem;

  const dateScaleConfig = {
    type: chartType !== "scatter" ? "band" : "linear",
    paddingInner: padding,
  };

  const valueScaleConfig = { type: "linear" };

  const getDimension = (d) =>
    d[0] ? (chartType === "scatter" ? d[2].qNum : d[0].qText) : null;

  const getSeriesValues = (d, i) =>
    isDefined(d[i]) ? Number(d[i].qNum) : null;

  const getElementNumber = (d) => (d[0] ? d[0].qElemNumber : null);

  const selectedBoxStyle = {
    fill: "url(#brush_pattern)",
    stroke: selectColor(theme.brush.stroke, theme) ?? "#329af0",
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

  // Gets the index of teh dataKey for use in the yAccessor
  const valueIndex = useCallback(
    (key) =>
      singleDimension
        ? measureInfo
            .reduce(
              (combined, entry) =>
                entry ? combined.concat(entry.qFallbackTitle) : combined,
              []
            )
            .indexOf(key) + dimensionInfo.length
        : dataKeys.indexOf(key) + 1,
    [singleDimension, measureInfo, dataKeys]
  );

  const shape = useCallback(() => {
    let legendShapes = singleDimension
      ? measureInfo.map((measure, index) => measureInfo[index].qLegendShape)
      : [dimensionInfo[1].qLegendShape];

    legendShapes =
      legendShapes.filter((x) => x !== null && x != undefined).length !==
        measureInfo.length &&
      legendShapes.filter((x) => x !== null && x != undefined).length !== 0
        ? legendShapes.map((shape) =>
            typeof shape !== "undefined"
              ? shape
              : legendShape === "auto"
              ? type === "line" || type === "area"
                ? "line"
                : "rect"
              : legendShape
          )
        : legendShapes;

    return legendShapes.filter((x) => x !== null && x != undefined).length !== 0
      ? legendShapes
      : legendShape === "auto"
      ? type === "line" || type === "area"
        ? "line"
        : "rect"
      : legendShape;
  }, [legendShape]);

  const glyphComponent =
    typeof showPoints === "string"
      ? showPoints
      : typeof theme.showPoints === "string"
      ? theme.showPoints
      : showPoints
      ? "circle"
      : theme.showPoints
      ? "cirlce"
      : false;

  const singleColor = valueIfUndefined(
    useSingleColor,
    theme.tooltip.useSingleColor
  );

  return (
    <DataProvider
      theme={theme}
      xScale={config.x}
      yScale={config.y}
      currentSelectionIds={currentSelectionIds}
      beginSelections={beginSelections}
      select={select}
      setCurrentSelectionIds={setCurrentSelectionIds}
      horizontal={renderHorizontally}
      includeZero={includeZero}
      multiColor={multiColor}
      legendLabelStyle={legendLabelStyle}
      singleDimension={singleDimension}
      measureInfo={measureInfo}
      dataKeys={dataKeys}
      valueIndex={valueIndex}
      chartType={chartType}
      size={size}
    >
      {title && (
        <Title
          borderRadius={borderRadius}
          title={title}
          subTitle={subTitle}
          size={size}
        />
      )}
      {showLegend && legendTopBottom === "top" && (
        <Legend
          shape={shape}
          // multiColor={multiColor}
          dataKeys={dataKeys}
          size={size}
          legendLeftRight={legendLeftRight}
          legendDirection={legendDirection}
        ></Legend>
      )}
      <Pie
        height={Math.min(400, height)}
        margin={chartMargin}
        captureEvents={selectionMethod === "none"}
        onMouseDown={selectionMethod === "brush" ? enableBrush : null}
      >
        {/* <Pie height={height}> */}
        <CustomChartBackground
          style={backgroundStyle.style}
          from={backgroundStyle.styleFrom}
          to={backgroundStyle.styleTo}
        />
        <CustomChartPattern backgroundPattern={backgroundPattern} />
        {showBrush && (
          <PatternLines
            id="brush_pattern"
            height={theme.brush.patternHeight ?? 12}
            width={theme.brush.patternWidth ?? 12}
            stroke={selectColor(theme.brush.patternStroke, theme) ?? "#a3daff"}
            strokeWidth={theme.brush.strokeWidth || 1}
            orientation={theme.brush.orientation || ["diagonal"]}
          />
        )}

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

        {showTooltip && (
          <Tooltip
            showHorizontalCrosshair={showHorizontalCrosshair}
            showVerticalCrosshair={showVerticalCrosshair}
            snapTooltipToDatumX={snapTooltipToDatumX}
            snapTooltipToDatumY={snapTooltipToDatumY}
            horizontalCrosshairStyle={horizontalCrosshairStyle}
            verticalCrosshairStyle={verticalCrosshairStyle}
            shiftTooltipTop={shiftTooltipTop}
            shiftTooltipLeft={shiftTooltipLeft}
            showDatumGlyph={
              (snapTooltipToDatumX || snapTooltipToDatumY) &&
              chartType !== "bargroup"
            }
            showSeriesGlyphs={sharedTooltip && chartType !== "bargroup"}
            renderTooltip={({ tooltipData, colorScale }) =>
              chartType !== "scatter" ? (
                <>
                  {(valueOnly || valueWithText) && (
                    <>
                      {[tooltipData?.nearestDatum?.key]
                        .filter((datum) => datum)
                        .map((datum) => (
                          <div key={datum}>
                            {valueWithText && (
                              <em
                                style={{
                                  color: singleColor
                                    ? selectColor(
                                        theme?.tooltip?.headingColor,
                                        theme
                                      )
                                    : multiColor
                                    ? colorScale?.(
                                        accessors.date(
                                          tooltipData?.nearestDatum?.datum
                                        )
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
                            )}
                            {tooltipData?.nearestDatum?.datum
                              ? accessors[renderHorizontally ? "x" : "y"][
                                  datum
                                ](
                                  tooltipData?.nearestDatum?.datum,
                                  valueIndex(datum)
                                )
                              : "–"}
                          </div>
                        ))}
                    </>
                  )}
                  {/** date */}
                  {!(valueOnly || valueWithText) &&
                    ((tooltipData?.nearestDatum?.datum &&
                      accessors.date(tooltipData?.nearestDatum?.datum)) ||
                      "No date")}
                  {!(valueOnly || valueWithText) && (
                    <>
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
                                color: singleColor
                                  ? selectColor(
                                      theme?.tooltip?.headingColor,
                                      theme
                                    )
                                  : multiColor
                                  ? colorScale?.(
                                      accessors.date(
                                        tooltipData?.nearestDatum?.datum
                                      )
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
                              ? accessors[renderHorizontally ? "x" : "y"][
                                  datum
                                ](
                                  tooltipData?.nearestDatum?.datum,
                                  valueIndex(datum)
                                )
                              : "–"}
                          </div>
                        ))}
                    </>
                  )}
                </>
              ) : (
                Object.keys(tooltipData?.datumByKey ?? {}).map((datum) => (
                  <div key={datum}>
                    {(tooltipData?.nearestDatum?.datum &&
                      tooltipData?.nearestDatum?.datum[0].qText) ||
                      "No date"}
                    <br />
                    <br />
                    {measureInfo.map((measure, index) =>
                      index <= 1 ? (
                        <React.Fragment key={index}>
                          <em
                            style={{
                              color: multiColor
                                ? colorScale?.(
                                    tooltipData?.nearestDatum?.datum[0].qText
                                  )
                                : colorScale?.([measureInfo[0].qFallbackTitle]),
                            }}
                          >
                            {`${measureInfo[index].qFallbackTitle} `}
                          </em>
                          {tooltipData?.nearestDatum?.datum
                            ? accessors[renderHorizontally ? "x" : "y"][
                                measureInfo[index].qFallbackTitle
                              ](tooltipData?.nearestDatum?.datum, index + 1)
                            : "–"}
                          <br />
                        </React.Fragment>
                      ) : null
                    )}
                  </div>
                ))
              )
            }
          />
        )}
        {showBrush && (
          <Brush
            xAxisOrientation={xAxisOrientation}
            yAxisOrientation={yAxisOrientation}
            selectedBoxStyle={selectedBoxStyle}
            brushDirection={renderHorizontally ? "vertical" : "horizontal"}
            brushRegion={"chart"}
            handleSize={8}
          />
        )}
      </Pie>
      {showLegend && legendTopBottom === "bottom" && (
        <Legend
          shape={shape}
          size={size}
          legendLeftRight={legendLeftRight}
          legendDirection={legendDirection}
        ></Legend>
      )}
    </DataProvider>
  );
}
