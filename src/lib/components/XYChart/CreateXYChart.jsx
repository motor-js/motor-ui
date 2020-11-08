import React, { useMemo, useCallback } from "react";
import {
  GlyphCross,
  GlyphDot,
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
  XYChart,
  Legend,
} from "../visx";

import Brush from "../visx/components/brush/Brush";

// import Legend from "../visx/components/legend/Legend";

import {
  selectColor,
  valueIfUndefined,
  isDefined,
  roundNumber,
} from "../../utils";
import { PatternLines } from "@visx/pattern";

import CustomChartBackground from "./CustomChartBackground";
import CustomChartPattern from "./CustomChartPattern";

export default function CreateXYChart({
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

  //-----
  // debounce,                    // Tooltip
  // detectBounds,                // Tooltip
  // glyphStyle,                  // Tooltip
  // resizeObserverPolyfill,      // Tooltip
  // scroll = true,               // Tooltip
  // showDatumGlyph = false,      // Tooltip
  // showSeriesGlyphs = false,    // Tooltip
  // formatTooltipDate,
  // fillStyle,                   // Area
  // strokeWidth,
  // tooltipStyles,

  //-----
}) {
  const chartType = type;
  const sharedTooltip = !showClosestItem;

  const AxisComponent = useAnimatedAxes ? AnimatedAxis : Axis;
  const GridComponent = useAnimatedGrid ? AnimatedGrid : Grid;

  const chartHideAxisLine = valueIfUndefined(hideAxisLine, theme.hideAxisLine);

  const chartShowAxisLabels = valueIfUndefined(
    showAxisLabels,
    theme.showAxisLabels
  );

  function getCurve(curve) {
    switch (curve) {
      case "Basis":
        return (curve = curveBasis);
      case "BasisClosed":
        return (curve = curveBasisClosed);
      case "BasisOpen":
        return (curve = curveBasisOpen);
      case "Step":
        return (curve = curveStep);
      case "StepAfter":
        return (curve = curveStepAfter);
      case "StepBefore":
        return (curve = curveStepBefore);
      case "Bundle":
        return (curve = curveBundle);
      case "Linear":
        return (curve = curveLinear);
      case "LinearClosed":
        return (curve = curveLinearClosed);
      case "MonotoneX":
        return (curve = curveMonotoneX);
      case "MonotoneY":
        return (curve = curveMonotoneY);
      case "Cardinal":
        return (curve = curveCardinal);
      case "CardinalClosed":
        return (curve = curveCardinalClosed);
      case "CardinalOpen":
        return (curve = curveCardinalOpen);
      case "CatmullRom":
        return (curve = curveCatmullRom);
      case "CatmullRomClosed":
        return (curve = curveCatmullRomClosed);
      case "CatmullRomOpen":
        return (curve = curveCatmullRomOpen);
      case "Natural":
        return (curve = curveNatural);
      default:
        return (curve = curveLinear);
    }
  }

  const formatValue = (val) => {
    const valPrecision = valueIfUndefined(precision, theme.precision);
    const valRoundNum = valueIfUndefined(roundNum, theme.roundNum);

    if (showAsPercent) return `${(val * 100).toFixed(valPrecision)}%`;
    let formattedValue = valRoundNum
      ? roundNumber(Math.abs(val), valPrecision)
      : Math.abs(val);

    return val < 0 ? `-${formattedValue}` : formattedValue;
  };

  const dateScaleConfig = {
    type: chartType !== "scatter" ? "band" : "linear",
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

  // const isContinuousAxes = dimensionInfo[0].qContinuousAxes || false;

  // const getDimension = (d) => (isContinuousAxes ? d[0].qNum : d[0].qText);
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

  let GlyphComponent = null;

  switch (glyphComponent) {
    // case "dot":
    //   GlyphComponent = GlyphDot;
    //   break;
    case "star":
      GlyphComponent = GlyphStar;
      break;
    case "circle":
      GlyphComponent = GlyphCircle;
      break;
    case "cross":
      GlyphComponent = GlyphCross;
      break;
    case "diamond":
      GlyphComponent = GlyphDiamond;
      break;
    case "square":
      GlyphComponent = GlyphSquare;
      break;
    case "tringle":
      GlyphComponent = GlyphTriangle;
      break;
    case "wye":
      GlyphComponent = GlyphWye;
      break;
    default:
      GlyphComponent = GlyphCircle;
      break;
  }

  const renderGlyph = useCallback(
    ({
      size,
      color,
      x,
      y,
      id,
      styleProps,
      onClick,
      onMouseEnter,
      onMouseMove,
      onMouseLeave,
    }) => {
      if (GlyphComponent && showPoints) {
        return (
          <GlyphComponent
            fill={color}
            {...styleProps}
            // r={size}
            size={size}
            top={y}
            left={x}
            id={id}
            onClick={onClick}
            onMouseEnter={onMouseEnter}
            onMouseMove={onMouseMove}
            onMouseLeave={onMouseLeave}
          />
        );
      }
      if (!showPoints) return;
      return (
        <text y={y} x={x} id={id} {...styleProps}>
          🍍
        </text>
      );
    },
    [showPoints]
  );

  const renderLabel = ({ x, y, id, styleProps }) => {
    return (
      <text y={y} x={x} id={id} {...styleProps}>
        {formatValue(y)}
      </text>
    );
  };

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
      <XYChart
        height={Math.min(400, height)}
        margin={chartMargin}
        captureEvents={selectionMethod === "none"}
        onMouseDown={selectionMethod === "brush" ? enableBrush : null}
      >
        {/* <XYChart height={height}> */}
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
        <GridComponent
          key={`grid-${animationTrajectory}`} // force animate on update
          rows={showGridRows}
          columns={showGridColumns}
          animationTrajectory={animationTrajectory}
          numGridRows={valueIfUndefined(numGridRows, theme.numGridRows)}
          numGridColumns={valueIfUndefined(
            numGridColumns,
            theme.numGridColumns
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
                    curve={getCurve(
                      accessors.el[measureInfo[index].qCurve] || curveShape
                    )}
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
                    curve={getCurve(accessors.el[measure].qCurve || curveShape)}
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
                    curve={getCurve(
                      accessors.el[measureInfo[index].qCurve] || curveShape
                    )}
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
                    curve={getCurve(accessors.el[measure].qCurve || curveShape)}
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
        {((chartType === "scatter" && singleDimension && !singleMeasure) ||
          chartType === "line" ||
          chartType === "area") && (
          <>
            {singleDimension
              ? measureInfo.map((measure, index) => (
                  <GlyphSeries
                    key={measureInfo[index].qFallbackTitle}
                    dataKey={measureInfo[index].qFallbackTitle}
                    index={index + dimensionInfo.length}
                    data={data}
                    xAccessor={accessors.x[measureInfo[index].qFallbackTitle]}
                    yAccessor={accessors.y[measureInfo[index].qFallbackTitle]}
                    elAccessor={accessors.el[measureInfo[index].qFallbackTitle]}
                    type={chartType}
                    renderGlyph={renderGlyph}
                  />
                ))
              : dataKeys.map((measure, index) => (
                  <GlyphSeries
                    key={measure}
                    dataKey={measure}
                    index={index + 1}
                    data={data}
                    xAccessor={accessors.x[measure]}
                    yAccessor={accessors.y[measure]}
                    elAccessor={accessors.el[measure]}
                    type={chartType}
                    renderGlyph={renderGlyph}
                  />
                ))}
          </>
        )}
        {valueIfUndefined(showLabels, theme.showLabels) &&
          chartType !== "barstack" &&
          chartType !== "bargroup" && (
            <>
              {singleDimension
                ? measureInfo.map((measure, index) => (
                    <GlyphSeries
                      key={measureInfo[index].qFallbackTitle}
                      dataKey={measureInfo[index].qFallbackTitle}
                      index={index + dimensionInfo.length}
                      data={data}
                      size={size}
                      xAccessor={accessors.x[measureInfo[index].qFallbackTitle]}
                      yAccessor={accessors.y[measureInfo[index].qFallbackTitle]}
                      elAccessor={
                        accessors.el[measureInfo[index].qFallbackTitle]
                      }
                      renderGlyph={renderLabel}
                      style={valueLabelStyle}
                      type="text"
                    />
                  ))
                : dataKeys.map((measure, index) => (
                    <GlyphSeries
                      key={measure}
                      dataKey={measure}
                      index={index + 1}
                      data={data}
                      size={size}
                      xAccessor={accessors.x[measure]}
                      yAccessor={accessors.y[measure]}
                      elAccessor={accessors.el[measure]}
                      renderGlyph={renderLabel}
                      style={valueLabelStyle}
                      type="text"
                    />
                  ))}
            </>
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
      </XYChart>
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
