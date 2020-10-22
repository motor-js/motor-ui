<<<<<<< HEAD:src/lib/components/React/XYChart/xy-chart/hooks/useDataRegistry.js
// import { useEffect, useContext } from "react";
// import ChartContext from "../context/ChartContext";

// export default function useDataRegistry({
//   data,
//   key,
//   xAccessor,
//   yAccessor,
//   mouseEvents,
//   legendShape,
//   findNearestDatum,
// }) {
//   const { registerData, unregisterData } = useContext(ChartContext);
//   console.log("key", key);

//   // register data on mount
//   useEffect(() => {
//     registerData({
//       [key]: {
//         key,
//         data,
//         xAccessor,
//         yAccessor,
//         mouseEvents,
//         legendShape,
//         findNearestDatum,
//       },
//     });
//     return () => unregisterData(key);
//   }, [
//     registerData,
//     unregisterData,
//     key,
//     data,
//     xAccessor,
//     yAccessor,
//     mouseEvents,
//     legendShape,
//     findNearestDatum,
//   ]);
// }
=======
import { useEffect, useContext } from "react";
import ChartContext from "../components/visx/context/ChartContext";

export default function useDataRegistry({
  data,
  key,
  xAccessor,
  yAccessor,
  elAccessor,
  mouseEvents,
  legendShape,
  findNearestDatum,
}) {
  const { registerData, unregisterData } = useContext(ChartContext);

  // register data on mount
  useEffect(() => {
    registerData({
      [key]: {
        key,
        data,
        xAccessor,
        yAccessor,
        elAccessor,
        mouseEvents,
        legendShape,
        findNearestDatum,
      },
    });
    return () => unregisterData(key);
  }, [
    registerData,
    unregisterData,
    key,
    data,
    xAccessor,
    yAccessor,
    elAccessor,
    mouseEvents,
    legendShape,
    findNearestDatum,
  ]);
}
>>>>>>> c5e5508d531a7ee168b90232147cdef6eba4c64f:src/lib/hooks/useDataRegistry.js
