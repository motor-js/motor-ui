import React, { useContext, useState } from "react";
import { ParentSize } from "@visx/responsive";
import { Pie } from "@visx/shape";
import { scaleOrdinal } from "@visx/scale";
import { localPoint } from "@visx/event";
import { Group } from "@visx/group";
import { animated, useTransition, interpolate } from "react-spring";
import Legend from "../../components/aesthetic/Legend";
import ChartBackground from "../aesthetic/Gradient";

import ChartContext from "../../context/ChartContext";
import TooltipContext from "../../context/TooltipContext";
import { useTooltipInPortal } from "@visx/tooltip";
import { isEmpty, isString } from "../../../../utils";

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
    backgroundStyle,
    selectionMethod,
    stroke,
    strokeWidth,
  } = props;

  const { containerRef } = useTooltipInPortal();
  const [hoverId, setHoverId] = useState();

  const {
    currentSelectionIds,
    handleClick,
    singleMeasure,
    singleDimension,
    dataKeys,
    theme,
    formatValue,
    valueLabelStyle,
    size,
    showLabels,
    pieSort,
    pieSortValues,
  } = useContext(ChartContext);

  const { colors, selection, nonSelection, hover, valueLabelStyles } = theme;

  const pieLabelStyle = {
    ...valueLabelStyles,
    ...valueLabelStyle,
    fontSize: valueLabelStyles.fontSize[size],
  };

  const { showTooltip, hideTooltip } = useContext(TooltipContext) || {};

  const onMouseLeave = () => {
    hideTooltip();
    setHoverId(null);
  };

  // accessor functions
  const pieValue = (d) => d.value;
  const secondPieValue = (d) => d.frequency;

  // color scales
  const colorScale = scaleOrdinal({
    domain: dataKeys,
    range: colors,
  });

  const getStyle = (selectionId) => {
    return isEmpty(currentSelectionIds) && hoverId === selectionId
      ? hover
      : isEmpty(currentSelectionIds) ||
        currentSelectionIds.includes(selectionId)
      ? selection
      : nonSelection;
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
    if (selectionMethod === "none") return;
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
        <ChartBackground
          style={backgroundStyle.style}
          id="visx-pie-gradient"
          from={backgroundStyle.styleFrom}
          to={backgroundStyle.styleTo}
        />

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
            pieSort={
              pieSort === undefined
                ? undefined
                : isString(pieSort) &&
                  pieSort.toUpperCase().slice(0, 3) === "ASC"
                ? (a, b) => a.label.localeCompare(b.label)
                : (a, b) => b.label.localeCompare(a.label)
            }
            pieSortValues={
              pieSortValues === undefined
                ? undefined
                : isString(pieSortValues) &&
                  pieSortValues.toUpperCase().slice(0, 3) === "ASC"
                ? (a, b) => a - b
                : (a, b) => b - a
            }
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
                onClickDatum={onClick}
                onMouseMoveDatum={onMouseMoveDatum}
                setHoverId={setHoverId}
                onMouseLeave={onMouseLeave}
                getColor={(arc) => colorScale(arc.data.label)}
                getStyle={(arc) => getStyle(arc.data.selectionId)}
                valPrecision={valPrecision}
                formatValue={formatValue}
                pieLabelStyle={pieLabelStyle}
                showLabels={showLabels}
                stroke={stroke}
                strokeWidth={strokeWidth}
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
                  setHoverId={setHoverId}
                  getColor={(arc) => colorScale(arc.data.label)}
                  getStyle={(arc) => getStyle(arc.data.selectionId)}
                  valPrecision={valPrecision}
                  formatValue={formatValue}
                  pieLabelStyle={pieLabelStyle}
                  showLabels={showLabels}
                  stroke={stroke}
                  strokeWidth={strokeWidth}
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
  stroke,
  strokeWidth,
  valPrecision,
  formatValue,
  showLabels,
  pieLabelStyle,
  getStyle,
  onClickDatum,
  onMouseMoveDatum,
  setHoverId,
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
              strokeWidth={strokeWidth}
              stroke={stroke}
              onClick={() => onClickDatum(arc)}
              onMouseMove={(e) => onMouseMoveDatum(e, arc)}
              onMouseEnter={() => setHoverId(arc.data.selectionId)}
              onMouseLeave={onMouseLeave}
              onTouchStart={() => onClickDatum(arc)}
            />
            {hasSpaceForLabel && showLabels && (
              <animated.g style={{ opacity: props.opacity }}>
                <text x={centroidX} y={centroidY} dy=".33em" {...pieLabelStyle}>
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
