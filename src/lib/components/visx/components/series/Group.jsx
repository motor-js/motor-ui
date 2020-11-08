import React, { useContext, useMemo, useEffect, useCallback } from "react";
import BarGroup from "./BarGroup";
import BarGroupHorizontal from "./BarGroupHorizontal";
import { Group as VisxGroup } from "@visx/group";
import { scaleBand } from "@visx/scale";
import ChartContext from "../../context/ChartContext";
import { isValidNumber } from "../../utils/chartUtils";

// import findNearestDatumX from "../../utils/findNearestDatumX";
// import findNearestDatumY from "../../utils/findNearestDatumY";
import AnimatedBars from "./AnimatedBars";
import { Text } from "@visx/text";

const GROUP_ACCESSOR = (d) => d.group;

// @TODO add GroupKeys type
export default function Group({
  horizontal,
  // showLabels,
  children,
  ...rectProps
}) {
  const {
    width,
    height,
    margin,
    xScale,
    yScale,
    showLabels,
    colorScale,
    dataRegistry,
    registerData,
    unregisterData,
    theme,
    formatValue,
    // handleClick,
    // currentSelectionIds,
    valueLabelStyle,
    size,
  } = useContext(ChartContext);

  // extract data keys from child series
  const dataKeys = useMemo(
    () => React.Children.map(children, (child) => child.props.dataKey),
    [children]
  );

  //
  const groupScale = useMemo(
    () =>
      scaleBand({
        domain: [...dataKeys],
        range: [0, (horizontal ? yScale : xScale)?.bandwidth?.()],
        padding: 0.1,
      }),
    [dataKeys, xScale, yScale, horizontal]
  );

  // @todo, this should be refactored such that it can be memoized.
  // currently it references groupScale which depends on xScale, yScale,
  // and thus causes an infinite loop for updating the data registry.
  // const findNearestDatum = useCallback(
  //   (args) => {
  //     // const nearestDatum = horizontal
  //     //   ? findNearestDatumY(args)
  //     //   : findNearestDatumX(args);

  //     // console.log(args.key);
  //     const groupIndex = Number(event.target.getAttribute("groupIndex"));
  //     const index = Number(event.target.getAttribute("index")) + 1;
  //     console.log(args.data[groupIndex][index].qText);

  //     const nearestDatum = {
  //       key: args.data[groupIndex][index].qText,
  //       datum: [args.data[groupIndex][index]],
  //       index,
  //     };
  //     // console.log(nearestDatum);
  //     if (!nearestDatum) return null;

  //     // const distanceX = horizontal
  //     //   ? nearestDatum.distanceX
  //     //   : Math.abs(
  //     //       args.svgMouseX -
  //     //         (args.xScale(args.xAccessor(nearestDatum.datum)) +
  //     //           groupScale(args.key) +
  //     //           groupScale.bandwidth() / 2)
  //     //     );

  //     // const distanceX = horizontal
  //     //   ? nearestDatum.distanceX
  //     //   : Math.abs(
  //     //       args.svgMouseX -
  //     //         (args.xScale(args.xAccessor(nearestDatum.datum)) +
  //     //           Number(event.target.getAttribute("x")) +
  //     //           (Number(event.target.getAttribute("width")) * 4) / 2)
  //     //     );

  //     // console.log(nearestDatum.datum);
  //     const distanceX = args.svgMouseX - Number(event.target.getAttribute("x"));

  //     const distanceY = horizontal
  //       ? Math.abs(
  //           args.svgMouseY -
  //             (args.yScale(args.yAccessor(nearestDatum.datum)) +
  //               groupScale(args.key) +
  //               groupScale.bandwidth() / 2)
  //         )
  //       // : nearestDatum.distanceY;
  //     :  0;

  //     console.log(distanceX, distanceY);

  //     return {
  //       ...nearestDatum,
  //       distanceX,
  //       distanceY,
  //     };
  //   },
  //   [horizontal]
  // );

  useEffect(
    // register all child data
    () => {
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
          elAccessor,
          yAccessor,
          mouseEvents,
          // findNearestDatum,
        };
      });

      registerData(dataToRegister);
      return () => unregisterData(Object.keys(dataToRegister));
    },
    // @TODO fix findNearestDatum
    // can't include findNearestDatum as it depends on groupScale which depends
    // on the registry so will cause an infinite loop.
    [
      horizontal,
      registerData,
      unregisterData,
      children,
      // findNearestDatum,
      dataKeys,
    ]
  );

  // merge all child data by x value
  const combinedData = useMemo(() => {
    const dataByGroupValue = {};
    dataKeys.forEach((key) => {
      const { data = [], xAccessor, yAccessor, elAccessor } =
        dataRegistry[key] || {};

      // this should exist but double check
      if (!xAccessor || !yAccessor || !elAccessor) return;

      data.forEach((d) => {
        const group = (horizontal ? yAccessor : xAccessor)(d);
        const groupKey = String(group);
        if (!dataByGroupValue[groupKey]) dataByGroupValue[groupKey] = { group };
        dataByGroupValue[groupKey][key] = (horizontal ? xAccessor : yAccessor)(
          d
        );
        dataByGroupValue[groupKey]["selectionId"] = elAccessor(d);
      });
    });
    return Object.values(dataByGroupValue);
  }, [horizontal, dataKeys, dataRegistry]);

  // if scales and data are not available in the registry, bail
  if (
    dataKeys.some((key) => dataRegistry[key] == null) ||
    !xScale ||
    !yScale ||
    !colorScale
  ) {
    return null;
  }

  // @TODO handle NaNs from non-number inputs, prob fallback to 0
  // @TODO should consider refactoring base shapes to handle negative values better
  const scaledZeroPosition = (horizontal ? xScale : yScale)(0);

  const minValue = Math.min(...xScale.domain());

  const minPosition = xScale(minValue < 0 ? 0 : minValue);

  // try to figure out the 0 baseline for correct rendering of negative values
  // we aren't sure if these are numeric scales or not a priori
  // @ts-ignore
  const maybeXZero = xScale(0);
  // @ts-ignore
  const maybeYZero = yScale(0);

  const [xMin, xMax] = xScale.range();
  const [yMax, yMin] = yScale.range();

  const xZeroPosition = isValidNumber(maybeXZero)
    ? // if maybeXZero _is_ a number, but the scale is not clamped and it's outside the domain
      // fallback to the scale's minimum
      Math.max(maybeXZero, Math.min(xMin, xMax))
    : Math.min(xMin, xMax);

  const { valueLabelStyles } = theme;

  const labelProps = {
    ...valueLabelStyles,
    fontSize: valueLabelStyles.fontSize[size],
    ...valueLabelStyle,
    dx: horizontal ? "0.5em" : 0,
    dy: horizontal ? 0 : "-0.74em",
    textAnchor: horizontal ? "start" : "middle",
    verticalAnchor: horizontal ? "middle" : "end",
  };

  return horizontal ? (
    <BarGroupHorizontal
      data={combinedData}
      keys={dataKeys}
      width={width - margin.left - margin.right} // this is unused, should be removed in component
      x={(xValue) => xScale(xValue)}
      y0={GROUP_ACCESSOR}
      y0Scale={yScale} // group position
      y1Scale={groupScale}
      xScale={xScale}
      color={colorScale}
    >
      {(barGroups) =>
        barGroups.map((barGroup, index) => (
          // @TODO if we use <animated.g /> we might be able to make this animate on first render
          <VisxGroup
            key={`bar-group-${barGroup.index}-${barGroup.y0}`}
            top={barGroup.y0}
          >
            <AnimatedBars
              bars={barGroup.bars}
              x={(bar) => Math.min(scaledZeroPosition, bar.x)}
              y={(bar) => bar.y}
              width={(bar) => Math.abs(bar.width - scaledZeroPosition)}
              height={(bar) => bar.height}
              rx={2}
              // handleClick={handleClick}
              // currentSelectionIds={currentSelectionIds}
              index={index}
              {...rectProps}
            />
            {showLabels &&
              barGroup.bars.map((bar) => (
                <Text
                  {...labelProps}
                  key={`bar-label-${bar.index}-${bar.x}`}
                  x={Math.max(minPosition, bar.width)}
                  y={bar.y + bar.height / 2}
                >
                  {formatValue(bar.value)}
                </Text>
              ))}
          </VisxGroup>
        ))
      }
    </BarGroupHorizontal>
  ) : (
    <BarGroup
      data={combinedData}
      keys={dataKeys}
      height={height - margin.top - margin.bottom} // BarGroup should figure this out from yScale
      x0={GROUP_ACCESSOR}
      x0Scale={xScale} // group position
      x1Scale={groupScale}
      yScale={yScale}
      color={(dataKey) => colorScale(dataKey)}
    >
      {(barGroups) =>
        barGroups.map((barGroup, index) => (
          <VisxGroup
            key={`bar-group-${barGroup.index}-${barGroup.x0}`}
            left={barGroup.x0}
          >
            <AnimatedBars
              bars={barGroup.bars}
              x={(bar) => bar.x}
              y={(bar) => Math.min(scaledZeroPosition, bar.y)}
              width={(bar) => bar.width}
              height={(bar) => Math.abs(scaledZeroPosition - bar.y)}
              rx={2}
              // handleClick={handleClick}
              // currentSelectionIds={currentSelectionIds}
              index={index}
              {...rectProps}
            />
            {showLabels &&
              barGroup.bars.map((bar) => (
                <Text
                  {...labelProps}
                  key={`bar-label-${bar.index}-${bar.x}`}
                  x={bar.x + bar.width / 2}
                  y={bar.y}
                >
                  {formatValue(bar.value)}
                </Text>
              ))}
          </VisxGroup>
        ))
      }
    </BarGroup>
  );
}