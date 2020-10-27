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
