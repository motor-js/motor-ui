import { useContext } from "react";
import ChartContext from "../context/ChartContext";

export default function useRegisteredData(dataKey) {
  const { dataRegistry } = useContext(ChartContext);

  return dataRegistry[dataKey] || null;
}
