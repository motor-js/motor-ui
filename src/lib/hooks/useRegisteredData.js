import { useContext } from "react";
import ChartContext from "../components/React/visx/context/ChartContext";

export default function useRegisteredData(dataKey) {
  const { dataRegistry } = useContext(ChartContext);

  return dataRegistry[dataKey] || null;
}
