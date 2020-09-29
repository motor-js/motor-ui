import React, {
  useContext,
  useMemo,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { extent } from "d3-array";
import { Group } from "@visx/group";
import { Text } from "@visx/text";
import BarStack from "./BarStack";
import BarStackHorizontal from "./BarStackHorizontal";
import ChartContext from "../../context/ChartContext";
import TooltipContext from "../../context/TooltipContext";
import { selectColor } from "../../../../../../utils/colors";
import { getSymbol, isDefined } from "../../utils/chartUtils";

import findNearestDatumY from "../../utils/findNearestDatumY";
import findNearestDatumX from "../../utils/findNearestDatumX";
import AnimatedBars from "./AnimatedBars";

const STACK_ACCESSOR = (d) => d.stack;

export default function Stack({ horizontal, children, glyph, ...rectProps }) {
  const {
    xScale,
    yScale,
    colorScale,
    dataRegistry,
    registerData,
    unregisterData,
    height,
    margin,
    theme,
    findNearestData,
    showPoints,
    showLabels,
    size,
    valueLabelStyle,
    formatValue,
    singleDimension,
    measureInfo,
    currentSelectionIds,
    handleClick,
  } = useContext(ChartContext) || {};

  const { showTooltip, hideTooltip } = useContext(TooltipContext) || {};

  // extract data keys from child series
  const dataKeys = useMemo(
    () => React.Children.map(children, (child) => child.props.dataKey),
    [children]
  );

  // use a ref to the stacks for mouse movements
  const stacks = useRef(null);

  // override the findNearestDatum logic
  const findNearestDatum = useCallback(
    (args) => {
      if (!stacks.current) return null;

      const nearestDatum = horizontal
        ? findNearestDatumY(args)
        : findNearestDatumX(args);

      if (!nearestDatum) return null;

      // find the stack for this key, and the bar in that stack corresponding to nearestDatum
      const stack = stacks.current.find(
        (currStack) => currStack.key === args.key
      );
      const bar = stack?.bars?.[nearestDatum.index];

      if (!bar) return null;

      const distanceX = horizontal
        ? // if svgMouseX is *on* the bar, set distance to 0
          args.svgMouseX >= bar.x && args.svgMouseX <= bar.x + bar.width
          ? 0
          : // otherwise take the min distance between the left and the right of the bar
            Math.min(
              Math.abs(args.svgMouseX - bar.x),
              Math.abs(args.svgMouseX - (bar.x + bar.width))
            )
        : nearestDatum.distanceX;

      const distanceY = horizontal
        ? nearestDatum.distanceY
        : // if svgMouseY is *on* the bar, set distance to 0
        args.svgMouseY >= bar.y && args.svgMouseY <= bar.y + bar.height
        ? 0
        : // otherwise take the min distance between the top and the bottom of the bar
          Math.min(
            Math.abs(args.svgMouseY - bar.y),
            Math.abs(args.svgMouseY - (bar.y + bar.height))
          );

      return {
        ...nearestDatum,
        distanceX,
        distanceY,
      };
    },
    [horizontal]
  );

  // group all child data by stack value, this format is needed by BarStack
  const combinedData = useMemo(() => {
    const dataByStackValue = {};
    React.Children.forEach(children, (child) => {
      const {
        dataKey,
        data = [],
        xAccessor,
        yAccessor,
        elAccessor,
      } = child.props;

      // this should exist but double check
      if (!xAccessor || !yAccessor || !elAccessor) return;

      data.forEach((d, i) => {
        const stack = (horizontal ? yAccessor : xAccessor)(d);
        const stackKey = String(stack);
        if (!dataByStackValue[stackKey]) {
          dataByStackValue[stackKey] = {
            stack,
            positiveSum: 0,
            negativeSum: 0,
          };
        }

        const value = (horizontal ? xAccessor : yAccessor)(d);
        dataByStackValue[stackKey][dataKey] = value;
        dataByStackValue[stackKey]["selectionId"] = elAccessor(d);
        dataByStackValue[stackKey][
          value >= 0 ? "positiveSum" : "negativeSum"
        ] += value;
      });
    });

    // console.log(Object.values(dataByStackValue));

    return Object.values(dataByStackValue);
  }, [horizontal, children]);

  // update the domain to account for the (directional) stacked value
  const comprehensiveDomain = useMemo(
    () =>
      extent(
        combinedData
          .map((d) => d.positiveSum)
          .concat(combinedData.map((d) => d.negativeSum)),
        (d) => d
      ).filter((val) => val != null),
    [combinedData]
  );

  // register all child data
  useEffect(() => {
    const dataToRegister = {};

    React.Children.map(children, (child) => {
      const {
        dataKey: key,
        data,
        xAccessor,
        yAccessor,
        elAccessor,
        mouseEvents,
      } = child.props;
      dataToRegister[key] = {
        key,
        data,
        xAccessor,
        yAccessor,
        elAccessor,
        mouseEvents,
        findNearestDatum,
      };

      // only need to update the domain for one of the keys
      if (comprehensiveDomain.length > 0 && dataKeys.indexOf(key) === 0) {
        if (horizontal) {
          dataToRegister[key].xScale = (scale) =>
            scale.domain(
              extent([...scale.domain(), ...comprehensiveDomain], (d) => d)
            );
        } else {
          dataToRegister[key].yScale = (scale) =>
            scale.domain(
              extent([...scale.domain(), ...comprehensiveDomain], (d) => d)
            );
        }
      }
    });

    registerData(dataToRegister);

    // unregister data on unmount
    return () => unregisterData(Object.keys(dataToRegister));
  }, [
    horizontal,
    comprehensiveDomain,
    registerData,
    unregisterData,
    children,
    findNearestDatum,
    dataKeys,
  ]);

  const onMouseMove = useCallback(
    (event) => {
      const nearestData = findNearestData(event);
      if (nearestData.closestDatum && showTooltip) {
        showTooltip({
          tooltipData: {
            ...nearestData,
          },
        });
      }
    },
    [findNearestData, showTooltip]
  );

  // if scales and data are not available in the registry, bail
  if (
    dataKeys.some((key) => dataRegistry[key] == null) ||
    !xScale ||
    !yScale ||
    !colorScale
  ) {
    return null;
  }

  const hasSomeNegativeValues = comprehensiveDomain.some((num) => num < 0);

  const { valueLabelStyles } = theme;

  const labelProps = {
    ...valueLabelStyles,
    fontSize: valueLabelStyles.fontSize[size],
    ...valueLabelStyle,
  };

  let ChartGlyph = getSymbol(
    isDefined(glyph) ? glyph.symbol : showPoints.symbol
  );

  const keys = singleDimension
    ? measureInfo.map((d) => d.qFallbackTitle)
    : dataKeys;

  return horizontal ? (
    <BarStackHorizontal
      data={combinedData}
      keys={dataKeys}
      height={height - margin.top - margin.bottom}
      y={STACK_ACCESSOR}
      xScale={xScale}
      yScale={yScale}
      color={colorScale}
      offset={hasSomeNegativeValues ? "diverging" : undefined}
      // @TODO support all BarStack props
    >
      {(barStacks) => {
        // use this reference to find nearest mouse values
        stacks.current = barStacks;
        return (
          <Group className={"visx-bar-stack"}>
            {barStacks.map((barStack, index) => (
              <AnimatedBars
                key={`${index}-${barStack.bars.length}`}
                bars={barStack.bars}
                stroke={selectColor(theme?.bar.stroke, theme) ?? "white"}
                strokeWidth={selectColor(theme?.bar.strokeWidth, theme) ?? 1}
                // handleClick={handleClick}
                // selectionIds={selectionIds}
                // currentSelectionIds={currentSelectionIds}
                // theme={theme}
                {...rectProps}
              />
            ))}
            {(showPoints || showLabels) &&
              combinedData.map((d, i) => {
                let cum = 0;
                return keys.map((dataKey, ki) => {
                  const value = d[dataKey];
                  cum += value;
                  // const left = xScale(d.stack);
                  // const top = yScale(cum);
                  const left = xScale(cum);
                  const top = yScale(d.stack) + yScale.bandwidth() / 2;
                  const id = i * ki + ki;
                  const color = colorScale(dataKey) ?? "#222";
                  return (
                    <g key={`area-glyph-${id}`} className={`area-glyph-${id}`}>
                      {showPoints && (
                        <ChartGlyph
                          left={left}
                          top={top}
                          size={
                            isDefined(glyph)
                              ? glyph.size
                              : showPoints.size || theme.points.size
                          }
                          fill={isDefined(glyph) ? glyph.fill : color}
                          stroke={isDefined(glyph) ? glyph.stroke : color}
                          strokeWidth={
                            isDefined(glyph)
                              ? glyph.strokeWidth
                              : showPoints.strokeWidth ||
                                theme.points.strokeWidth
                          }
                          style={{ cursor: "pointer " }}
                          onClick={() => {
                            const selections = currentSelectionIds.includes(
                              d.selectionId
                            )
                              ? currentSelectionIds.filter(function(value) {
                                  return value !== d.selectionId;
                                })
                              : [...currentSelectionIds, d.selectionId];
                            handleClick(selections);
                          }}
                          onMouseMove={onMouseMove}
                          onMouseLeave={() => {
                            hideTooltip();
                          }}
                        />
                      )}
                      {showLabels && (
                        <Text
                          {...labelProps}
                          key={`line-label-${i}`}
                          x={left}
                          y={top}
                          dx="0.5em"
                          dy={0}
                          textAnchor="start"
                          verticalAnchor="middle"
                        >
                          {formatValue(value)}
                        </Text>
                      )}
                    </g>
                  );
                });
              })}
          </Group>
        );
      }}
    </BarStackHorizontal>
  ) : (
    <BarStack
      data={combinedData}
      keys={dataKeys}
      x={STACK_ACCESSOR}
      xScale={xScale}
      yScale={yScale}
      color={colorScale}
      offset={hasSomeNegativeValues ? "diverging" : undefined}
      // @TODO support all BarStack props
    >
      {(barStacks) => {
        // use this reference to find nearest mouse values
        stacks.current = barStacks;
        return (
          <Group className={"visx-bar-stack"}>
            {barStacks.map((barStack, index) => (
              <AnimatedBars
                key={`${index}-${barStack.bars.length}`}
                bars={barStack.bars}
                stroke={selectColor(theme?.bar.stroke, theme) ?? "white"}
                strokeWidth={selectColor(theme?.bar.strokeWidth, theme) ?? 1}
                // handleClick={handleClick}
                // selectionIds={selectionIds}
                // currentSelectionIds={currentSelectionIds}
                // theme={theme}
                {...rectProps}
              />
            ))}
            {(showPoints || showLabels) &&
              combinedData.map((d, i) => {
                let cum = 0;
                return keys.map((dataKey, ki) => {
                  const value = d[dataKey];
                  cum += value;
                  const left = xScale(d.stack) + xScale.bandwidth() / 2;
                  const top = yScale(cum);
                  const id = i * ki + ki;
                  const color = colorScale(dataKey) ?? "#222";
                  return (
                    <g key={`area-glyph-${id}`} className={`area-glyph-${id}`}>
                      {showPoints && (
                        <ChartGlyph
                          left={left}
                          top={top}
                          size={
                            isDefined(glyph)
                              ? glyph.size
                              : showPoints.size || theme.points.size
                          }
                          fill={isDefined(glyph) ? glyph.fill : color}
                          stroke={isDefined(glyph) ? glyph.stroke : color}
                          strokeWidth={
                            isDefined(glyph)
                              ? glyph.strokeWidth
                              : showPoints.strokeWidth ||
                                theme.points.strokeWidth
                          }
                          style={{ cursor: "pointer " }}
                          onClick={() => {
                            const selections = currentSelectionIds.includes(
                              d.selectionId
                            )
                              ? currentSelectionIds.filter(function(value) {
                                  return value !== d.selectionId;
                                })
                              : [...currentSelectionIds, d.selectionId];
                            handleClick(selections);
                          }}
                          onMouseMove={onMouseMove}
                          onMouseLeave={() => {
                            hideTooltip();
                          }}
                        />
                      )}
                      {showLabels && (
                        <Text
                          {...labelProps}
                          key={`line-label-${i}`}
                          x={left}
                          y={top}
                          dx={0}
                          dy="-0.74em"
                          textAnchor="middle"
                          verticalAnchor="end"
                        >
                          {formatValue(value)}
                        </Text>
                      )}
                    </g>
                  );
                });
              })}
          </Group>
        );
      }}
    </BarStack>
  );
}
