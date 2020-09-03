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
