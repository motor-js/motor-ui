<<<<<<< HEAD:src/lib/components/React/XYChart/xy-chart/enhancers/withRegisteredData.jsx
// import React, { useContext } from "react";
// import ChartContext from "../context/ChartContext";
// import useDataRegistry from "../hooks/useDataRegistry";

// /**
//  * An HOC that handles registering the Series's data and renders the
//  * `BaseSeriesComponent` only if x and y scales are available in context. This is
//  * useful for avoiding nasty syntax with undefined scales when using hooks.
//  */
// export default function withRegisteredData(
//   BaseSeriesComponent,
//   { findNearestDatum, legendShape }
// ) {
//   const WrappedSeriesComponent = (props) => {
//     const { dataKey, data, xAccessor, yAccessor, mouseEvents } = props;
//     const { xScale, yScale, dataRegistry } = useContext(ChartContext);

//     useDataRegistry({
//       key: dataKey,
//       data,
//       xAccessor,
//       yAccessor,
//       mouseEvents,
//       legendShape: legendShape?.(props),
//       findNearestDatum: findNearestDatum?.(props),
//     });
=======
import React, { useContext } from "react";
import ChartContext from "../context/ChartContext";
import useDataRegistry from "../../../hooks/useDataRegistry";

/**
 * An HOC that handles registering the Series's data and renders the
 * `BaseSeriesComponent` only if x and y scales are available in context. This is
 * useful for avoiding nasty syntax with undefined scales when using hooks.
 */
export default function withRegisteredData(
  BaseSeriesComponent,
  { findNearestDatum, legendShape }
) {
  const WrappedSeriesComponent = (props) => {
    const {
      dataKey,
      data,
      xAccessor,
      yAccessor,
      elAccessor,
      mouseEvents,
    } = props;
    const { xScale, yScale, dataRegistry } = useContext(ChartContext);

    useDataRegistry({
      key: dataKey,
      data,
      xAccessor,
      yAccessor,
      elAccessor,
      mouseEvents,
      legendShape: legendShape?.(props),
      findNearestDatum: findNearestDatum?.(props),
    });
>>>>>>> c5e5508d531a7ee168b90232147cdef6eba4c64f:src/lib/components/visx/enhancers/withRegisteredData.jsx

//     return xScale && yScale && dataRegistry?.[dataKey]?.data === data ? (
//       <BaseSeriesComponent {...props} />
//     ) : null;
//   };

//   return WrappedSeriesComponent;
// }
