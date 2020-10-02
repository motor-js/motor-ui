import React, { useState, useContext, useCallback } from "react";
import { ParentSize } from "@visx/responsive";
import { Pie } from "@visx/shape";
import { scaleOrdinal } from "@visx/scale";
import { localPoint } from "@visx/event";
import { Group } from "@visx/group";
import { GradientPinkBlue } from "@visx/gradient";
import { animated, useTransition, interpolate } from "react-spring";
import Legend from "../components/Legend";

import ChartContext from "../context/ChartContext";
import TooltipContext from "../context/TooltipContext";
import { useTooltipInPortal } from "@visx/tooltip";
import { getSymbol, isDefined, valueIfUndefined } from "../utils/chartUtils";
import { isEmpty } from "../../../../utils";

export default function PieChart(props) {
  const {
    width,
    height,
    margin,
    animate = false,
    data,
    cornerRadius,
    padAngle,
    donutThickness,
    isDonut,
    legendTopBottom,
    legendLeftRight,
    legendShape,
    legendDirection,
    showLegend,
    valPrecision,
  } = props;

  const { containerRef } = useTooltipInPortal();

  const {
    currentSelectionIds,
    handleClick,
    singleMeasure,
    singleDimension,
    dataKeys,
    theme,
    formatValue,
  } = useContext(ChartContext);

  const { showTooltip, hideTooltip } = useContext(TooltipContext) || {};

  // accessor functions
  const pieValue = (d) => d.value;
  const secondPieValue = (d) => d.frequency;

  // color scales
  const colorScale = scaleOrdinal({
    domain: dataKeys,
    range: theme.colors,
  });

  const getStyle = (selectionId) => {
    return isEmpty(currentSelectionIds) ||
      currentSelectionIds.includes(selectionId)
      ? theme.selection
      : theme.nonSelection;
  };

  if (width < 10) return null;

  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  const radius = Math.min(innerWidth, innerHeight) / 2;
  const centerY = innerHeight / 2;
  const centerX = innerWidth / 2;

  const onMouseMoveDatum = (event, { data }) => {
    const { x: svgMouseX, y: svgMouseY } = localPoint(event) || {};

    if (data && showTooltip) {
      showTooltip({
        tooltipData: { ...data, svgMouseX, svgMouseY, colorScale },
      });
    }
  };

  if (width == null || height == null) {
    return (
      <ParentSize>{(dims) => <PieChart {...dims} {...props} />}</ParentSize>
    );
  }

  const onClick = ({ data: { selectionId } }) => {
    const selections = currentSelectionIds.includes(selectionId)
      ? currentSelectionIds.filter(function(value) {
          return value !== selectionId;
        })
      : [...currentSelectionIds, selectionId];
    handleClick(selections);
  };

  const legend = showLegend ? (
    <Legend
      direction={legendDirection}
      scale={colorScale}
      shape={
        legendShape === "auto"
          ? undefined
          : legendShape === "custom"
          ? CustomLegendShape
          : legendShape
      }
      fill={({ datum }) => colorScale(datum)}
      labelFormat={(label) => label}
      alignLeft={legendLeftRight === "left"}
    />
  ) : null;

  return (
    <>
      {legendTopBottom === "top" && legend}
      <svg width={width} height={height} ref={containerRef}>
        <GradientPinkBlue id="visx-pie-gradient" />

        <rect
          rx={14}
          width={width}
          height={height}
          fill="url('#visx-pie-gradient')"
        />
        <Group top={centerY + margin.top} left={centerX + margin.left}>
          <Pie
            data={data}
            pieValue={pieValue}
            outerRadius={radius}
            innerRadius={isDonut ? radius - donutThickness : 0}
            cornerRadius={cornerRadius}
            padAngle={padAngle}
          >
            {(pie) => (
              <AnimatedPie
                {...pie}
                animate={animate}
                getKey={(arc) => arc.data.label}
                // onClickDatum={({ data: { label } }) => console.log(label)}
                onClickDatum={onClick}
                onMouseMoveDatum={onMouseMoveDatum}
                onMouseLeave={hideTooltip}
                getColor={(arc) => colorScale(arc.data.label)}
                getStyle={(arc) => getStyle(arc.data.selectionId)}
                valPrecision={valPrecision}
                formatValue={formatValue}
              />
            )}
          </Pie>
          {/* Inner Circle */}
          {!(singleDimension && singleMeasure) && (
            <Pie
              data={data}
              pieValue={secondPieValue}
              pieSortValues={() => -1}
              outerRadius={radius - donutThickness * 1.3}
            >
              {(pie) => (
                <AnimatedPie
                  {...pie}
                  animate={animate}
                  getKey={({ data: { letter } }) => letter}
                  onClickDatum={({ data: { letter } }) => console.log(letter)}
                  onMouseMoveDatum={onMouseMoveDatum}
                  getColor={(arc) => colorScale(arc.data.label)}
                  getStyle={(arc) => getStyle(arc.data.selectionId)}
                  valPrecision={valPrecision}
                  formatValue={formatValue}
                />
              )}
            </Pie>
          )}
        </Group>
      </svg>
      {legendTopBottom === "bottom" && legend}
    </>
  );
}

const fromLeaveTransition = ({ endAngle }) => ({
  // enter from 360° if end angle is > 180°
  startAngle: endAngle > Math.PI ? 2 * Math.PI : 0,
  endAngle: endAngle > Math.PI ? 2 * Math.PI : 0,
  opacity: 0,
});

const enterUpdateTransition = ({ startAngle, endAngle }) => ({
  startAngle,
  endAngle,
  opacity: 1,
});

function AnimatedPie({
  animate,
  arcs,
  path,
  getKey,
  getColor,
  valPrecision,
  formatValue,
  getStyle,
  onClickDatum,
  onMouseMoveDatum,
  onMouseLeave,
}) {
  const transitions = useTransition(
    arcs,
    getKey,
    // @ts-ignore react-spring doesn't like this overload
    {
      from: animate ? fromLeaveTransition : enterUpdateTransition,
      enter: enterUpdateTransition,
      update: enterUpdateTransition,
      leave: animate ? fromLeaveTransition : enterUpdateTransition,
    }
  );
  return (
    <>
      {transitions.map(({ item: arc, props, key }) => {
        const [centroidX, centroidY] = path.centroid(arc);
        const hasSpaceForLabel = arc.endAngle - arc.startAngle >= 0.1;
        // const pieText = `${arc.data.label}
        //  (${arc.data.percent.toFixed(valPrecision)}%)
        //  ${formatValue(arc.data.value)}`;
        const pieText = `${arc.data.label}`;

        return (
          <g key={key}>
            <animated.path
              // compute interpolated path d attribute from intermediate angle values
              d={interpolate(
                [props.startAngle, props.endAngle],
                (startAngle, endAngle) =>
                  path({
                    ...arc,
                    startAngle,
                    endAngle,
                  })
              )}
              fill={getColor(arc)}
              style={getStyle(arc)}
              onClick={() => onClickDatum(arc)}
              onMouseMove={(e) => onMouseMoveDatum(e, arc)}
              onMouseLeave={onMouseLeave}
              onTouchStart={() => onClickDatum(arc)}
            />
            {hasSpaceForLabel && (
              <animated.g style={{ opacity: props.opacity }}>
                <text
                  fill="white"
                  x={centroidX}
                  y={centroidY}
                  dy=".33em"
                  fontSize={9}
                  textAnchor="middle"
                  pointerEvents="none"
                >
                  {pieText}
                </text>
              </animated.g>
            )}
          </g>
        );
      })}
    </>
  );
}
