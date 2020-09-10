import React, {
  useContext,
  useMemo,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { extent } from "d3-array";
import AreaStack from "./AreaStack";
import ChartContext from "../../context/ChartContext";

import findNearestDatumY from "../../util/findNearestDatumY";
import findNearestDatumX from "../../util/findNearestDatumX";

export default function Stack({ children, ...rectProps }) {
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
    handleClick,
    currentSeelctionIds,
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
    });

    registerData(dataToRegister);

    // unregister data on unmount
    return () => unregisterData(Object.keys(dataToRegister));
  }, [registerData, unregisterData, children, dataKeys]);

  // if scales and data are not available in the registry, bail
  if (
    dataKeys.some((key) => dataRegistry[key] == null) ||
    !xScale ||
    !yScale ||
    !colorScale
  ) {
    return null;
  }

  // console.log(combinedData);

  // const getY0 = (d) => d && d.y0;
  // const getY1 = (d) => d && d.y1;
  // const x = (d) => d && d.x;

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
      color={colorScale}
    >
      {({ stacks, path, color }) =>
        stacks.map((stack, i) => (
          <path
            key={`stack-${stack.key}`}
            d={path(stack) || ""}
            stroke="transparent"
            // fill="url(#stacked-area-orangered)"
            // fill="url(#stacked-area-orangered)"
            fill={color(stack.key, i)}
            onClick={() => {
              if (events) alert(`${stack.key}`);
            }}
          />
        ))
      }
    </AreaStack>
  );
}
