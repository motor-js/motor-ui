import React, {
  useContext,
  useMemo,
  useEffect,
  useRef,
  // useCallback,
} from "react";
import { extent } from "d3-array";
import AreaStack from "./AreaStack";
import ChartContext from "../../context/ChartContext";

// import findNearestDatumY from "../../util/findNearestDatumY";
// import findNearestDatumX from "../../util/findNearestDatumX";

export default function Stack({ children }) {
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
    // handleClick,
    // currentSelectionIds,
    // selectionIds,
  } = useContext(ChartContext) || {};

  // extract data keys from child series
  const dataKeys = useMemo(
    () => React.Children.map(children, (child) => child.props.dataKey),
    [children]
  );

  // use a ref to the stacks for mouse movements
  const stacks = useRef(null);

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

      data.forEach((d) => {
        const stack = xAccessor(d);
        const stackKey = String(stack);
        if (!dataByStackValue[stackKey]) {
          dataByStackValue[stackKey] = {
            stack,
            positiveSum: 0,
            negativeSum: 0,
          };
        }
        const value = yAccessor(d);
        dataByStackValue[stackKey][dataKey] = value;
        dataByStackValue[stackKey]["selectionId"] = elAccessor(d);
        dataByStackValue[stackKey][
          value >= 0 ? "positiveSum" : "negativeSum"
        ] += value;
      });
    });

    return Object.values(dataByStackValue);
  }, [children]);

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
      };

      // only need to update the domain for one of the keys
      if (comprehensiveDomain.length > 0 && dataKeys.indexOf(key) === 0) {
        dataToRegister[key].yScale = (scale) =>
          scale.domain(
            extent([...scale.domain(), ...comprehensiveDomain], (d) => d)
          );
      }
    });

    registerData(dataToRegister);

    // unregister data on unmount
    return () => unregisterData(Object.keys(dataToRegister));
  }, [comprehensiveDomain, registerData, unregisterData, children, dataKeys]);

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

  const Console = (prop) => (
    console[Object.keys(prop)[0]](...Object.values(prop)),
    null // ➜ React components must return something
  );

  return (
    // @TODO types
    <AreaStack
      top={margin.top}
      left={margin.left}
      data={combinedData}
      keys={dataKeys}
      x={(d) => xScale(d.data.stack)}
      y0={(d) => yScale(d[0])}
      y1={(d) => yScale(d[1])}
      offset={hasSomeNegativeValues ? "diverging" : undefined}
      color={colorScale}
    >
      {({ stacks, path, color }) =>
        stacks.map((stack, i) =>
          !path(stack).includes("MNaN") ? (
            <path
              key={`stack-${stack.key}`}
              d={path(stack) || ""}
              stroke="transparent"
              // fill="url(#stacked-area-orangered)"
              // fill="url(#stacked-area-orangered)"
              fill={color(stack.key, i)}
              stroke="#fff"
              // fillOpacity={0.7}
              // strokeWidth={1}
              // curve={
              //   "linear"
              //   // interpolatorLookup[interpolation] || interpolatorLookup.monotoneX
              // }
              onClick={() => {
                if (events) alert(`${stack.key}`);
              }}
              onMouseMove={() => {
                console.log("d");
              }}
              // defined={defined}
              // onClick={
              //   disableMouseEvents
              //     ? null
              //     : onClick &&
              //       (({ series, index }) => (event) => {
              //         const datum = findClosestDatum({
              //           data: series,
              //           getX: (d) => x(d.data),
              //           event,
              //           xScale,
              //           marginLeft: margin.left,
              //         });
              //         onClick({
              //           event,
              //           data,
              //           seriesKey: series.key,
              //           datum: datum && datum.data,
              //           color: stackFills[index],
              //         });
              //       })
              // }
              // onMouseMove={
              //   disableMouseEvents
              //     ? null
              //     : onMouseMove &&
              //       (({ series, index }) => (event) => {
              //         const datum = findClosestDatum({
              //           data: series,
              //           getX: (d) => x(d.data),
              //           event,
              //           xScale,
              //           marginLeft: margin.left,
              //         });
              //         onMouseMove({
              //           event,
              //           data,
              //           seriesKey: series.key,
              //           datum: datum && datum.data,
              //           color: stackFills[index],
              //         });
              //       })
              // }
              // onMouseLeave={disableMouseEvents ? null : () => onMouseLeave}
            />
          ) : null
        )
      }
    </AreaStack>
  );
}
